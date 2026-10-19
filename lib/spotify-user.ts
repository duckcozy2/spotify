export function spotifyUserId(input:string):string|null {
  let value=input.trim()
  if(value.startsWith('spotify:user:')) value=value.slice(13)
  else if(/^https?:\/\//i.test(value)) {
    try {const url=new URL(value);if(url.protocol!=='https:'||url.hostname!=='open.spotify.com')return null;const match=url.pathname.match(/^\/(?:intl-[a-z-]+\/)?user\/([^/]+)\/?$/i);if(!match)return null;value=decodeURIComponent(match[1])}catch{return null}
  }
  return /^[a-zA-Z0-9._-]{1,128}$/.test(value)?value:null
}
export function validPhone(value:string){return /^(?:0\d{9}|\+84\d{9})$/.test(value.replace(/[\s().-]/g,''))}
