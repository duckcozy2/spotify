'use client'
import {createContext,useContext,useEffect,useState} from 'react'
import type {PublicSettings} from '@/lib/admin-content'
import {X} from 'lucide-react'
const SettingsContext=createContext<PublicSettings|null>(null)
export const usePublicSettings=()=>useContext(SettingsContext)
export function PublicSettingsProvider({settings,children}:{settings:PublicSettings;children:React.ReactNode}){return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>}
export function WelcomeAnnouncement(){const settings=usePublicSettings();const [open,setOpen]=useState(false);const announcement=settings?.announcement;useEffect(()=>{if(!announcement?.enabled)return;try{if(sessionStorage.getItem('welcome-announcement')===announcement.title+'|'+announcement.body)return}catch{}setOpen(true)},[announcement?.enabled,announcement?.title,announcement?.body]);if(!open||!announcement)return null;return <aside role="region" aria-label="Thông báo website" className="fixed bottom-6 right-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-accent/25 bg-[#111b2e] p-5 pr-10 shadow-2xl"><button type="button" onClick={()=>{setOpen(false);try{sessionStorage.setItem('welcome-announcement',announcement.title+'|'+announcement.body)}catch{}}} aria-label="Đóng thông báo website" className="absolute right-2 top-2 p-2 text-muted"><X size={16}/></button><h2 className="font-bold text-accent">{announcement.title}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">{announcement.body}</p></aside>}
