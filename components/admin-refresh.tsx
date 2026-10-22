'use client'
import {useEffect,useTransition} from 'react'
import {useRouter} from 'next/navigation'
export default function AdminRefresh(){
  const router=useRouter(),[pending,start]=useTransition()
  useEffect(()=>{const timer=setInterval(()=>{if(document.visibilityState==='visible')start(()=>router.refresh())},15000);return()=>clearInterval(timer)},[router])
  return <button type="button" disabled={pending} onClick={()=>start(()=>router.refresh())} className="rounded-xl border border-white/15 px-4 py-2 text-xs text-muted disabled:opacity-50">{pending?'Đang cập nhật…':'Làm mới · tự cập nhật mỗi 15 giây'}</button>
}
