import React, { useState, useRef } from 'react'
import TextType from '../TextType'
import CodeModal from '../components/CodeModal'

export default function StackApp(){
  const [stack, setStack] = useState([])
  const [value, setValue] = useState('')
  const [capacity, setCapacity] = useState(10)
  const [log, setLog] = useState('')
  const [showCode, setShowCode] = useState(false)
  const inputRef = useRef(null)

  function push(){
    if(stack.length >= capacity){ setLog('Stack overflow — capacity reached'); return }
    if(value === ''){ setLog('Enter a value to push'); return }
    setStack(prev => [...prev, value])
    setLog(`Pushed: ${value}`)
    setValue('')
    inputRef.current?.focus()
  }
  function pop(){
    if(!stack.length){ setLog('Stack underflow — nothing to pop'); return }
    const popped = stack[stack.length -1]
    setStack(prev => prev.slice(0,-1))
    setLog(`Popped: ${popped}`)
  }
  function peek(){
    if(!stack.length){ setLog('Stack is empty'); return }
    setLog(`Top: ${stack[stack.length -1]}`)
  }
  function printAll(){
    setLog(stack.length ? `Stack (top->bottom): ${stack.slice().reverse().join(', ')}` : 'Stack is empty')
  }
  function clear(){ setStack([]); setLog('Cleared stack') }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-start gap-1">
          <h1 className="text-xl font-semibold">Stack — Visualizer</h1>
          <TextType
            text={["Push • Pop • Peek", "Array-backed stack"]}
            typingSpeed={75}
            pauseDuration={1400}
            showCursor={true}
            className="text-sm text-gray-300"
            cursorCharacter="|"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Visualization */}
          <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-slate-400 text-sm">Size: <span className="text-white font-medium">{stack.length}</span> / {capacity}</div>
              <div className="text-slate-400 text-sm h-5">{log}</div>
            </div>
            <div className="border border-dashed border-white/20 rounded-lg min-h-[220px] max-h-[300px] overflow-auto flex flex-col-reverse gap-2 p-3 bg-white/5">
              {stack.length === 0 ? <div className="text-center text-slate-400 py-8">Stack is empty</div> : stack.map((item,i)=>{
                const isTop = i === stack.length -1
                const hue = Math.round((i*40)%360)
                return (
                  <div key={i} className={`relative px-4 py-3 rounded-md text-white font-semibold`} style={{background:`hsl(${hue} 70% 45%)`}}>
                    <div className="text-center">{item}</div>
                    {isTop && <small className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">TOP</small>}
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <button onClick={()=>setShowCode(true)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium">View C Code</button>
            </div>
          </section>

          {/* Controls */}
          <aside className="grid gap-3 p-4 rounded-xl bg-white/5 border border-white/100">
            <div className="grid grid-cols-3 gap-2">
              <label className="col-span-1 text-sm text-gray-300">Value</label>
              <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" ref={inputRef} value={value} onChange={e=>setValue(e.target.value)} />
              <label className="col-span-1 text-sm text-gray-300">Capacity</label>
              <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" type="number" min={1} max={100} value={capacity} onChange={e=>setCapacity(Math.max(1, Number(e.target.value||10)))} />
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <button onClick={push} className="py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold">Push</button>
                <button onClick={pop} className="py-2 rounded-lg bg-rose-500/90 hover:bg-rose-400 text-black font-semibold">Pop</button>
                <button onClick={peek} className="py-2 rounded-lg bg-amber-400/90 hover:bg-amber-300 text-black font-semibold">Peek</button>
              </div>
              <button onClick={printAll} className="col-span-3 mt-2 py-2 rounded-lg bg-white/10 hover:bg-white/20">Print</button>
              <button onClick={clear} className="col-span-3 mt-1 py-2 rounded-lg bg-white/10 hover:bg-white/20">Reset</button>
            </div>
          </aside>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div>Stack UI — operations: Push, Pop, Peek</div>
      </footer>
      <CodeModal slug="stack" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
