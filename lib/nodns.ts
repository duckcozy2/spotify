export const cancelEndpoint='https://ctv.nodns.vn/api/v1/spotify/cancel'
export const grantEndpoint='https://ctv.nodns.vn/api/v1/spotify'
export type CancelResult={state:'confirmed'|'rejected'|'unknown';code:string}

export function providerResult(payload:unknown,uid:string,kind:'grant'|'cancel',packageId?:string):CancelResult{
  if(!payload||typeof payload!=='object')return {state:'unknown',code:'unrecognized_response'}
  const value=payload as Record<string,unknown>
  const data=value.data&&typeof value.data==='object'?value.data as Record<string,unknown>:value
  if(kind==='grant'&&typeof data.packageId==='string'&&data.packageId!==packageId)return {state:'unknown',code:'conflicting_response'}
  if((typeof data.uid==='string'&&data.uid!==uid)||(kind==='cancel'&&data.active===true)||(kind==='grant'&&data.active===false))return {state:'unknown',code:'conflicting_response'}
  if(value.success===false||['error','failed','failure'].includes(String(value.status).toLowerCase()))return {state:'rejected',code:'provider_rejected'}
  if(value.success===true||value.status==='success')return {state:'confirmed',code:'confirmed'}
  return {state:'unknown',code:'unrecognized_response'}
}
export function cancelResult(payload:unknown,uid:string){return providerResult(payload,uid,'cancel')}

export async function requestCancellation(uid:string,key:string,transport:typeof fetch=fetch):Promise<CancelResult>{
  return requestPremium('cancel',uid,key,undefined,transport)
}
export async function requestPremium(kind:'grant'|'cancel',uid:string,key:string,packageId?:string,transport:typeof fetch=fetch):Promise<CancelResult>{
  if(!/^[a-zA-Z0-9._-]{1,128}$/.test(uid)||!key)return {state:'rejected',code:'invalid_configuration'}
  if(kind==='grant'&&!['1month','3month','6month','12month'].includes(packageId||''))return {state:'rejected',code:'invalid_package'}
  try{
    const response=await transport(kind==='cancel'?cancelEndpoint:grantEndpoint,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key},body:JSON.stringify(kind==='cancel'?{uid}:{uid,packageId}),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)})
    // Never automatically retry an account mutation: a timeout may happen after the provider acted.
    if([401,403,400,404,422,429].includes(response.status))return {state:'rejected',code:'http_'+response.status}
    if(!response.ok)return {state:'unknown',code:'http_'+response.status}
    const text=await response.text()
    if(text.length>20000)return {state:'unknown',code:'unrecognized_response'}
    try{return providerResult(JSON.parse(text),uid,kind,packageId)}catch{return {state:'unknown',code:'unrecognized_response'}}
  }catch{return {state:'unknown',code:'connection_uncertain'}}
}
