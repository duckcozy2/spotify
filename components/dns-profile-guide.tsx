export const dnsProfileUrl='http://103.101.161.228:8082/spotify-mitm.mobileconfig'

export default function DnsProfileGuide(){
  return <section aria-labelledby="dns-profile-title" className="border-b border-white/10 p-4 sm:p-5">
    <h4 id="dns-profile-title" className="text-base font-bold">Tải và cài Profile DNS trên iPhone</h4>
    <p className="mt-2 text-xs leading-6 text-muted">Mở trang này bằng Safari trên iPhone để tải profile và làm theo hướng dẫn bên dưới.</p>
    <a href={dnsProfileUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="cta mt-4 w-full !text-sm">Tải Profile DNS ↓</a>
    <p className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-6 text-amber-100">Chỉ cài khi bạn tin cậy nguồn cung cấp. Bật tin cậy CA có thể cho phép bên vận hành kiểm tra lưu lượng HTTPS. Link tải hiện dùng HTTP; nội dung profile chưa được website xác minh.</p>
    <ol className="mt-4 space-y-3 text-sm leading-7">
      <li className="flex items-start gap-3"><span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-xs font-bold text-sky-300">1</span><p>Nhấn <strong>Tải Profile DNS</strong> ở trên → Safari mở → chọn <strong>Cho phép</strong>.</p></li>
      <li className="flex items-start gap-3"><span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-xs font-bold text-sky-300">2</span><p>Vào <strong>Cài đặt → Đã tải về Profile</strong> → nhấn <strong>Cài đặt</strong> → nhập mật khẩu iPhone nếu cần.</p></li>
      <li className="flex items-start gap-3"><span aria-hidden="true" className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-xs font-bold text-sky-300">3</span><p>Vào <strong>Cài đặt → Cài đặt chung → Giới thiệu → Tin cậy chứng chỉ</strong> → bật công tắc CA của profile nếu bạn đã kiểm tra và tin cậy đơn vị phát hành.</p></li>
    </ol>
    <a href="https://support.apple.com/en-us/102390" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-accent underline">Xem hướng dẫn về tin cậy chứng chỉ của Apple ↗</a>
  </section>
}
