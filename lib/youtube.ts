export function youtubeVideoId(input:string):string|null{
  try{
    const url=new URL(input)
    if(url.protocol!=='https:'||url.username||url.password||url.port)return null
    let id:string|null=null
    if(url.hostname==='youtu.be')id=url.pathname.slice(1)
    else if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(url.hostname)){
      if(url.pathname==='/watch')id=url.searchParams.get('v')
      else id=url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)\/?$/)?.[1]||null
    }
    return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?id:null
  }catch{return null}
}
