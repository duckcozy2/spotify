'use client'
import {usePublicSettings} from './public-settings'
import {youtubeVideoId} from '@/lib/youtube'
import DnsProfileGuide from './dns-profile-guide'

const steps=[
  'Vào cài đặt và quyền riêng tư.',
  'Vào chất lượng nội dung nghe nhìn và để hết thành tự động.',
  'Vào tiết kiệm dữ liệu và ngoại tuyến, chọn luôn bật.',
  'Vuốt xuống cuối chọn xoá bộ nhớ đệm.',
  'Đăng xuất tài khoản và đăng nhập lại.',
  'Tận hưởng Spotify Premium.'
]
export default function PremiumGuide({completed}:{completed:boolean}){
  const settings=usePublicSettings()
  const videoId=youtubeVideoId(settings?.premiumGuideVideoUrl||'')
  return <section aria-labelledby="premium-guide-title" className="overflow-hidden rounded-2xl border border-accent/25 bg-accent/[.04]">
    <div className="border-b border-accent/15 p-4 sm:p-5"><p className="text-xs font-semibold uppercase tracking-wider text-accent">Thanh toán thành công</p><h3 id="premium-guide-title" className="mt-2 text-lg font-bold">Hướng dẫn sử dụng Spotify Premium</h3>{!completed&&<p className="mt-2 text-xs leading-6 text-muted">Premium đang được xử lý cấp gói. Bạn có thể xem trước hướng dẫn; thực hiện sau khi trạng thái hiển thị “Premium đã được cấp”.</p>}</div>
    <DnsProfileGuide/>
    <ol className="divide-y divide-white/10">{steps.map((step,index)=><li key={step} className="flex items-start gap-3 px-4 py-4 text-sm leading-7 sm:px-5"><span aria-hidden="true" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">{index+1}</span><p><span className="font-semibold text-accent">Bước {index+1}: </span>{step}</p></li>)}</ol>
    <div className="border-t border-white/10 p-4 sm:p-5"><h4 className="mb-3 text-sm font-semibold">Video YouTube hướng dẫn</h4>{videoId?<><div className="aspect-video overflow-hidden rounded-xl bg-black"><iframe src={'https://www.youtube-nocookie.com/embed/'+videoId} title="Video hướng dẫn sử dụng Spotify Premium" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="h-full w-full border-0"/></div><a href={'https://www.youtube.com/watch?v='+videoId} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-accent underline">Mở video trên YouTube ↗</a></>:<p className="rounded-xl border border-dashed border-white/15 p-4 text-xs leading-6 text-muted">Video hướng dẫn sẽ được cập nhật tại đây.</p>}</div>
  </section>
}
