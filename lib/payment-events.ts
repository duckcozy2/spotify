import {readPrivate,updatePrivate} from './private-store'
import type {PaymentPayload} from './payment'

export const paymentOutcomes:Record<string,string>={matched:'Đã khớp đơn',duplicate:'Thông báo lặp',invalid:'Dữ liệu không hợp lệ',outgoing:'Tiền ra',wrong_account:'Sai tài khoản nhận',wrong_bank:'Sai ngân hàng',no_order_code:'Không xác định được mã đơn SP',order_not_found:'Không tìm thấy đơn',order_not_pending:'Đơn đã thanh toán hoặc đã hủy',expired:'Đơn hết hạn',amount_mismatch:'Sai số tiền'}
export type PaymentEvent={transactionId:string;amount:number|null;content:string;account:string;gateway:string;direction:string;outcome:string;receivedAt:string;lastReceivedAt:string;deliveries:number}
export async function readPaymentEvents(){return readPrivate<PaymentEvent[]>('payment-events',[])}
export async function recordPaymentEvent(payload:PaymentPayload,outcome:string){
  const id=String(payload.id??'').slice(0,100)
  if(!/^[1-9]\d*$/.test(id))return
  const now=new Date().toISOString()
  await updatePrivate<PaymentEvent[]>('payment-events',[],events=>{
    const existing=events.find(event=>event.transactionId===id)
    if(existing)return events.map(event=>event.transactionId===id?{...event,outcome:event.outcome==='matched'?'matched':outcome,lastReceivedAt:now,deliveries:event.deliveries+1}:event)
    return [{transactionId:id,amount:Number.isSafeInteger(payload.transferAmount)?Number(payload.transferAmount):null,content:String(payload.content??payload.code??'').slice(0,500),account:String(payload.accountNumber??'').slice(0,50),gateway:String(payload.gateway??'').slice(0,50),direction:String(payload.transferType??'').slice(0,10),outcome,receivedAt:now,lastReceivedAt:now,deliveries:1},...events].slice(0,500)
  })
}
