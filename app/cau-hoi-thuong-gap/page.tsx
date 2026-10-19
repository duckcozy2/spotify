import type {Metadata} from 'next'
import {PageHero,FAQs} from '@/components/site'
export const metadata:Metadata={title:'Câu hỏi thường gặp về Spotify Premium',description:'Giải đáp câu hỏi về Spotify Premium, quyền lợi, bảo mật, đăng ký và thiết bị.'}
export default function Page(){return <><PageHero eyebrow="HỖ TRỢ" title="Câu hỏi thường gặp" description="Những thông tin cần biết trước khi lựa chọn Spotify Premium."/><section className="section"><FAQs/></section></>}
