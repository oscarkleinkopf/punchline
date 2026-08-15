import { audioEngine } from './audioEngine'

export type RecorderState = 'idle' | 'recording' | 'ready'

class RecorderService {
  private mediaStream: MediaStream | null = null
  private mediaRecorder: MediaRecorder | null = null
  private chunks: BlobPart[] = []
  private micSource: MediaStreamAudioSourceNode | null = null
  private micGain: GainNode | null = null
  private dest: MediaStreamAudioDestinationNode | null = null
  private beatConnected = false
  private blob: Blob | null = null
  private url: string | null = null
  private state: RecorderState = 'idle'
  private micVolume = 1
  private listeners = new Set<() => void>()
  private stopPromise: Promise<Blob | null> | null = null
  private resolveStop: ((blob: Blob | null) => void) | null = null

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit() {
    this.listeners.forEach((fn) => fn())
  }

  getState(): RecorderState {
    return this.state
  }

  getUrl(): string | null {
    return this.url
  }

  getBlob(): Blob | null {
    return this.blob
  }

  getMicVolume(): number {
    return this.micVolume
  }

  setMicVolume(value: number): void {
    this.micVolume = Math.min(1, Math.max(0, value))
    if (this.micGain) {
      this.micGain.gain.value = this.micVolume
    }
    this.emit()
  }

  async start(): Promise<void> {
    if (this.state === 'recording') return

    const ctx = audioEngine.getContext()
    if (ctx.state === 'suspended') await ctx.resume()

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
      },
    })

    this.dest = ctx.createMediaStreamDestination()
    this.micSource = ctx.createMediaStreamSource(this.mediaStream)
    this.micGain = ctx.createGain()
    this.micGain.gain.value = this.micVolume
    this.micSource.connect(this.micGain)
    this.micGain.connect(this.dest)

    // Also monitor mic locally at low level is skipped; mix beat into recording
    const beatGain = audioEngine.getBeatGain()
    beatGain.connect(this.dest)
    this.beatConnected = true

    this.chunks = []
    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : ''

    this.mediaRecorder = mime
      ? new MediaRecorder(this.dest.stream, { mimeType: mime })
      : new MediaRecorder(this.dest.stream)

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data)
    }

    this.mediaRecorder.onstop = () => {
      const mime = this.mediaRecorder?.mimeType || 'audio/webm'
      this.blob = new Blob(this.chunks, { type: mime })
      if (this.url) URL.revokeObjectURL(this.url)
      this.url = URL.createObjectURL(this.blob)
      this.state = 'ready'
      this.cleanupGraph()
      this.emit()
      this.resolveStop?.(this.blob)
      this.resolveStop = null
      this.stopPromise = null
    }

    this.mediaRecorder.start(200)
    this.state = 'recording'
    this.emit()
  }

  stop(): Promise<Blob | null> {
    if (this.stopPromise) return this.stopPromise
    if (!this.mediaRecorder || this.state !== 'recording') {
      return Promise.resolve(this.blob)
    }
    this.stopPromise = new Promise((resolve) => {
      this.resolveStop = resolve
      try {
        this.mediaRecorder?.requestData()
      } catch {
        /* some browsers throw if no data yet */
      }
      this.mediaRecorder?.stop()
    })
    return this.stopPromise
  }

  clear(): void {
    if (this.url) URL.revokeObjectURL(this.url)
    this.url = null
    this.blob = null
    this.chunks = []
    this.state = 'idle'
    this.emit()
  }

  download(filename = 'punchline-take.webm'): void {
    if (!this.url) return
    const a = document.createElement('a')
    a.href = this.url
    a.download = filename
    a.click()
  }

  private cleanupGraph() {
    if (this.beatConnected) {
      try {
        audioEngine.getBeatGain().disconnect(this.dest!)
      } catch {
        /* ignore */
      }
      this.beatConnected = false
    }
    this.micSource?.disconnect()
    this.micGain?.disconnect()
    this.micSource = null
    this.micGain = null
    this.dest = null
    this.mediaStream?.getTracks().forEach((t) => t.stop())
    this.mediaStream = null
    this.mediaRecorder = null
  }
}

export const recorder = new RecorderService()
