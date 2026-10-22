import {timingSafeEqual} from 'node:crypto'
import type {Order} from './admin-store'

export const bank={name:'MB Bank',bin:'970422',account:'5565662518',holder:'HO DANG ANH DUC'}
export function validWebhookKey(header:string|null,key:string){
  if(!key||!header)return false
  const actual=Buffer.from(header),expected=Buffer.from('Apikey '+key)
  return actual.length===expected.length&&timingSafeEqual(actual,expected)
}
export type PaymentPayload={id?:unknown;gateway?:unknown;accountNumber?:unknown;transferType?:unknown;transferAmount?:unknown;code?:unknown;content?:unknown}
export function paymentOutcome(orders:Order[],payload:PaymentPayload,now=new Date()):string{
  if(!/^[1-9]\d*$/.test(String(payload.id??''))||!Number.isSafeInteger(payload.transferAmount)||Number(payload.transferAmount)<=0)return 'invalid'
  if(payload.transferType!=='in')return 'outgoing'
  if(String(payload.accountNumber)!==bank.account)return 'wrong_account'
  if(!['mbbank','mb bank','mb'].includes(String(payload.gateway).toLowerCase()))return 'wrong_bank'
  if(orders.some(order=>order.paymentTransactionId===String(payload.id)))return 'duplicate'
  const codes=Array.from(new Set((String(payload.code??'')+' '+String(payload.content??'')).toUpperCase().match(/\bSP[A-F0-9]{16}\b/g)))
  if(codes.length!==1)return 'no_order_code'
  const order=orders.find(order=>order.transferContent===codes[0])
  if(!order)return 'order_not_found'
  if(order.paid||order.status==='Đã hủy')return 'order_not_pending'
  if(!order.expiresAt||Date.parse(order.expiresAt)<=now.getTime())return 'expired'
  if(order.amount!==payload.transferAmount)return 'amount_mismatch'
  return 'matched'
}
export function reconcilePayment(orders:Order[],payload:PaymentPayload,now=new Date()):Order[]{
  if(paymentOutcome(orders,payload,now)!=='matched')return orders
  if(payload.transferType!=='in'||String(payload.accountNumber)!==bank.account)return orders
  if(!['mbbank','mb bank','mb'].includes(String(payload.gateway).toLowerCase()))return orders
  const transaction=String(payload.id??'')
  if(!/^[1-9]\d*$/.test(transaction)||!Number.isSafeInteger(payload.transferAmount)||Number(payload.transferAmount)<=0)return orders
  if(orders.some(order=>order.paymentTransactionId===transaction))return orders
  const codes=Array.from(new Set((String(payload.code??'')+' '+String(payload.content??'')).toUpperCase().match(/\bSP[A-F0-9]{16}\b/g)))
  if(codes.length!==1)return orders
  return orders.map(order=>order.transferContent===codes[0]&&!order.paid&&order.status!=='Đã hủy'&&order.expiresAt&&Date.parse(order.expiresAt)>now.getTime()&&order.amount===payload.transferAmount
    ?{...order,paid:true,paidAt:now.toISOString(),paymentTransactionId:transaction,status:'Đang xử lý'}:order)
}
export function publicPayment(order:Order){
  const params=new URLSearchParams({acc:bank.account,bank:bank.bin,amount:String(order.amount),des:order.transferContent!,template:'compact'})
  return {id:order.id,planName:order.planName,amount:order.amount,transferContent:order.transferContent,expiresAt:order.expiresAt,paid:order.paid,status:order.status,bank,qrUrl:'https://vietqr.app/img?'+params}
}
