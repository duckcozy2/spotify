import './globals.css'
import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {siteUrl} from '@/lib/seo'
import SiteFrame from '@/components/site-frame'
import {readAdminContent} from '@/lib/admin-content'
import {PublicSettingsProvider} from '@/components/public-settings'
const base=siteUrl
const beVietnamPro=localFont({
  src:[
    {path:'./fonts/be-vietnam-pro-400.ttf',weight:'400',style:'normal'},
    {path:'./fonts/be-vietnam-pro-500.ttf',weight:'500',style:'normal'},
    {path:'./fonts/be-vietnam-pro-600.ttf',weight:'600',style:'normal'},
    {path:'./fonts/be-vietnam-pro-700.ttf',weight:'700',style:'normal'},
    {path:'./fonts/be-vietnam-pro-800.ttf',weight:'800',style:'normal'},
  ],
  variable:'--font-be-vietnam-pro',display:'swap',preload:false,
  fallback:['Arial','Helvetica','sans-serif'],
})
export const metadata:Metadata={metadataBase:new URL(base),title:{default:'SpotifyPremium.vn | Tìm hiểu & nâng cấp Spotify Premium',template:'%s | SpotifyPremium.vn'},description:'Khám phá quyền lợi Spotify Premium, tham khảo bảng giá, hướng dẫn đăng ký và giải đáp câu hỏi thường gặp.',robots:{index:true,follow:true},openGraph:{type:'website',locale:'vi_VN',siteName:'SpotifyPremium.vn'}}
export default async function RootLayout({children}:{children:React.ReactNode}){const {settings}=await readAdminContent();return <html lang="vi" className={beVietnamPro.variable}><body><PublicSettingsProvider settings={settings}><SiteFrame>{children}</SiteFrame></PublicSettingsProvider></body></html>}
