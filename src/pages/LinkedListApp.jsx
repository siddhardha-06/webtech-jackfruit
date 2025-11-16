import React, { useMemo, useRef, useState } from 'react'
import TextType from '../TextType'
import CodeModal from '../components/CodeModal'

function Arrow() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" className="mx-2 shrink-0">
      <line x1="0" y1="12" x2="28" y2="12" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <polyline points="22,6 28,12 22,18" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NodeBox({ value, index, highlight }) {
  return (
    <div
      className={`relative rounded-lg border border-white/10 min-w-[56px] h-[64px] px-4 flex flex-col items-center justify-center text-center select-none shadow-md transition-all duration-300 ${
        highlight
          ? 'bg-emerald-500/80 text-black shadow-emerald-500/40 scale-[1.02]'
          : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
      }`}
    >
      <div className="text-xs text-slate-400 absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-2 rounded-full border border-white/10">{index}</div>
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">node</div>
    </div>
  )
}

export default function LinkedListApp() {
  const [nodes, setNodes] = useState([]) // simple array to represent linked list sequence
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')
  const [showCode, setShowCode] = useState(false)

  const valRef = useRef(null)
  const idxRef = useRef(null)
  const sizeRef = useRef(null)

  const size = nodes.length

  const visualize = useMemo(() => {
    if (nodes.length === 0) {
      return (
        <div className="w-full flex items-center justify-center py-10">
          <div className="text-gray-400 text-base sm:text-lg font-medium">Empty list</div>
        </div>
      )
    }
    const parts = []
    nodes.forEach((v, i) => {
      parts.push(<NodeBox key={`n-${i}`} value={v} index={i} highlight={i === highlightIndex} />)
      if (i !== nodes.length - 1) parts.push(<Arrow key={`a-${i}`} />)
    })
    return (
      <div className="w-full overflow-x-auto overflow-y-visible">
        <div className="w-full flex justify-center">
          <div className="inline-flex min-w-fit items-center gap-3 flex-nowrap px-2 sm:px-3 py-4">
            {parts}
          </div>
        </div>
      </div>
    )
  }, [nodes, highlightIndex])

  function flash(i, note) {
    setHighlightIndex(i)
    if (note) setMessage(note)
    setTimeout(() => setHighlightIndex(null), 600)
  }

  function createList() {
    const n = parseInt(sizeRef.current?.value || '5', 10)
    const next = Array.from({ length: Math.max(0, Math.min(16, n)) }, () => Math.floor(Math.random() * 90) + 10)
    setNodes(next)
    setMessage(`Created list of size ${next.length}`)
    if (next.length) flash(0)
  }

  function insertAt() {
    const value = valRef.current?.value?.trim()
    const idx = parseInt(idxRef.current?.value || `${nodes.length}`, 10)
    if (value === '' || isNaN(idx)) return setMessage('Enter value and valid index')
    const i = Math.max(0, Math.min(nodes.length, idx))
    const next = nodes.slice()
    next.splice(i, 0, value)
    setNodes(next)
    setMessage(`Inserted ${value} at index ${i}`)
    flash(i)
  }

  function removeAt() {
    if (!nodes.length) return setMessage('List is empty')
    const idx = parseInt(idxRef.current?.value || `${nodes.length - 1}`, 10)
    const i = Math.max(0, Math.min(nodes.length - 1, idx))
    const next = nodes.slice()
    const removed = next.splice(i, 1)
    setNodes(next)
    setMessage(`Removed ${removed[0]} from index ${i}`)
    flash(Math.min(i, next.length - 1))
  }

  function updateAt() {
    if (!nodes.length) return setMessage('List is empty')
    const value = valRef.current?.value?.trim()
    const idx = parseInt(idxRef.current?.value || '0', 10)
    if (value === '' || isNaN(idx)) return setMessage('Enter value and valid index')
    const i = Math.max(0, Math.min(nodes.length - 1, idx))
    const next = nodes.slice()
    next[i] = value
    setNodes(next)
    setMessage(`Updated index ${i} -> ${value}`)
    flash(i)
  }

  function prepend() {
    const value = valRef.current?.value?.trim()
    if (!value) return setMessage('Enter value to prepend')
    setNodes([value, ...nodes])
    setMessage(`Prepended ${value}`)
    flash(0)
  }

  function append() {
    const value = valRef.current?.value?.trim()
    if (!value) return setMessage('Enter value to append')
    setNodes([...nodes, value])
    setMessage(`Appended ${value}`)
    flash(nodes.length)
  }

  function reset() {
    setNodes([])
    setMessage('Cleared list')
    setHighlightIndex(null)
  }

  // shared UI tokens
  const btnBase = 'h-12 px-4 rounded-lg inline-flex items-center justify-center font-medium text-sm tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed';
  const btnBlock = `w-full ${btnBase}`;
  const inputBase = 'w-full h-[52px] rounded-lg px-3 text-sm text-white placeholder-gray-300 bg-[#2a2a2a] border border-[#555] shadow-inner outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50';

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-start gap-1">
          <h1 className="text-xl font-semibold">Linked List — Visualizer</h1>
          <TextType
            text={["Create • Insert • Remove • Update", "Prepend • Append", "Nodes with arrows"]}
            typingSpeed={75}
            pauseDuration={1400}
            showCursor={true}
            className="text-sm text-gray-300"
            cursorCharacter="|"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Controls (left, Array style) */}
        <div className="grid gap-3 p-4 rounded-xl bg-white/5 border border-white/10 h-fit">
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-1 text-sm text-gray-300">Size</label>
            <input ref={sizeRef} type="number" min={0} max={16} defaultValue={6} className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" />
            <button onClick={createList} className="col-span-3 mt-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold">Create (N)</button>

            <label className="text-sm text-gray-300">Index</label>
            <input ref={idxRef} type="number" placeholder="0" className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" />

            <label className="text-sm text-gray-300">Value</label>
            <input ref={valRef} placeholder="e.g. 42" className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" />

            <div className="col-span-3 grid grid-cols-3 gap-2">
              <button onClick={insertAt} className="py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold">Insert(i,v)</button>
              <button onClick={removeAt} className="py-2 rounded-lg bg-rose-500/90 hover:bg-rose-400 text-black font-semibold">Remove(i)</button>
              <button onClick={updateAt} className="py-2 rounded-lg bg-amber-400/90 hover:bg-amber-300 text-black font-semibold">Update(i,v)</button>
            </div>
          </div>

          <button onClick={reset} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10">Reset</button>
        </div>

        {/* Visualization (right) */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-gray-300 text-sm">Size: <span className="text-white font-medium">{size}</span></div>
            <div className="text-gray-300 text-sm h-5 truncate">{message}</div>
          </div>
          <div className="min-h-[140px]">
            {visualize}
          </div>
          <div className="mt-6">
            <button onClick={()=>setShowCode(true)} className={`self-center ${btnBase} w-auto px-6 bg-emerald-600 hover:bg-emerald-500 shadow-sm`}>View C Code</button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div>Linked List UI — operations: Create, Insert, Remove, Update</div>
        <div className="mt-3">
          <a href="/menu.html" className="text-emerald-400 hover:underline">Back to Menu</a>
        </div>
      </footer>
      <CodeModal slug="linked-list" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
