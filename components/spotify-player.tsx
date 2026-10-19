'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {ArrowUpRight, Music2, Play, Shuffle} from 'lucide-react'
import charts from '@/data/spotify-charts.json'

type PlaybackEvent = {data: {playingURI: string; isPaused: boolean; isBuffering: boolean; duration: number; position: number}}
type Controller = {
  loadUri: (uri: string) => void
  play: () => void
  destroy: () => void
  addListener: {
    (event: 'playback_update', callback: (event: PlaybackEvent) => void): void
    (event: 'ready', callback: () => void): void
  }
}
type SpotifyApi = {
  createController: (element: HTMLElement, options: {uri: string; width: string; height: number}, callback: (controller: Controller) => void) => void
}
let apiPromise: Promise<SpotifyApi> | undefined
function loadApi() {
  if (!apiPromise) apiPromise = new Promise<SpotifyApi>((resolve, reject) => {
    const spotifyWindow = window as typeof window & {onSpotifyIframeApiReady?: (api: SpotifyApi) => void}
    spotifyWindow.onSpotifyIframeApiReady = resolve
    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.onerror = () => { apiPromise = undefined; script.remove(); reject(new Error('Spotify unavailable')) }
    document.head.appendChild(script)
  })
  return apiPromise
}

export default function SpotifyPlayer() {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<Controller | null>(null)
  const current = useRef(0)
  const hasPlayed = useRef(false)
  const pendingPlay = useRef(true)
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [started, setStarted] = useState(false)
  const track = charts.tracks[index]

  const randomTrack = useCallback(() => {
    const next = (current.current + 1 + Math.floor(Math.random() * (charts.tracks.length - 1))) % charts.tracks.length
    hasPlayed.current = false
    pendingPlay.current = true
    current.current = next
    setIndex(next)
    controller.current?.loadUri(charts.tracks[next].uri)
    controller.current?.play()
  }, [])

  useEffect(() => {
    let disposed = false
    let instance: Controller | null = null
    let playbackStarted = false
    let previousPosition = 0
    let previousDuration = 0
    const resumeAutoplay = (event: Event) => {
      if (event.isTrusted && !playbackStarted) instance?.play()
    }
    document.addEventListener('click', resumeAutoplay)
    document.addEventListener('keydown', resumeAutoplay)
    const timeout = window.setTimeout(() => { if (!disposed) setFailed(true) }, 15000)
    const initial = Math.floor(Math.random() * charts.tracks.length)
    current.current = initial
    hasPlayed.current = false
    pendingPlay.current = true
    setIndex(initial)
    const element = document.createElement('div')
    host.current?.appendChild(element)
    loadApi().then(api => {
      if (disposed) return
      api.createController(element, {uri: charts.tracks[initial].uri, width: '100%', height: 352}, embed => {
        if (disposed) { embed.destroy(); return }
        instance = embed
        controller.current = embed
        embed.addListener('playback_update', ({data}) => {
          if (disposed || data.playingURI !== charts.tracks[current.current].uri) return
          if (!data.isPaused && !data.isBuffering) {
            hasPlayed.current = true
            pendingPlay.current = false
            playbackStarted = true
            setStarted(true)
          }
          // A newly loaded track may not accept play() until its first update.
          if (pendingPlay.current && data.isPaused && !data.isBuffering) {
            pendingPlay.current = false
            embed.play()
          }
          const resetAtEnd = data.isPaused && data.position === 0 &&
            previousDuration > 0 && previousPosition >= previousDuration - 1000
          // Ignore pauses, buffering, and stale updates from the previous track.
          if (hasPlayed.current && !data.isBuffering && data.duration > 0 &&
              ((data.position >= data.duration - 100 &&
              (data.isPaused || data.position >= data.duration)) || resetAtEnd)) {
            previousPosition = 0
            previousDuration = 0
            randomTrack()
            return
          }
          previousPosition = data.position
          previousDuration = data.duration
        })
        embed.addListener('ready', () => {
          if (disposed) return
          window.clearTimeout(timeout)
          setFailed(false)
          setReady(true)
          embed.play()
        })
      })
    }).catch(() => { if (!disposed) setFailed(true) })
    return () => {
      disposed = true
      window.clearTimeout(timeout)
      document.removeEventListener('click', resumeAutoplay)
      document.removeEventListener('keydown', resumeAutoplay)
      instance?.destroy()
      element.remove()
      controller.current = null
    }
  }, [randomTrack])

  return <div className="relative mx-auto w-full min-w-0 max-w-[490px]">
    <div className="absolute inset-8 rounded-full bg-accent/20 blur-[80px]"/>
    <div className="relative rounded-[36px] border border-white/25 bg-gradient-to-br from-[#263c60]/80 via-[#3b235e]/75 to-[#0b152a]/85 p-5 shadow-2xl backdrop-blur-2xl sm:p-7">
      <div className="mb-6 flex items-center justify-between"><span className="text-sm font-bold tracking-widest text-accent">HOT TRÊN SPOTIFY</span><Music2 className="text-accent" aria-hidden="true"/></div>
      <div ref={host} className="min-h-[352px] overflow-hidden rounded-2xl" aria-label="Trình phát Spotify"/>
      {failed && <p role="status" className="mt-3 text-sm text-muted">Chưa tải được trình phát. Bạn có thể nghe trực tiếp trên Spotify bằng liên kết bên dưới.</p>}
      {!ready && !failed && <p role="status" className="mt-3 text-sm text-muted">Đang tải trình phát Spotify…</p>}
      {ready && !failed && !started && <div className="mt-4">
        <button type="button" onClick={() => controller.current?.play()} className="cta w-full gap-2"><Play size={18} aria-hidden="true"/>Phát nhạc</button>
        <p role="status" className="mt-2 text-center text-xs text-muted">Nếu nhạc chưa chạy, nhấn Phát nhạc hoặc nút Play trong khung Spotify.</p>
      </div>}
      <div className="mt-6" aria-live="polite"><p className="text-xs font-semibold tracking-wider text-accent">TOP 50 VIỆT NAM · CHỌN NGẪU NHIÊN</p><h3 className="mt-2 text-xl font-bold">{track.title}</h3><p className="mt-1 text-sm text-muted">{track.artist}</p></div>
      <button type="button" disabled={!ready} onClick={randomTrack} className="cta mt-6 w-full gap-2 disabled:cursor-wait disabled:opacity-50"><Shuffle size={18} aria-hidden="true"/>Đổi bài ngẫu nhiên</button>
      <a href={'https://open.spotify.com/track/'+track.uri.split(':')[2]} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 text-sm text-accent">Mở trên Spotify<ArrowUpRight size={16} aria-hidden="true"/></a>
      <p className="mt-4 text-center text-xs leading-5 text-muted">Trang sẽ thử tự phát khi trình duyệt cho phép và tự đổi bài khi phát hết. Nếu tự phát bị chặn, bạn cần bấm Play. Spotify có thể phát bản nghe thử hoặc yêu cầu đăng nhập để nghe đầy đủ.</p>
    </div>
  </div>
}
