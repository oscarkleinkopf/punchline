interface TimerProps {
  seconds: number
  warnBelow?: number
}

function formatTime(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function Timer({ seconds, warnBelow = 10 }: TimerProps) {
  const warn = seconds <= warnBelow
  return (
    <div
      className={`timer-ring${warn ? ' timer-ring--warn' : ''}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {formatTime(seconds)}
    </div>
  )
}
