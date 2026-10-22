import {randomBytes,randomUUID} from 'node:crypto'
import {readAdminContent} from '@/lib/admin-content'
import {readOrders,updateOrders,type Order} from '@/lib/admin-store'
import {premiumPlans} from '@/lib/plans'
import {spotifyUserId,validPhone} from '@/lib/spotify-user'
import {publicPayment} from '@/lib/payment'
import {integrationConfig} from '@/lib/integration-config'

export const dynamic='force-dynamic'
export async function POST(request:Request){
  if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Yêu cầu không hợp lệ.'},{status:403})
  if(!(await integrationConfig()).sepayKey)return Response.json({error:'Thanh toán chưa được cấu hình. Vui lòng liên hệ hỗ trợ.'},{status:503})
  if(Number(request.headers.get('content-length'))>4096)return Response.json({error:'Yêu cầu quá dài.'},{status:413})
  let body
  try{body=await request.json()}catch{return Response.json({error:'Dữ liệu không hợp lệ.'},{status:400})}
  if(!body||typeof body!=='object')return Response.json({error:'Dữ liệu không hợp lệ.'},{status:400})
  const username=spotifyUserId(typeof body.username==='string'?body.username:'')
  const phone=typeof body.phone==='string'?body.phone.trim():''
  const plan=premiumPlans.find(plan=>plan.id===body.planId)
  if(!username||!validPhone(phone)||!plan)return Response.json({error:'Kiểm tra tài khoản, số điện thoại và gói đã chọn.'},{status:400})
  const content=await readAdminContent(),amount=content.settings.prices[plan.id]
  if(!Number.isSafeInteger(amount)||amount<1000||amount>100000000)return Response.json({error:'Giá gói chưa hợp lệ.'},{status:503})
  const now=new Date(),token=randomBytes(32).toString('hex')
  const order:Order={id:randomUUID(),username,phone,planId:plan.id,planName:plan.name,amount,originalAmount:amount,status:'Chờ xử lý',paid:false,note:'',createdAt:now.toISOString(),expiresAt:new Date(now.getTime()+30*60000).toISOString(),paymentToken:token,transferContent:'SP'+randomBytes(8).toString('hex').toUpperCase()}
  await updateOrders(orders=>[order,...orders])
  return Response.json({...publicPayment(order),token},{headers:{'Cache-Control':'no-store'}})
}
export async function GET(request:Request){
  const id=new URL(request.url).searchParams.get('id')
  const token=request.headers.get('authorization')?.replace(/^Bearer /,'')
  if(!id||!token)return Response.json({error:'Không tìm thấy đơn.'},{status:404})
  const order=(await readOrders()).find(o=>o.id===id&&o.paymentToken===token)
  if(!order)return Response.json({error:'Không tìm thấy đơn.'},{status:404})
  return Response.json(publicPayment(order),{headers:{'Cache-Control':'no-store'}})
}
