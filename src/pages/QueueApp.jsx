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

  <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Controls (left like Array) */}
        <div className="grid gap-3 p-4 rounded-xl bg-white/5 border border-white/10 h-fit">
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-1 text-sm text-gray-300">Size</label>
            <input ref={sizeRef} type="number" min="0" max="16" defaultValue={6} className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" />
            <label className="col-span-1 text-sm text-gray-300">Value</label>
            <input ref={valRef} placeholder="e.g. 42" className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" />
            <button onClick={createQueue} className="col-span-3 mt-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold">Create (N)</button>
            <div className="col-span-3 grid grid-cols-2 gap-2 mt-2">
              <button onClick={enqueue} className="py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold">Enqueue</button>
              <button onClick={dequeue} className="py-2 rounded-lg bg-rose-500/90 hover:bg-rose-400 text-black font-semibold">Dequeue</button>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <button onClick={peekFront} className="py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-black font-semibold">Peek Front</button>
              <button onClick={peekRear} className="py-2 rounded-lg bg-amber-400/90 hover:bg-amber-300 text-black font-semibold">Peek Rear</button>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-2 mt-2">
              <button onClick={reset} className="py-2 rounded-lg bg-white/10 hover:bg-white/20 col-span-2">Reset</button>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <section className="rounded-2xl border border-white/10 p-6 bg-white/5 flex flex-col">
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

      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div>Queue UI — operations: Enqueue, Dequeue, Peek</div>
        <div className="mt-3">
          <a href="/menu.html" className="text-emerald-400 hover:underline">Back to Menu</a>
        </div>
      </footer>
      <CodeModal slug="queue" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
