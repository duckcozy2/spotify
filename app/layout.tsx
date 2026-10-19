import './globals.css'
import type {Metadata} from 'next'
import {Header,Footer} from '@/components/site'
const base=process.env.NEXT_PUBLIC_SITE_URL||'https://example.com'
export const metadata:Metadata={metadataBase:new URL(base),title:{default:'AuraTune | Tìm hiểu & nâng cấp Spotify Premium',template:'%s | AuraTune'},description:'Khám phá quyền lợi Spotify Premium, tham khảo bảng giá, hướng dẫn đăng ký và giải đáp câu hỏi thường gặp.',robots:{index:process.env.NEXT_PUBLIC_SITE_URL?true:false,follow:true},openGraph:{type:'website',locale:'vi_VN',siteName:'AuraTune'}}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><Header/><main>{children}</main><Footer/></body></html>}
