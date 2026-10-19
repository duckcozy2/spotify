'use client'

import {useEffect,useState} from 'react'
import {Music2,X} from 'lucide-react'

const names=['@minh***','@nam***','@trang***','@huy***','@linh***','@tuan***','@vy***','@duc***']
const packages=['Premium 1 tháng','Premium 1 năm','Premium vĩnh viễn']
type Notice={name:string;plan:string;key:number}

export default function PurchaseNotices(){
  const [notice,setNotice]=useState<Notice|null>(null)
  const [dismissed,setDismissed]=useState(false)
  useEffect(()=>{
    if(dismissed)return
    let timer:ReturnType<typeof setTimeout>
    let previous=-1
    function schedule(){timer=setTimeout(()=>{
      const index=(previous+1+Math.floor(Math.random()*(names.length-1)))%names.length
      previous=index
      setNotice({name:names[index],plan:packages[Math.floor(Math.random()*packages.length)],key:Date.now()})
      timer=setTimeout(()=>{setNotice(null);schedule()},6000)
    },8000+Math.random()*7000)}
    schedule()
    return()=>clearTimeout(timer)
  },[dismissed])
  if(!notice)return null
  return <aside key={notice.key} aria-label="Thông báo " className="purchase-notice fixed bottom-4 left-4 z-40 w-[calc(100%-2rem)] max-w-[440px] rounded-[22px] border border-white/15 border-t-2 border-t-accent bg-[#111b2e]/95 p-4 pr-10 text-[#f6f7ff] shadow-[0_12px_40px_rgba(0,0,0,.35)] backdrop-blur-xl sm:bottom-6 sm:left-6 sm:p-5 sm:pr-10">
    <button type="button" onClick={()=>{setNotice(null);setDismissed(true)}} className="absolute right-2 top-3 rounded-full p-1.5 text-muted hover:bg-white/10 hover:text-accent" aria-label="Tắt thông báo mẫu"><X size={16}/></button>
    <div className="flex items-center gap-3.5"><span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/25 to-[#263c60] text-accent shadow-[0_0_20px_rgba(81,243,187,.12)]"><Music2 size={26} strokeWidth={1.7}/></span><div className="min-w-0"><p className="mb-1 text-sm font-bold text-accent">Thông báo mẫu <span className="mx-1 text-white/25">·</span><span className="text-[11px] font-normal text-muted">Dữ liệu minh họa</span></p><p className="text-sm leading-6"><span className="font-bold">{notice.name}</span><span className="text-muted"> vừa chọn </span><span className="font-bold text-accent">{notice.plan}</span></p></div></div>
  </aside>
}
