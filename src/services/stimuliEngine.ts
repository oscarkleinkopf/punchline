import { pickWord } from '../utils/wordBank'
import { pickTheme, type ThemeKind } from '../utils/themeGenerator'
import { pickObject, type ObjectStimulus } from '../utils/objects'

export type StimulusKind = 'word' | 'theme' | 'object'

export interface Stimulus {
  kind: StimulusKind
  value: string
  object?: ObjectStimulus
  at: number
}

export interface StimuliEngineOptions {
  kind: StimulusKind
  intervalMs: number
  themeKind?: ThemeKind
  onStimulus: (stimulus: Stimulus) => void
}

export class StimuliEngine {
  private timer: ReturnType<typeof setInterval> | null = null
  private lastValue = ''
  private lastObjectId = ''
  private shown = 0
  private options: StimuliEngineOptions | null = null

  getShownCount(): number {
    return this.shown
  }

  start(options: StimuliEngineOptions): void {
    this.stop()
    this.options = options
    this.shown = 0
    this.tick()
    this.timer = setInterval(() => this.tick(), options.intervalMs)
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  setIntervalMs(ms: number): void {
    if (!this.options) return
    this.options.intervalMs = ms
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = setInterval(() => this.tick(), ms)
    }
  }

  private tick(): void {
    if (!this.options) return
    const { kind, themeKind, onStimulus } = this.options
    let stimulus: Stimulus

    if (kind === 'word') {
      const value = pickWord(this.lastValue)
      this.lastValue = value
      stimulus = { kind, value, at: Date.now() }
    } else if (kind === 'theme') {
      const value = pickTheme(themeKind ?? 'mixed')
      this.lastValue = value
      stimulus = { kind, value, at: Date.now() }
    } else {
      const object = pickObject(this.lastObjectId)
      this.lastObjectId = object.id
      stimulus = { kind, value: object.label, object, at: Date.now() }
    }

    this.shown += 1
    onStimulus(stimulus)
  }
}

export const stimuliEngine = new StimuliEngine()
