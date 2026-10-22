'use client'
import Link from 'next/link'
import {premiumPlans} from '@/lib/plans'
import {usePublicSettings} from './public-settings'

const money=(value:number)=>new Intl.NumberFormat('vi-VN').format(value)+'đ'
export default function ArticlePricing(){
  const settings=usePublicSettings()
  return <section id="gia-hien-tai" className="scroll-mt-28 rounded-2xl border border-accent/25 bg-accent/5 p-5 sm:p-6" aria-labelledby="article-pricing-title">
    <h2 id="article-pricing-title" className="text-2xl font-bold">Giá các gói tại SpotifyPremium.vn</h2>
    <p className="mt-3 text-sm leading-7 text-muted">Giá niêm yết hiện tại của website, không phải bảng giá chính thức của Spotify. Số tiền cuối cùng được xác nhận trên đơn trước khi chuyển khoản.</p>
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[440px] text-left text-sm"><caption className="sr-only">Giá gói và chi phí quy đổi mỗi tháng</caption><thead><tr className="border-b border-white/15"><th scope="col" className="py-3 pr-4">Thời hạn</th><th scope="col" className="px-3 py-3">Trả một lần</th><th scope="col" className="py-3 pl-3">Bình quân/tháng</th></tr></thead><tbody>{premiumPlans.map(plan=>{
      const amount=settings?.prices[plan.id]??plan.price
      const months=Number.parseInt(plan.id,10)
      return <tr key={plan.id} className="border-b border-white/10"><th scope="row" className="py-4 pr-4 font-medium">{plan.name}</th><td className="px-3 py-4 font-semibold text-accent">{money(amount)}</td><td className="py-4 pl-3 text-muted">≈ {money(Math.round(amount/months))}</td></tr>
    })}</tbody></table></div>
    <p className="mt-4 text-xs leading-6 text-muted">Bình quân/tháng là phép chia để so sánh; gói được thanh toán toàn bộ một lần theo số tiền trên đơn.</p>
    <Link href="/bang-gia" className="mt-5 inline-flex text-sm font-semibold text-accent underline">Xem điều kiện và chọn gói →</Link>
  </section>
}
