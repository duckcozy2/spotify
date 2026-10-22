import {readPrivate,updatePrivate,runtimeConfig} from './private-store'

type Secrets={nodnsKey?:string;sepayKey?:string}
export async function integrationConfig(){
  const [stored,env]=await Promise.all([readPrivate<Secrets>('integration-secrets',{}),runtimeConfig()])
  return {nodnsKey:stored.nodnsKey||String(env.NODNS_API_KEY||''),sepayKey:stored.sepayKey||String(env.SEPAY_WEBHOOK_API_KEY||'')}
}
export async function saveIntegrationKeys(values:Secrets){
  await updatePrivate<Secrets>('integration-secrets',{},current=>({...current,...values}))
}
