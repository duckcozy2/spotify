'use client'

import {useEffect,useState} from 'react'
import Link from 'next/link'
import {ArrowRight,Music2,X} from 'lucide-react'

const buyers=['@minh***','@nam***','@trang***','@huy***','@linh***','@tuan***','@vy***','@duc***']
const packages=['Premium 1 tháng','Premium 1 năm','Premium vĩnh viễn']
type Notice={buyer:string;plan:string;key:number}

export default function PurchaseNotices(){
  const [notice,setNotice]=useState<Notice|null>(null)
  const [dismissed,setDismissed]=useState(false)
  useEffect(()=>{
    if(dismissed)return
    let timer:ReturnType<typeof setTimeout>
    function schedule(){timer=setTimeout(()=>{
      setNotice({
        buyer:buyers[Math.floor(Math.random()*buyers.length)],
        plan:packages[Math.floor(Math.random()*packages.length)],
        key:Date.now(),
      })
      timer=setTimeout(()=>{setNotice(null);schedule()},6000)
    },8000+Math.random()*7000)}
    schedule()
    return()=>clearTimeout(timer)
  },[dismissed])
  if(!notice)return null
  return <aside key={notice.key} aria-label="Thông báo mua hàng" aria-live="polite" className="purchase-notice fixed bottom-4 left-4 z-40 w-[calc(100%-2rem)] max-w-[420px] overflow-hidden rounded-[24px] border border-white/15 bg-[#101a2b]/95 p-4 text-[#f6f7ff] shadow-[0_18px_55px_rgba(0,0,0,.45)] backdrop-blur-2xl sm:bottom-6 sm:left-6 sm:p-5">
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"/>
    <button type="button" onClick={()=>{setNotice(null);setDismissed(true)}} className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Đóng thông báo"><X size={15}/></button>
    <div className="flex items-start gap-3.5 sm:gap-4">
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/20 to-[#263c60] text-accent shadow-[0_0_24px_rgba(81,243,187,.12)] sm:h-14 sm:w-14"><Music2 size={25} strokeWidth={1.8}/></span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="pr-7 text-sm leading-5 sm:text-[15px]"><span className="font-bold">{notice.buyer}</span><span className="text-white/65"> vừa chọn gói</span></p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-medium text-white/75">{notice.plan}</span>
          <Link href="/bang-gia" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-bold text-[#07130f] shadow-[0_4px_16px_rgba(81,243,187,.2)] hover:brightness-110">Xem gói <ArrowRight size={14}/></Link>
        </div>
      </div>
    </div>
  </aside>
}
