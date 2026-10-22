'use client'
import {useEffect,useState} from 'react'
import type {publicPayment} from '@/lib/payment'
import PremiumGuide from './premium-guide'
export type Checkout=ReturnType<typeof publicPayment>&{token:string}
const money=(amount:number)=>new Intl.NumberFormat('vi-VN').format(amount)+'đ'
export default function PaymentCheckout({initial}:{initial:Checkout}){
  const [order,setOrder]=useState(initial),[error,setError]=useState(''),[copied,setCopied]=useState(''),[now,setNow]=useState(Date.now())
  const expired=!!order.expiresAt&&Date.parse(order.expiresAt)<=now
  useEffect(()=>{
    const abort=new AbortController()
    async function poll(){
      try{
        const response=await fetch('/api/checkout?id='+encodeURIComponent(initial.id),{headers:{Authorization:'Bearer '+initial.token},cache:'no-store',signal:abort.signal})
        if(!response.ok)throw new Error()
        const data=await response.json()
        if(!abort.signal.aborted){setOrder({...data,token:initial.token});setError('')}
      }catch{if(!abort.signal.aborted)setError('Chưa cập nhật được thanh toán. Hệ thống sẽ thử lại; vui lòng không chuyển khoản lần nữa.')}
    }
    if(order.status==='Hoàn tất'||order.status==='Đã hủy')return
    void poll()
    const timer=setInterval(()=>{setNow(Date.now());void poll()},5000)
    return()=>{clearInterval(timer);abort.abort()}
  },[initial.id,initial.token,order.paid,order.status])
  async function copy(value:string){try{await navigator.clipboard.writeText(value);setCopied(value)}catch{setError('Không thể sao chép. Bạn có thể sao chép thủ công thông tin bên dưới.')}}
  return <section aria-label="Thanh toán chuyển khoản" className="space-y-4" aria-live="polite">
    <h3 className="text-xl font-bold text-accent">{order.status==='Đã hủy'?'Đơn đã hủy':order.status==='Hoàn tất'?'Premium đã được cấp':order.paid?'Đã nhận thanh toán':expired?'Đã hết thời gian thanh toán':'Quét QR để thanh toán'}</h3>
    <p className="text-sm text-muted">{order.planName} · <strong className="text-white">{money(order.amount)}</strong></p>
    {order.status==='Đã hủy'?<p>Đơn đã hủy hoặc Premium đã được thu hồi. Liên hệ hỗ trợ nếu cần đối chiếu.</p>:order.paid?<p className="rounded-xl border border-accent/25 bg-accent/5 p-4 text-sm leading-7">{order.status==='Hoàn tất'?'Đơn hàng đã hoàn tất.':'Chuyển khoản đã được xác nhận. Đơn đang chờ xử lý cấp Premium.'}</p>:expired?<p className="text-sm leading-7 text-amber-200">Vui lòng không chuyển khoản theo mã này. Đóng và chọn lại gói để tạo đơn mới. Nếu đã chuyển tiền, liên hệ hỗ trợ kèm nội dung chuyển khoản bên dưới.</p>:<><img src={order.qrUrl} width={300} height={360} alt={'QR chuyển khoản '+money(order.amount)+' đến MB Bank '+order.bank.account} referrerPolicy="no-referrer" className="mx-auto max-w-full rounded-xl bg-white p-3" onError={()=>setError('Không tải được QR. Bạn có thể chuyển khoản bằng thông tin bên dưới.')}/><p className="text-xs leading-6 text-muted">QR có hiệu lực đến {order.expiresAt&&new Date(order.expiresAt).toLocaleTimeString('vi-VN')}. Chuyển đúng số tiền và giữ nguyên nội dung để được xác nhận tự động.</p></>}
    {order.paid&&order.status!=='Đã hủy'&&<PremiumGuide completed={order.status==='Hoàn tất'}/>}
    <dl className="space-y-3 rounded-xl border border-white/15 p-4 text-sm">
      <div><dt className="text-muted">Ngân hàng / Chủ tài khoản</dt><dd className="mt-1">{order.bank.name} · {order.bank.holder}</dd></div>
      {[{label:'Số tài khoản',value:order.bank.account},{label:'Số tiền (VND)',value:String(order.amount)},{label:'Nội dung chuyển khoản',value:order.transferContent||''}].map(row=><div key={row.label}><dt className="text-muted">{row.label}</dt><dd className="mt-1 flex flex-wrap items-center justify-between gap-2"><strong className="break-all font-mono">{row.value}</strong><button type="button" onClick={()=>copy(row.value)} className="text-xs text-accent underline">{copied===row.value?'Đã sao chép':'Sao chép'}</button></dd></div>)}
    </dl>
    {error&&<p role="alert" className="text-xs leading-6 text-amber-200">{error}</p>}
    <a href="/#lien-he" className="block text-sm text-accent underline">Liên hệ hỗ trợ thanh toán</a>
  </section>
}
