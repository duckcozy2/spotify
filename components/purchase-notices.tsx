'use client'

import {useEffect,useState} from 'react'
import Link from 'next/link'
import {ArrowUpRight,Music2,Sparkles,X} from 'lucide-react'

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
  return <aside key={notice.key} aria-label="Thông báo mua hàng" aria-live="polite" className="purchase-notice fixed bottom-4 left-4 z-40 w-[calc(100%-2rem)] max-w-[380px] overflow-hidden rounded-[22px] border border-white/[.12] bg-[#0e191c]/95 text-[#f6f7ff] shadow-[0_20px_60px_rgba(0,0,0,.5),inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-2xl sm:bottom-6 sm:left-6">
    <div aria-hidden="true" className="pointer-events-none absolute -left-12 -top-20 h-44 w-44 rounded-full bg-accent/10 blur-3xl"/>
    <div className="relative p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/45"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(81,243,187,.6)]"/>Lựa chọn Premium</p>
        <button type="button" onClick={()=>{setNotice(null);setDismissed(true)}} className="-m-2 flex h-9 w-9 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" aria-label="Đóng thông báo"><X size={16}/></button>
      </div>
      <div className="flex items-center gap-3.5">
        <span aria-hidden="true" className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] border border-accent/20 bg-gradient-to-br from-accent/20 to-accent/[.03] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,.08)]"><Music2 size={25} strokeWidth={1.7}/><span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#0e191c] bg-accent text-[#0e191c]"><Sparkles size={10} strokeWidth={2.5}/></span></span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold tracking-tight">{notice.buyer}</p>
          <p className="mt-1 text-xs leading-5 text-white/45">Vừa chọn <span className="font-medium text-white/85">{notice.plan}</span></p>
        </div>
      </div>
      <Link href="/bang-gia" className="group mt-5 flex items-center justify-between rounded-xl border border-accent/15 bg-accent/[.08] px-3.5 py-3 text-xs font-semibold text-accent transition-colors hover:border-accent/35 hover:bg-accent/[.15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"><span>Khám phá gói Premium</span><ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"/></Link>
    </div>
    <div aria-hidden="true" className="h-0.5 bg-white/5"><div className="purchase-notice-progress h-full origin-left bg-gradient-to-r from-accent/20 to-accent/70"/></div>
  </aside>
}
