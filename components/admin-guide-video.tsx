import {savePremiumGuideVideo} from '@/app/admin/actions'
import AdminSubmit from './admin-submit'
export default function AdminGuideVideo({url}:{url?:string}){
  return <div className="mt-8 border-t border-white/10 pt-6"><h3 className="font-bold">Video hướng dẫn sau thanh toán</h3><p className="mt-2 text-sm leading-7 text-muted">Video xuất hiện dưới bảng 6 bước khi đơn được xác nhận đã thanh toán. Để trống để ẩn video.</p><form action={savePremiumGuideVideo} className="mt-4 space-y-4"><label className="block text-sm">Link YouTube<input name="premiumGuideVideoUrl" type="url" maxLength={500} defaultValue={url||''} placeholder="https://www.youtube.com/watch?v=…" className="mt-2 w-full rounded-xl border border-white/15 bg-[#10182a] px-4 py-3 text-sm outline-none focus:border-accent"/></label><AdminSubmit>Lưu video hướng dẫn</AdminSubmit></form></div>
}
