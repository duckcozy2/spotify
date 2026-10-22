'use client'
import {useFormStatus} from 'react-dom'
export default function AdminSubmit({children,className}:{children:React.ReactNode;className?:string}){
  const {pending}=useFormStatus()
  return <button type="submit" disabled={pending} className={(className||'rounded-xl bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20')+' disabled:cursor-wait disabled:opacity-50'}>{pending?'Đang xử lý…':children}</button>
}
