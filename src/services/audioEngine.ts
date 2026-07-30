type Listener = () => void

class AudioEngine {
  private ctx: AudioContext | null = null
  private source: AudioBufferSourceNode | null = null
  private gain: GainNode | null = null
  private buffer: AudioBuffer | null = null
  private baseBpm = 90
  private tempoRatio = 1
  private volume = 0.85
  private playing = false
  private startedAt = 0
  private offset = 0
  private listeners = new Set<Listener>()

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.gain = this.ctx.createGain()
      this.gain.gain.value = this.volume
      this.gain.connect(this.ctx.destination)
    }
    return this.ctx
  }

  getContext(): AudioContext {
    return this.ensureContext()
  }

  getBeatGain(): GainNode {
    this.ensureContext()
    return this.gain!
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit() {
    this.listeners.forEach((fn) => fn())
  }

  isPlaying(): boolean {
    return this.playing
  }

  getBaseBpm(): number {
    return this.baseBpm
  }

  getEffectiveBpm(): number {
    return Math.round(this.baseBpm * this.tempoRatio)
  }

  getTempoRatio(): number {
    return this.tempoRatio
  }

  getVolume(): number {
    return this.volume
  }

  async load(url: string, bpm: number): Promise<void> {
    const ctx = this.ensureContext()
    if (ctx.state === 'suspended') await ctx.resume()

    const wasPlaying = this.playing
    this.stopInternal(false)

    const res = await fetch(url)
    const arr = await res.arrayBuffer()
    this.buffer = await ctx.decodeAudioData(arr.slice(0))
    this.baseBpm = bpm
    this.offset = 0
    this.emit()

    if (wasPlaying) {
      this.play()
    }
  }

  play(): void {
    if (!this.buffer) return
    const ctx = this.ensureContext()
    void ctx.resume()

    this.stopInternal(false)
    const source = ctx.createBufferSource()
    source.buffer = this.buffer
    source.loop = true
    source.playbackRate.value = this.tempoRatio
    source.connect(this.gain!)
    source.start(0, this.offset % this.buffer.duration)
    this.source = source
    this.startedAt = ctx.currentTime
    this.playing = true
    this.emit()
  }

  pause(): void {
    if (!this.playing || !this.ctx || !this.buffer) return
    const elapsed = (this.ctx.currentTime - this.startedAt) * this.tempoRatio
    this.offset = (this.offset + elapsed) % this.buffer.duration
    this.stopInternal(true)
  }

  stop(): void {
    this.offset = 0
    this.stopInternal(true)
  }

  private stopInternal(emit: boolean) {
    if (this.source) {
      try {
        this.source.stop()
      } catch {
        /* already stopped */
      }
      this.source.disconnect()
      this.source = null
    }
    this.playing = false
    if (emit) this.emit()
  }

  setTempoRatio(ratio: number): void {
    this.tempoRatio = Math.min(1.5, Math.max(0.7, ratio))
    if (this.source) {
      this.source.playbackRate.value = this.tempoRatio
    }
    this.emit()
  }

  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value))
    if (this.gain) {
      this.gain.gain.value = this.volume
    }
    this.emit()
  }
}

export const audioEngine = new AudioEngine()
