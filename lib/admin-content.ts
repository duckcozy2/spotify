import {mkdir,readFile,rename,writeFile} from 'node:fs/promises'
import path from 'node:path'
import {randomUUID} from 'node:crypto'
export type Coupon={code:string;percent:number;expires:string;enabled:boolean}
export type PublicSettings={zalo:string;telegram:string;facebook:string;announcement:{enabled:boolean;title:string;body:string};prices:Record<string,number>}
export type AdminContent={coupons:Coupon[];settings:PublicSettings}
const directory=path.resolve(process.env.ADMIN_DATA_DIR||path.join(process.cwd(),'.data'))
const file=path.join(directory,'content.json')
const defaults:AdminContent={coupons:[],settings:{zalo:'https://zalo.me/g/3mdkix3pinjmxtozcjjp',telegram:'https://t.me/anhduckkkk',facebook:'https://www.facebook.com/duckcozy',announcement:{enabled:false,title:'Chào mừng đến SpotifyPremium.vn',body:'Chọn gói phù hợp hoặc liên hệ để được tư vấn.'},prices:{month:49000,year:299000,lifetime:499000}}}
let queue:Promise<unknown>=Promise.resolve()
export async function readAdminContent():Promise<AdminContent>{try{const data=JSON.parse(await readFile(file,'utf8'));return {coupons:data.coupons||[],settings:{...defaults.settings,...data.settings,prices:{...defaults.settings.prices,...data.settings?.prices},announcement:{...defaults.settings.announcement,...data.settings?.announcement}}}}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return structuredClone(defaults);throw error}}
export async function updateAdminContent(change:(data:AdminContent)=>AdminContent){const operation=queue.then(async()=>{const data=change(await readAdminContent());await mkdir(directory,{recursive:true});const temp=path.join(directory,'content-'+randomUUID()+'.tmp');await writeFile(temp,JSON.stringify(data,null,2),'utf8');await rename(temp,file)});queue=operation.catch(()=>{});await operation}
