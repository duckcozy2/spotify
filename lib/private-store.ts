import {getCloudflareContext} from '@opennextjs/cloudflare'
import {mkdir,readFile,rename,writeFile} from 'node:fs/promises'
import {randomUUID} from 'node:crypto'
import path from 'node:path'

type Database={prepare(sql:string):{bind(...values:unknown[]):{first<T>():Promise<T|null>;run():Promise<{meta?:{changes?:number}}>}}}
export async function runtimeConfig():Promise<Record<string,unknown>>{
  try{return {...process.env,...(await getCloudflareContext({async:true})).env} as unknown as Record<string,unknown>}
  catch{return process.env}
}
async function database(){
  const env=await runtimeConfig()
  if(env.DB)return env.DB as Database
  if(env.ASSETS)throw new Error('Configure the private DB binding before accepting orders on Cloudflare.')
  return null
}
const directory=path.resolve(process.env.ADMIN_DATA_DIR||path.join(process.cwd(),'.data'))
export async function readPrivate<T>(key:string,fallback:T):Promise<T>{
  const db=await database()
  if(db){const row=await db.prepare('SELECT value FROM private_state WHERE key = ?').bind(key).first<{value:string}>();return row?JSON.parse(row.value):structuredClone(fallback)}
  try{return JSON.parse(await readFile(path.join(directory,key+'.json'),'utf8'))}
  catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return structuredClone(fallback);throw error}
}
let queue:Promise<unknown>=Promise.resolve()
export async function updatePrivate<T>(key:string,fallback:T,change:(value:T)=>T){
  const db=await database()
  if(db){
    // Compare and swap prevents lost updates across Worker instances, including webhook retries.
    for(let attempt=0;attempt<20;attempt++){
      const row=await db.prepare('SELECT value, version FROM private_state WHERE key = ?').bind(key).first<{value:string;version:number}>()
      const value=JSON.stringify(change(row?JSON.parse(row.value):structuredClone(fallback)))
      const result=row
        ?await db.prepare('UPDATE private_state SET value = ?, version = version + 1 WHERE key = ? AND version = ?').bind(value,key,row.version).run()
        :await db.prepare('INSERT OR IGNORE INTO private_state (key,value,version) VALUES (?,?,1)').bind(key,value).run()
      if(result.meta?.changes)return
    }
    throw new Error('Concurrent update; please retry.')
  }
  const operation=queue.then(async()=>{
    const value=change(await readPrivate(key,fallback))
    await mkdir(directory,{recursive:true})
    const temp=path.join(directory,key+'-'+randomUUID()+'.tmp')
    await writeFile(temp,JSON.stringify(value,null,2),'utf8')
    await rename(temp,path.join(directory,key+'.json'))
  })
  queue=operation.catch(()=>{});await operation
}
