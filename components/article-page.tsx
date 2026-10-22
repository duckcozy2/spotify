import Link from 'next/link'
import ArticleOffer from './article-offer'
import ArticlePricing from './article-pricing'
import {articleLinks,articlePath,type Article} from '@/lib/articles'
import {siteUrl} from '@/lib/seo'

export default function ArticlePage({article:a}:{article:Article}){
  const url=siteUrl+articlePath(a)
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'Article',headline:a.title,description:a.description,inLanguage:'vi-VN',mainEntityOfPage:url,keywords:a.keyword,publisher:{'@type':'Organization',name:'SpotifyPremium.vn',url:siteUrl}},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Trang chủ',item:siteUrl},{'@type':'ListItem',position:2,name:'Bài viết',item:siteUrl+'/bai-viet'},{'@type':'ListItem',position:3,name:a.title,item:url}]}
  ]}
  const sources=[a.source,...a.sources||[]]
  const related=articleLinks.filter(item=>item.href!==articlePath(a)).sort((x,y)=>Number(y.category===a.category)-Number(x.category===a.category)).slice(0,4)
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\u003c')}}/>
    <div className="section !pb-8">
      <nav aria-label="Đường dẫn" className="mb-7 flex flex-wrap gap-2 text-sm text-muted"><Link href="/">Trang chủ</Link><span aria-hidden="true">/</span><Link href="/bai-viet">Bài viết</Link><span aria-hidden="true">/</span><span>{a.category}</span></nav>
      <span className="pill">{a.category}</span>
      <h1 className="mt-7 max-w-4xl text-3xl font-black leading-tight md:text-5xl">{a.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{a.description}</p>
    </div>
    <div className="section grid items-start gap-10 !pt-4 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="glass rounded-2xl p-5 lg:sticky lg:top-28"><nav aria-label="Mục lục bài viết"><h2 className="mb-4 font-bold">Trong bài viết này</h2><ol className="space-y-3 text-sm leading-6 text-muted">{a.sections.map((s,i)=><li key={s.id}><a href={'#'+s.id} className="hover:text-accent">{i+1}. {s.title}</a></li>)}{a.pricing&&<li><a href="#gia-hien-tai" className="hover:text-accent">Giá gói hiện tại</a></li>}</ol></nav></aside>
      <article className="min-w-0 space-y-10">
        {a.sections.map(s=><section key={s.id} id={s.id} className="scroll-mt-28"><h2 className="mb-4 text-2xl font-bold">{s.title}</h2>{s.paragraphs.map(p=><p key={p} className="mb-4 leading-8 text-white/80">{p}</p>)}{s.steps&&<ol className="list-decimal space-y-3 pl-6 leading-8 text-white/80">{s.steps.map(step=><li key={step}>{step}</li>)}</ol>}</section>)}
        {a.pricing&&<ArticlePricing/>}
        <section aria-label="Nguồn tham khảo" className="rounded-2xl border border-white/10 p-5 text-sm leading-7 text-muted"><p>Nguồn tham khảo và đối chiếu:</p><ul className="mt-2 list-disc space-y-2 pl-5">{sources.map(source=><li key={source.url}><a href={source.url} className="text-accent underline" target={source.url.startsWith('https:')?'_blank':undefined} rel="noopener noreferrer">{source.title}</a></li>)}</ul><p className="mt-3">Tính năng và điều kiện có thể thay đổi theo gói, thiết bị và khu vực. Kiểm tra thông tin áp dụng cho tài khoản trước khi đăng ký.</p></section>
        <ArticleOffer/>
        <section><h2 className="mb-4 text-2xl font-bold">Đọc thêm</h2><ul className="space-y-3">{related.map(item=><li key={item.href}><Link href={item.href} className="text-accent hover:underline">{item.title} →</Link></li>)}</ul></section>
        <Link href="/bai-viet" className="secondary">← Tất cả bài viết</Link>
      </article>
    </div>
  </>
}
