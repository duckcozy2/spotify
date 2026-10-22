import {notFound,permanentRedirect} from 'next/navigation'
import ArticlePage from '@/components/article-page'
import {articles,articlePath} from '@/lib/articles'
import {articleMetadata} from '@/lib/article-metadata'

type Props={params:Promise<{slug:string}>}
export const dynamicParams=false
export function generateStaticParams(){return articles.map(a=>({slug:a.slug}))}
export async function generateMetadata({params}:Props){const {slug}=await params;const article=articles.find(a=>a.slug===slug);return article?articleMetadata(article):{}}
export default async function Page({params}:Props){const {slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)notFound();if(article.rootPath)permanentRedirect(articlePath(article));return <ArticlePage article={article}/>}
