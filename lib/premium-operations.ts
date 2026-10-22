import {randomUUID} from 'node:crypto'
import {readPrivate,updatePrivate} from './private-store'
import {readOrders,updateOrders} from './admin-store'
import {integrationConfig} from './integration-config'
import {requestPremium,type CancelResult} from './nodns'
import {premiumPlans} from './plans'

export type PremiumOperation={id:string;kind:'grant'|'cancel';orderId:string;uid:string;packageId?:string;state:'pending'|CancelResult['state'];code:string;createdAt:string;finishedAt?:string;reviewNote?:string}
export async function readPremiumOperations(){return readPrivate<PremiumOperation[]>('premium-operations',[])}
async function syncOrder(operation:PremiumOperation){
  if(operation.state!=='confirmed')return
  await updateOrders(orders=>orders.map(order=>order.id===operation.orderId?{...order,status:operation.kind==='grant'?'Hoàn tất':'Đã hủy'}:order))
}
export async function runPremiumOperation(kind:'grant'|'cancel',orderId:string,confirmation?:string){
  const order=(await readOrders()).find(order=>order.id===orderId)
  if(!order||!order.paid)throw new Error('unpaid_order')
  if(kind==='grant'&&order.status==='Đã hủy')throw new Error('invalid_order')
  const history=await readPremiumOperations()
  const completed=history.find(record=>record.orderId===orderId&&record.kind===kind&&record.state==='confirmed')
  if(completed){
    // Repair a local write interrupted after receiving provider success; never resend the mutation.
    const latest=history.find(record=>record.orderId===orderId&&record.state==='confirmed')
    if(latest)await syncOrder(latest)
    return {state:'confirmed' as const,code:'already_confirmed'}
  }
  if(order.status==='Đã hủy'||(kind==='cancel'&&(order.status!=='Hoàn tất'||confirmation!==order.username)))throw new Error('invalid_order')
  // A manually completed historical order is already fulfilled; do not grant it again.
  if(kind==='grant'&&order.status==='Hoàn tất')throw new Error('already_completed')
  const packageId=order.planId==='1year'||order.planId==='year'?'12month':order.planId==='month'?'1month':order.planId
  if(kind==='grant'&&!premiumPlans.some(plan=>plan.id===packageId))throw new Error('invalid_package')
  const {nodnsKey}=await integrationConfig()
  if(!nodnsKey)throw new Error('missing_key')
  const operation:PremiumOperation={id:randomUUID(),kind,orderId,uid:order.username,packageId:kind==='grant'?packageId:undefined,state:'pending',code:'pending',createdAt:new Date().toISOString()}
  await updatePrivate<PremiumOperation[]>('premium-operations',[],records=>{
    if(records.some(record=>record.uid===order.username&&(record.state==='pending'||record.state==='unknown'))||records.some(record=>record.orderId===orderId&&record.kind===kind&&record.state==='confirmed'))throw new Error('operation_locked')
    return [operation,...records]
  })
  const result=await requestPremium(kind,order.username,nodnsKey,operation.packageId)
  const finished={...operation,...result,finishedAt:new Date().toISOString()}
  await updatePrivate<PremiumOperation[]>('premium-operations',[],records=>records.map(record=>record.id===operation.id?finished:record))
  await syncOrder(finished)
  return result
}
export async function reviewPremiumOperation(id:string,state:'confirmed'|'rejected',note:string){
  if(note.trim().length<10||note.length>1000)throw new Error('invalid_review')
  let reviewed:PremiumOperation|undefined
  await updatePrivate<PremiumOperation[]>('premium-operations',[],records=>{
    const record=records.find(record=>record.id===id)
    if(!record||!['pending','unknown'].includes(record.state))throw new Error('invalid_review')
    // An in-flight call must finish before an operator can resolve its result.
    if(record.state==='pending'&&Date.parse(record.createdAt)>Date.now()-60000)throw new Error('operation_locked')
    reviewed={...record,state,code:'reviewed_by_admin',reviewNote:note.trim(),finishedAt:new Date().toISOString()}
    return records.map(item=>item.id===id?reviewed!:item)
  })
  if(reviewed)await syncOrder(reviewed)
}
