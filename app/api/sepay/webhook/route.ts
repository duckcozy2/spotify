import {updateOrders} from '@/lib/admin-store'
import {paymentOutcome,reconcilePayment,validWebhookKey} from '@/lib/payment'
import {integrationConfig} from '@/lib/integration-config'
import {recordPaymentEvent} from '@/lib/payment-events'
import {readPremiumOperations,runPremiumOperation} from '@/lib/premium-operations'

export async function POST(request:Request){
  const key=(await integrationConfig()).sepayKey
  if(!key)return Response.json({success:false},{status:503})
  if(!validWebhookKey(request.headers.get('authorization'),key))return Response.json({success:false},{status:401})
  if(Number(request.headers.get('content-length'))>20000)return Response.json({success:false},{status:413})
  let payload
  try{const text=await request.text();if(text.length>20000)return Response.json({success:false},{status:413});payload=JSON.parse(text)}catch{return Response.json({success:false},{status:400})}
  if(!payload||typeof payload!=='object'||Array.isArray(payload))return Response.json({success:false},{status:400})
  let outcome='invalid'
  let orderId:string|undefined
  const now=new Date()
  await updateOrders(orders=>{
    outcome=paymentOutcome(orders,payload,now)
    const updated=reconcilePayment(orders,payload,now)
    orderId=['matched','duplicate'].includes(outcome)?updated.find(order=>order.paymentTransactionId===String(payload.id))?.id:undefined
    return updated
  })
  await recordPaymentEvent(payload,outcome)
  if(orderId){
    const attempted=(await readPremiumOperations()).some(operation=>operation.orderId===orderId&&operation.kind==='grant')
    if(!attempted){
      try{await runPremiumOperation('grant',orderId)}
      catch(error){
        if(!(error instanceof Error)||!['missing_key','operation_locked','invalid_order','already_completed','invalid_package','unpaid_order'].includes(error.message))throw error
      }
    }
  }
  return Response.json({success:true})
}
