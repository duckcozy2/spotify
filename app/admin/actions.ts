'use server'
import {redirect} from 'next/navigation'
import {revalidatePath} from 'next/cache'
import {randomUUID} from 'node:crypto'
import {checkPassword,clearAdminSession,isAdmin,setAdminSession} from '@/lib/admin-auth'
import {adminPlans,statuses,updateOrders} from '@/lib/admin-store'
import {readAdminContent,updateAdminContent} from '@/lib/admin-content'
import {spotifyUserId,validPhone} from '@/lib/spotify-user'
import {saveIntegrationKeys} from '@/lib/integration-config'
import {readPremiumOperations,runPremiumOperation,reviewPremiumOperation} from '@/lib/premium-operations'
import {youtubeVideoId} from '@/lib/youtube'
let failures=0,blockedUntil=0
export async function login(form:FormData){
  if(Date.now()<blockedUntil)redirect('/admin?error=limited')
  const password=String(form.get('password')||'')
  if(password.length>256||!checkPassword(password)){if(++failures>=8){blockedUntil=Date.now()+60000;failures=0}redirect('/admin?error=login')}
  failures=0;await setAdminSession();redirect('/admin')
}
export async function logout(){await clearAdminSession();redirect('/admin')}
async function authorize(){if(!await isAdmin())redirect('/admin')}
export async function savePremiumGuideVideo(form:FormData){
  await authorize()
  const url=String(form.get('premiumGuideVideoUrl')||'').trim()
  if(url&&(url.length>500||!youtubeVideoId(url)))redirect('/admin?tab=settings&error=video_url')
  await updateAdminContent(data=>({...data,settings:{...data.settings,premiumGuideVideoUrl:url}}))
  revalidatePath('/','layout');redirect('/admin?tab=settings&success=saved')
}
export async function saveIntegrations(form:FormData){
  await authorize()
  const values:Record<string,string>={}
  for(const key of ['nodnsKey','sepayKey']){
    const value=String(form.get(key)||'').trim()
    if(value&&!/^\S{8,256}$/.test(value))redirect('/admin?tab=api&error=integration_input')
    if(value)values[key]=value
  }
  await saveIntegrationKeys(values)
  revalidatePath('/admin');redirect('/admin?tab=api&success=integration_saved')
}
export async function processPremium(form:FormData){
  await authorize()
  const kind=form.get('kind')==='cancel'?'cancel':'grant'
  const tab=kind==='cancel'?'cancellations':'nodns'
  let outcome='unknown'
  try{outcome=(await runPremiumOperation(kind,String(form.get('orderId')||''),String(form.get('confirmation')||''))).state}
  catch(error){const code=error instanceof Error&&['unpaid_order','missing_key','invalid_order','already_completed','invalid_package','operation_locked'].includes(error.message)?error.message:'operation_error';redirect('/admin?tab='+tab+'&error='+code)}
  revalidatePath('/admin');redirect('/admin?tab='+tab+(outcome==='confirmed'?'&success='+kind:'&error=provider_'+outcome))
}
export async function reviewPremium(form:FormData){
  await authorize()
  const state=form.get('result')
  if(state!=='confirmed'&&state!=='rejected')redirect('/admin?tab=nodns&error=invalid_review')
  try{await reviewPremiumOperation(String(form.get('operationId')||''),state,String(form.get('note')||''))}
  catch{redirect('/admin?tab=nodns&error=invalid_review')}
  revalidatePath('/admin');redirect('/admin?tab=nodns&success=reviewed')
}
export async function savePrices(form:FormData){await authorize();const prices=Object.fromEntries(adminPlans.map(p=>[p.id,Number(form.get(p.id))]));if(Object.values(prices).some(v=>!Number.isSafeInteger(v)||v<1000||v>100000000))redirect('/admin?tab=plans&error=input');await updateAdminContent(data=>({...data,settings:{...data.settings,prices}}));revalidatePath('/','layout');redirect('/admin?tab=plans&success=saved')}
export async function saveCoupon(form:FormData){await authorize();const code=String(form.get('code')||'').trim().toUpperCase();const percent=Number(form.get('percent'));const expires=String(form.get('expires')||'');if(!/^[A-Z0-9_-]{3,32}$/.test(code)||!Number.isInteger(percent)||percent<1||percent>100||(expires&&!/^\d{4}-\d{2}-\d{2}$/.test(expires)))redirect('/admin?tab=coupons&error=input');await updateAdminContent(data=>({...data,coupons:[...data.coupons.filter(c=>c.code!==code),{code,percent,expires,enabled:form.get('enabled')==='on'}]}));revalidatePath('/admin');redirect('/admin?tab=coupons&success=saved')}
export async function toggleCoupon(form:FormData){await authorize();const code=String(form.get('code'));await updateAdminContent(data=>({...data,coupons:data.coupons.map(c=>c.code===code?{...c,enabled:!c.enabled}:c)}));revalidatePath('/admin');redirect('/admin?tab=coupons&success=saved')}
export async function savePublicSettings(form:FormData){await authorize();const links=Object.fromEntries(['zalo','telegram','facebook'].map(key=>[key,String(form.get(key)||'').trim()]));if(Object.values(links).some(value=>{try{return new URL(value).protocol!=='https:'}catch{return true}}))redirect('/admin?tab=settings&error=input');await updateAdminContent(data=>({...data,settings:{...data.settings,...links}}));revalidatePath('/','layout');redirect('/admin?tab=settings&success=saved')}
export async function saveAnnouncement(form:FormData){await authorize();const title=String(form.get('title')||'').trim(),body=String(form.get('body')||'').trim();if(!title||title.length>120||!body||body.length>1000)redirect('/admin?tab=announcement&error=input');await updateAdminContent(data=>({...data,settings:{...data.settings,announcement:{enabled:form.get('enabled')==='on',title,body}}}));revalidatePath('/','layout');redirect('/admin?tab=announcement&success=saved')}
export async function createOrder(form:FormData){await authorize();const username=spotifyUserId(String(form.get('username')||''));const phone=String(form.get('phone')||'').trim();const selected=adminPlans.find(p=>p.id===form.get('plan'));const content=await readAdminContent();const plan=selected?{...selected,price:content.settings.prices[selected.id]}:undefined;const note=String(form.get('note')||'').trim();if(!username||!validPhone(phone)||!plan||note.length>1000)redirect('/admin?tab=orders&error=order');const code=String(form.get('coupon')||'').trim().toUpperCase();const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const coupon=content.coupons.find(c=>c.code===code&&c.enabled&&(!c.expires||c.expires>=today));if(code&&!coupon)redirect('/admin?tab=orders&error=coupon');const amount=coupon?Math.round(plan.price*(100-coupon.percent)/100):plan.price;await updateOrders(orders=>[{id:randomUUID(),username,phone,planId:plan.id,planName:plan.name,amount,originalAmount:plan.price,couponCode:coupon?.code,status:'Chờ xử lý',paid:false,note,createdAt:new Date().toISOString()},...orders]);revalidatePath('/admin');redirect('/admin?tab=orders&success=created')}
export async function changeOrder(form:FormData){
  await authorize()
  const id=String(form.get('id')||'')
  const status=statuses.find(s=>s===form.get('status'))
  if(!status)redirect('/admin?tab=orders&error=order')
  const operations=await readPremiumOperations()
  try{await updateOrders(orders=>orders.map(order=>{
    if(order.id!==id)return order
    if(operations.some(operation=>operation.uid===order.username&&['pending','unknown'].includes(operation.state)))throw new Error('operation_locked')
    const paid=!!order.paymentTransactionId||form.get('paid')==='on'
    if(!paid&&status===statuses[2])throw new Error('unpaid_order')
    const latest=operations.find(operation=>operation.orderId===id&&operation.state==='confirmed')
    if(latest&&(status!==(latest.kind==='grant'?statuses[2]:statuses[3])||!paid))throw new Error('invalid_order')
    return {...order,status,paid,paidAt:paid?(order.paidAt||new Date().toISOString()):undefined}
  }))}catch(error){const code=error instanceof Error&&['operation_locked','unpaid_order','invalid_order'].includes(error.message)?error.message:'order';redirect('/admin?tab=orders&error='+code)}
  revalidatePath('/admin');redirect('/admin?tab=orders&success=updated')
}
