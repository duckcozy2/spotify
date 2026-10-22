import type {Metadata} from 'next'
import {articlePath,type Article} from './articles'
import {siteUrl} from './seo'

export function articleMetadata(article:Article):Metadata{
  return {title:{absolute:article.title+' | SpotifyPremium.vn'},description:article.description,keywords:article.keyword?[article.keyword]:undefined,alternates:{canonical:articlePath(article)},openGraph:{type:'article',title:article.title,description:article.description,url:siteUrl+articlePath(article),locale:'vi_VN',siteName:'SpotifyPremium.vn'},twitter:{card:'summary',title:article.title,description:article.description}}
}
