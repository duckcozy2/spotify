'use client'
import {useEffect,useRef,useState} from 'react'
import {CheckCircle2,LoaderCircle,UserRound,X} from 'lucide-react'
import {spotifyUserId,validPhone} from '@/lib/spotify-user'
type Profile={id:string;name:string;image:string|null;url:string}
export default function PlanDialog({plan,onClose}:{plan:{name:string;price:string};onClose:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null)
  const [username,setUsername]=useState('')
  const [phone,setPhone]=useState('')
  const [profile,setProfile]=useState<Profile|null>(null)
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const [retry,setRetry]=useState(0)
  const [confirmed,setConfirmed]=useState(false)
  const [copied,setCopied]=useState(false)
  const id=spotifyUserId(username)
  useEffect(()=>{
    const element=dialog.current
    if(element&&!element.open)element.showModal()
    const previous=document.body.style.overflow
    document.body.style.overflow='hidden'
    // Removing the element closes it. Calling close() during effect cleanup
    // queues a close event that dismisses the reopened dialog in Strict Mode.
    return()=>{document.body.style.overflow=previous}
  },[])
  useEffect(()=>{
    setProfile(null);setError('');setConfirmed(false);setCopied(false)
    if(!username.trim()){setLoading(false);return}
    if(!id){setLoading(false);setError('Dùng Spotify ID hoặc link hồ sơ, không dùng email hay tên hiển thị.');return}
    const abort=new AbortController()
    setLoading(true)
    const timer=setTimeout(async()=>{
      try{
        const response=await fetch('/api/spotify/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:id}),signal:abort.signal})
        const data=await response.json()
        if(abort.signal.aborted)return
        if(!response.ok)throw new Error(data.error||'Không thể kiểm tra tài khoản.')
        if(data.id!==id||typeof data.name!=='string')throw new Error('Hồ sơ trả về không khớp. Vui lòng thử lại.')
        setProfile(data)
      }catch(cause){if(!abort.signal.aborted)setError(cause instanceof Error?cause.message:'Không thể kết nối. Vui lòng thử lại.')}
      finally{if(!abort.signal.aborted)setLoading(false)}
    },700)
    return()=>{clearTimeout(timer);abort.abort()}
  },[username,id,retry])
  const verified=profile?.id===id&&!loading&&!error
  const summary=`Gói: ${plan.name} - ${plan.price}\nSpotify: ${profile?.name} (${profile?.id})\nSố điện thoại: ${phone.trim()}`
  return <dialog ref={dialog} onClose={onClose} onClick={event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose()}}} aria-labelledby="plan-dialog-title" className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-white/20 bg-[#10182b] p-6 text-white shadow-2xl backdrop:bg-black/75 sm:p-8">
    <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-accent">{plan.price}</p><h2 id="plan-dialog-title" className="mt-2 text-2xl font-bold">Đăng ký {plan.name}</h2></div><button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Đóng"><X size={22}/></button></div>
    <form onSubmit={event=>{event.preventDefault();if(verified&&validPhone(phone))setConfirmed(true)}} className="space-y-5">
      <div><label htmlFor="spotify-username" className="mb-2 block text-sm font-semibold">Tên người dùng Spotify hoặc link hồ sơ</label><input autoFocus required id="spotify-username" value={username} onChange={event=>setUsername(event.target.value)} maxLength={300} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="Spotify ID hoặc https://open.spotify.com/user/…" aria-describedby="spotify-help spotify-status" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"/><p id="spotify-help" className="mt-2 text-xs leading-6 text-muted">Trong Spotify, mở hồ sơ → Chia sẻ → Sao chép liên kết hồ sơ. Không nhập mật khẩu.</p></div>
      <div id="spotify-status" aria-live="polite">{loading&&<p className="flex items-center gap-2 text-sm text-muted"><LoaderCircle size={16} className="animate-spin"/>Đang kiểm tra hồ sơ Spotify…</p>}{error&&<div className="rounded-xl border border-amber-300/25 bg-amber-300/5 p-3 text-sm leading-6 text-amber-100"><p>{error}</p>{id&&<button type="button" onClick={()=>setRetry(value=>value+1)} className="mt-2 font-semibold underline">Kiểm tra lại</button>}</div>}{verified&&profile&&<div className="flex items-center gap-4 rounded-2xl border border-accent/25 bg-accent/5 p-4">{profile.image?<img src={profile.image} alt={'Ảnh đại diện '+profile.name} referrerPolicy="no-referrer" className="h-14 w-14 rounded-full object-cover" onError={event=>{event.currentTarget.style.display='none'}}/>:<UserRound size={40} className="text-accent"/>}<div className="min-w-0"><p className="flex items-center gap-2 text-xs font-semibold text-accent"><CheckCircle2 size={14}/>Đã tìm thấy hồ sơ</p><p className="mt-1 break-words font-bold">{profile.name}</p><a href={profile.url} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-muted underline">{profile.id} ↗</a></div></div>}</div>
      <div><label htmlFor="customer-phone" className="mb-2 block text-sm font-semibold">Số điện thoại liên hệ</label><input required id="customer-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} value={phone} onChange={event=>{setPhone(event.target.value);setConfirmed(false);setCopied(false)}} placeholder="Ví dụ: 0912 345 678" aria-describedby="phone-help" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none focus:border-accent"/><p id="phone-help" className="mt-2 text-xs text-muted">{phone&&!validPhone(phone)?'Nhập số Việt Nam gồm 10 chữ số hoặc dạng +84.':'Dùng để liên hệ hỗ trợ gói bạn chọn.'}</p></div>
      <button type="submit" disabled={!verified||!validPhone(phone)} className="cta w-full disabled:cursor-not-allowed disabled:opacity-40">Xác nhận thông tin</button>
    </form>
    {confirmed&&<section aria-label="Thông tin đã xác nhận" className="mt-6 rounded-2xl border border-accent/25 p-4"><h3 className="font-bold text-accent">Thông tin sẵn sàng gửi tư vấn</h3><p className="mt-3 whitespace-pre-line text-sm leading-7">{summary}</p><p className="mt-3 text-xs leading-6 text-muted">Thông tin chưa được gửi hoặc lưu thành đơn hàng. Sao chép và gửi qua kênh liên hệ để tiếp tục đăng ký.</p><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(summary);setCopied(true)}catch{setCopied(false)}}} className="secondary mt-4 w-full !px-3">{copied?'Đã sao chép':'Sao chép thông tin'}</button><a href="/#lien-he" onClick={onClose} className="mt-4 block text-center text-sm font-semibold text-accent">Mở các kênh liên hệ →</a></section>}
  </dialog>
}
