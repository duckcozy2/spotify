import {premiumPlans} from './plans'
import {readPrivate,updatePrivate} from './private-store'
export type Coupon={code:string;percent:number;expires:string;enabled:boolean}
export type PublicSettings={zalo:string;telegram:string;facebook:string;premiumGuideVideoUrl?:string;announcement:{enabled:boolean;title:string;body:string};prices:Record<string,number>}
export type AdminContent={coupons:Coupon[];settings:PublicSettings}
const defaults:AdminContent={coupons:[],settings:{premiumGuideVideoUrl:'https://www.youtube.com/shorts/D37pD2XarOI',zalo:'https://zalo.me/g/3mdkix3pinjmxtozcjjp',telegram:'https://t.me/anhduckkkk',facebook:'https://www.facebook.com/duckcozy',announcement:{enabled:false,title:'Chào mừng đến SpotifyPremium.vn',body:'Chọn gói phù hợp hoặc liên hệ để được tư vấn.'},prices:Object.fromEntries(premiumPlans.map(plan=>[plan.id,plan.price]))}}
function normalize(data:AdminContent):AdminContent{return {coupons:data.coupons||[],settings:{...defaults.settings,...data.settings,prices:Object.fromEntries(premiumPlans.map(plan=>[plan.id,data.settings?.prices?.[plan.id]??(plan.id==='12month'?data.settings?.prices?.['1year']:undefined)??data.settings?.prices?.[plan.id==='1month'?'month':plan.id==='12month'?'year':plan.id]??plan.price])),announcement:{...defaults.settings.announcement,...data.settings?.announcement}}}}
export async function readAdminContent():Promise<AdminContent>{return normalize(await readPrivate('content',defaults))}
export async function updateAdminContent(change:(data:AdminContent)=>AdminContent){await updatePrivate('content',defaults,data=>change(normalize(data)))}
