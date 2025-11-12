import React, { useMemo, useRef, useState } from 'react'
import TextType from '../TextType'
import CodeModal from '../components/CodeModal'

function QBox({ value, index, role, highlight }) {
  return (
    <div
      className={`relative rounded-lg border border-white/10 min-w-[56px] h-[64px] px-4 flex flex-col items-center justify-center text-center select-none shadow-md transition-all duration-300 ${
        highlight
          ? 'bg-emerald-500/80 text-black shadow-emerald-500/40 scale-[1.02]'
          : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
      }`}
    >
      <div className="text-xs text-slate-400 absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-2 rounded-full border border-white/10">
        {index}
      </div>
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{role}</div>
    </div>
  )
}

export default function QueueApp() {
  const [queue, setQueue] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [showCode, setShowCode] = useState(false)

  const valRef = useRef(null)
  const sizeRef = useRef(null)

  const size = queue.length

  const visualize = useMemo(() => {
    if (queue.length === 0) {
      return (
        <div className="w-full flex items-center justify-center py-10">
          <div className="text-slate-400 text-base sm:text-lg font-medium">Queue is empty</div>
        </div>
      )
    }
    return (
      <div className="w-full overflow-x-auto overflow-y-visible">
        <div className="w-full flex justify-center">
          <div className="inline-flex min-w-fit items-center gap-3 flex-nowrap px-2 sm:px-3 py-4">
            {queue.map((v, i) => (
              <QBox
                key={i}
                value={v}
                index={i}
                role={i === 0 ? 'front' : i === queue.length - 1 ? 'rear' : 'in-queue'}
                highlight={i === highlightIndex}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }, [queue, highlightIndex])

  function flash(i, note) {
    setHighlightIndex(i)
    if (note) setMessage(note)
    setTimeout(() => setHighlightIndex(null), 600)
  }

  function createQueue() {
    const n = parseInt(sizeRef.current?.value || '6', 10)
    const next = Array.from({ length: Math.max(0, Math.min(16, n)) }, () => Math.floor(Math.random() * 90) + 10)
    setQueue(next)
    setMessage(`Created queue with ${next.length} items`)
    if (next.length) flash(0)
  }

  function enqueue() {
    const value = valRef.current?.value?.trim()
    if (!value) return setMessage('Enter a value to enqueue')
    const next = [...queue, value]
    setQueue(next)
    setMessage(`Enqueued ${value}`)
    flash(next.length - 1)
  }

  function dequeue() {
    if (!queue.length) return setMessage('Queue is empty')
    const [removed, ...rest] = queue
    setQueue(rest)
    setMessage(`Dequeued ${removed}`)
    if (rest.length) flash(0)
  }

  function peekFront() {
    if (!queue.length) return setMessage('Queue is empty')
    setMessage(`Front: ${queue[0]}`)
    flash(0)
  }

  function peekRear() {
    if (!queue.length) return setMessage('Queue is empty')
    setMessage(`Rear: ${queue[queue.length - 1]}`)
    flash(queue.length - 1)
  }

  function reset() {
    setQueue([])
    setMessage('Cleared queue')
    setHighlightIndex(null)
  }

  // Base button styles
  const btnBase = 'h-12 px-4 rounded-lg inline-flex items-center justify-center font-medium text-sm tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed';
  const btnBlock = `w-full ${btnBase}`;
  const inputBase = 'w-full h-[52px] rounded-lg px-3 text-sm text-white placeholder-gray-300 bg-[#2a2a2a] border border-[#555] shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_0_2px_rgba(16,185,129,0.25)]';

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-start gap-1">
          <h1 className="text-xl font-semibold">Queue — Visualizer</h1>
          <TextType
            text={["FIFO structure", "Enqueue • Dequeue • Peek"]}
            typingSpeed={75}
            pauseDuration={1400}
            showCursor={true}
            className="text-sm text-gray-300"
            cursorCharacter="|"
          />
        </div>
      </header>

  <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Visualization (first for better mobile stacking) */}
        <section className="rounded-2xl border border-white/10 p-5 sm:p-6 bg-white/5 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-gray-300 text-sm">Size: <span className="text-white font-medium">{size}</span></div>
            <div className="text-gray-300 text-sm h-5 truncate">{message}</div>
          </div>
          <div className={`${queue.length ? 'pb-2' : ''} min-h-[140px]`}>
            {visualize}
          </div>
          <div className="mt-6">
            <button
              onClick={()=>setShowCode(true)}
              className={`self-center ${btnBase} bg-emerald-600 hover:bg-emerald-500 shadow-sm w-auto px-6`}
              aria-label="View C implementation source code"
            >View C Code</button>
          </div>
        </section>

        {/* Controls (right on desktop, centered vertically) */}
  <aside className="flex flex-col mx-auto w-full lg:w-[360px] p-5 sm:p-6 lg:pt-14 rounded-xl bg-white/5 border border-white/10">
          <div className="flex flex-col items-stretch gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-xs text-slate-400">Create with N items</label>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-2">
                <input
                  ref={sizeRef}
                  type="number"
                  min="0"
                  max="16"
                  defaultValue={6}
                  className={`${inputBase} sm:flex-1`}
                  aria-label="Initial queue size"
                />
                <button
                  onClick={createQueue}
                  className={`${btnBlock} sm:w-[112px] bg-emerald-600 hover:bg-emerald-500 shadow-sm`}
                  aria-label="Create queue with N items"
                >Create</button>
                <button
                  onClick={reset}
                  className={`${btnBlock} sm:w-[96px] bg-white/10 hover:bg-white/20`}
                  aria-label="Reset queue"
                >Reset</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs text-slate-400">Value</label>
              <input
                ref={valRef}
                placeholder="e.g. 42"
                className={inputBase}
                aria-label="Value to enqueue"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={enqueue} className={`${btnBlock} bg-indigo-600 hover:bg-indigo-500 shadow-sm`} aria-label="Enqueue value">Enqueue</button>
              <button onClick={dequeue} className={`${btnBlock} bg-rose-600 hover:bg-rose-500 shadow-sm`} aria-label="Dequeue front value">Dequeue</button>
              <button onClick={peekFront} className={`${btnBlock} bg-sky-600 hover:bg-sky-500 shadow-sm`} aria-label="Peek front value">Peek Front</button>
              <button onClick={peekRear} className={`${btnBlock} bg-amber-600 hover:bg-amber-500 shadow-sm`} aria-label="Peek rear value">Peek Rear</button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div className="mt-1">
          <a href="/menu.html" className="text-emerald-400 hover:underline">← Back to Menu</a>
        </div>
      </footer>
      <CodeModal slug="queue" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
