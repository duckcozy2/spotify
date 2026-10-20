import {NextResponse} from 'next/server'
import {spotifyUserId} from '@/lib/spotify-user'
export const runtime='nodejs'
export const dynamic='force-dynamic'
let token:{value:string;expires:number}|undefined
let pendingToken:Promise<string>|undefined
const error=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{'Cache-Control':'no-store'}})
async function accessToken(){
  if(token&&token.expires>Date.now())return token.value
  if(pendingToken)return pendingToken
  pendingToken=(async()=>{
    const response=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{Authorization:'Basic '+Buffer.from(process.env.SPOTIFY_CLIENT_ID+':'+process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store',signal:AbortSignal.timeout(8000)})
    if(!response.ok)throw new Error('Spotify authorization failed')
    const data=await response.json()
    if(typeof data.access_token!=='string'||typeof data.expires_in!=='number')throw new Error('Invalid token response')
    token={value:data.access_token,expires:Date.now()+Math.max(0,data.expires_in-60)*1000}
    return token.value
  })()
  try{return await pendingToken}finally{pendingToken=undefined}
}
export async function POST(request:Request){
  if(Number(request.headers.get('content-length'))>2048)return error('Thông tin nhập quá dài.',413)
  let body
  try {const text=await request.text();if(text.length>2048)return error('Thông tin nhập quá dài.',413);body=JSON.parse(text)}catch{return error('Dữ liệu không hợp lệ.',400)}
  return lookup(body?.uid??body?.username)
}
export async function GET(request:Request){
  return lookup(new URL(request.url).searchParams.get('uid'))
}
async function lookup(input:unknown){
  const id=typeof input==='string'?spotifyUserId(input):null
  if(!id)return error('Nhập Spotify ID hoặc link hồ sơ open.spotify.com/user/… hợp lệ.',400)
  if(!process.env.SPOTIFY_CLIENT_ID||!process.env.SPOTIFY_CLIENT_SECRET)return error('Tính năng kiểm tra Spotify chưa sẵn sàng. Vui lòng liên hệ hỗ trợ.',503)
  try {
    const fetchProfile=async()=>fetch('https://api.spotify.com/v1/users/'+encodeURIComponent(id),{headers:{Authorization:'Bearer '+await accessToken()},cache:'no-store',signal:AbortSignal.timeout(8000)})
    let response=await fetchProfile()
    if(response.status===401){token=undefined;response=await fetchProfile()}
    if(response.status===404)return error('Không tìm thấy hồ sơ. Hãy kiểm tra Spotify ID hoặc dán link hồ sơ.',404)
    if(response.status===403)return error('Spotify chưa cho phép ứng dụng tra cứu hồ sơ này. Vui lòng liên hệ hỗ trợ.',403)
    if(response.status===429)return error('Spotify đang giới hạn lượt kiểm tra. Vui lòng thử lại sau.',429)
    if(response.status===401){token=undefined;return error('Kết nối Spotify cần được làm mới. Vui lòng thử lại.',502)}
    if(!response.ok)return error('Chưa kết nối được Spotify. Vui lòng thử lại sau.',502)
    const data=await response.json()
    if(data.id!==id)return error('Spotify trả về hồ sơ không khớp. Vui lòng thử lại.',502)
    const image=Array.isArray(data.images)?data.images.find((image:{url?:string})=>typeof image.url==='string'&&image.url.startsWith('https://'))?.url:null
    const name=typeof data.display_name==='string'?data.display_name.trim():''
    return NextResponse.json({id:data.id,name:name||id,hasDisplayName:!!name,image:image||null,url:'https://open.spotify.com/user/'+encodeURIComponent(id)},{headers:{'Cache-Control':'no-store'}})
  }catch{return error('Không thể kiểm tra Spotify lúc này. Vui lòng thử lại hoặc liên hệ hỗ trợ.',502)}
}
