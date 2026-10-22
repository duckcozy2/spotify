import {notFound} from 'next/navigation'
import ArticleMenu from '@/components/article-menu'
import ArticlePage from '@/components/article-page'
import {seoArticles} from '@/lib/seo-articles'
import {articleMetadata} from '@/lib/article-metadata'

type Props={params:Promise<{slug:string}>}
export const dynamicParams=false
export function generateStaticParams(){return seoArticles.map(article=>({slug:article.slug}))}
export async function generateMetadata({params}:Props){const {slug}=await params;const article=seoArticles.find(a=>a.slug===slug);return article?articleMetadata(article):{}}
export default async function Page({params}:Props){const {slug}=await params;const article=seoArticles.find(a=>a.slug===slug);if(!article)notFound();return <><ArticleMenu/><ArticlePage article={article}/></>}
