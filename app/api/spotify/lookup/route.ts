import {NextResponse} from 'next/server'
import {load} from 'cheerio'
import {spotifyUserId} from '@/lib/spotify-user'

export const runtime='nodejs'
export const dynamic='force-dynamic'
const headers={'Cache-Control':'no-store'}

export async function GET(request:Request){
  const params=new URL(request.url).searchParams
  const input=params.get('input')??params.get('url')??params.get('uid')??''
  const uid=input.length<=2048?spotifyUserId(input):null
  if(!uid)return NextResponse.json({success:false,error:'UID hoặc link Spotify không hợp lệ'},{status:400,headers})
  const profileUrl='https://open.spotify.com/user/'+encodeURIComponent(uid)
  const fallback={success:true,uid,display_name:null as string|null,avatar:null as string|null,profile_url:profileUrl,lookup_status:'unavailable',source:'public_metadata'}
  const unavailable=()=>NextResponse.json(fallback,{headers})
  try{
    const response=await fetch(profileUrl,{
      headers:{Accept:'text/html','Accept-Language':'en-US,en;q=0.9'},
      // A redirect may lead to a generic login page, not this user's profile.
      redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(8000),
    })
    if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))return unavailable()
    const reader=response.body?.getReader()
    if(!reader)return unavailable()
    const chunks:Uint8Array[]=[]
    let size=0
    try{
      while(true){
        const {done,value}=await reader.read()
        if(done)break
        size+=value.byteLength
        if(size>2_000_000){await reader.cancel();return unavailable()}
        chunks.push(value)
      }
    }finally{reader.releaseLock()}
    const $=load(Buffer.concat(chunks).toString('utf8'))
    const canonical=$('link[rel="canonical"]').attr('href')
    const ogUrl=$('meta[property="og:url"]').attr('content')
    // Require profile identity, and reject conflicting metadata.
    const identities=[canonical,ogUrl].filter((url):url is string=>!!url)
    if(!identities.length||identities.some(url=>spotifyUserId(url)!==uid))return unavailable()
    const rawTitle=$('meta[property="og:title"]').attr('content')??$('meta[name="twitter:title"]').attr('content')??''
    const name=rawTitle.replace(/\s*[|–-]\s*Spotify\s*$/i,'').trim()
    if(!name||/^(spotify|user profile|profile|spotify web player)$/i.test(name)||/^(spotify\s*[–|:-]|page not found|access denied|log in|sign up)/i.test(name))return unavailable()
    const rawImage=$('meta[property="og:image"]').attr('content')??$('meta[name="twitter:image"]').attr('content')??''
    let avatar:string|null=null
    try{
      const image=new URL(rawImage)
      if(image.protocol==='https:'&&!image.username&&!image.password&&['i.scdn.co','image-cdn-ak.spotifycdn.com'].includes(image.hostname))avatar=image.href
    }catch{}
    if(!avatar)return unavailable()
    return NextResponse.json({...fallback,display_name:name,avatar,lookup_status:'found'},{headers})
  }catch{return unavailable()}
}
