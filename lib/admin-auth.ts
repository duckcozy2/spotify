import {createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto'
import {cookies} from 'next/headers'
const cookieName='spotify_admin'
const duration=8*60*60
function equal(a:string,b:string){return timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest())}
export function adminConfigured(){return Boolean(process.env.ADMIN_PASSWORD&&process.env.ADMIN_SESSION_SECRET&&process.env.ADMIN_SESSION_SECRET.length>=32)}
export function checkPassword(password:string){return adminConfigured()&&equal(password,process.env.ADMIN_PASSWORD!)}
export function signSession(expires:number){const payload=expires+'.'+randomBytes(16).toString('hex');return payload+'.'+createHmac('sha256',process.env.ADMIN_SESSION_SECRET!).update(payload).digest('hex')}
export function validSession(value:string){if(!adminConfigured())return false;const [expires,nonce,signature,...extra]=value.split('.');if(extra.length||!/^\d+$/.test(expires)||!/^[a-f0-9]{32}$/.test(nonce||'')||!/^[a-f0-9]{64}$/.test(signature||''))return false;const now=Date.now();if(Number(expires)<=now||Number(expires)>now+duration*1000+1000)return false;return equal(signature,createHmac('sha256',process.env.ADMIN_SESSION_SECRET!).update(expires+'.'+nonce).digest('hex'))}
export async function isAdmin(){return validSession((await cookies()).get(cookieName)?.value||'')}
export async function setAdminSession(){(await cookies()).set(cookieName,signSession(Date.now()+duration*1000),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/admin',maxAge:duration})}
export async function clearAdminSession(){(await cookies()).set(cookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/admin',maxAge:0})}
