'use client'
import {usePathname} from 'next/navigation'
import {Header,Footer} from './site'
import PurchaseNotices from './purchase-notices'
import {WelcomeAnnouncement} from './public-settings'
export default function SiteFrame({children}:{children:React.ReactNode}){const pathname=usePathname();if(pathname==='/admin'||pathname.startsWith('/admin/'))return <>{children}</>;return <><Header/><main>{children}</main><Footer/><PurchaseNotices/><WelcomeAnnouncement/></>}
