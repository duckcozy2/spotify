import type {MetadataRoute} from 'next'
import {articleLinks} from '@/lib/articles'
import {siteUrl} from '@/lib/seo'
export const dynamic='force-static'
export default function sitemap():MetadataRoute.Sitemap{return ['','/bang-gia','/huong-dan','/cau-hoi-thuong-gap','/bai-viet',...articleLinks.map(a=>a.href)].map(path=>({url:siteUrl+path,changeFrequency:path===''||path==='/bai-viet'?'weekly':'monthly',priority:path===''?1:0.7}))}
