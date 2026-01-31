import { useMemo, useRef, useState } from 'react'
import '../index.css'
import TextType from '../TextType'
import CodeModal from '../components/CodeModal'


function Box({ value, index, highlighted, speedMs }) {
  const style = {
    transition: `background-color ${speedMs}ms ease, color ${speedMs}ms ease, box-shadow ${speedMs}ms ease`,
  }
  return (
    <div className={`min-w-[56px] h-[56px] rounded-lg flex items-center justify-center text-lg font-semibold border border-white/10 shadow-md ${highlighted ? 'bg-emerald-500/80 text-black shadow-emerald-500/40' : 'bg-white/10 backdrop-blur-sm'}`} style={style}>
      {value}
    </div>
  )
}

function Controls({ onCreate, onInsert, onRemove, onUpdate, onSort, onReset, speedMs, setSpeedMs }) {
  const [createN, setCreateN] = useState(10)
  const [min, setMin] = useState(-9)
  const [max, setMax] = useState(99)
  const [idx, setIdx] = useState(0)
  const [val, setVal] = useState(0)

  return (
    <div className="grid gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="grid grid-cols-3 gap-2">
        <label className="col-span-1 text-sm text-gray-300">Size</label>
        <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" type="number" min={0} max={64} value={createN} onChange={e=>setCreateN(parseInt(e.target.value||0))}/>
        <label className="col-span-1 text-sm text-gray-300">Min</label>
        <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" type="number" value={min} onChange={e=>setMin(parseInt(e.target.value||0))}/>
        <label className="col-span-1 text-sm text-gray-300">Max</label>
        <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" type="number" value={max} onChange={e=>setMax(parseInt(e.target.value||0))}/>
        <button onClick={()=>onCreate(createN, min, max)} className="col-span-3 mt-1 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold">Create (N)</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <label className="text-sm text-gray-300">Index</label>
        <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" type="number" min={0} value={idx} onChange={e=>setIdx(parseInt(e.target.value||0))}/>

        <label className="text-sm text-gray-300">Value</label>
        <input className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10" type="number" value={val} onChange={e=>setVal(parseInt(e.target.value||0))}/>

        <div className="col-span-3 grid grid-cols-3 gap-2">
          <button onClick={()=>onInsert(idx, val)} className="py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold">Insert(i,v)</button>
          <button onClick={()=>onRemove(idx)} className="py-2 rounded-lg bg-rose-500/90 hover:bg-rose-400 text-black font-semibold">Remove(i)</button>
          <button onClick={()=>onUpdate(idx, val)} className="py-2 rounded-lg bg-amber-400/90 hover:bg-amber-300 text-black font-semibold">Update(i,v)</button>
        </div>
      </div>

      <button onClick={onSort} className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-black font-semibold">Sort (ASC)</button>

      <div className="grid grid-cols-3 items-center gap-2">
        <label className="text-sm text-gray-300">Speed</label>
        <input className="col-span-2" type="range" min={100} max={1200} step={50} value={speedMs} onChange={e=>setSpeedMs(parseInt(e.target.value))}/>
      </div>

      <button onClick={onReset} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10">Reset</button>
    </div>
  )
}

export default function ArrayApp(){
  const [arr, setArr] = useState([ -3, 5, 19, 39, 57, 64, 68, 70 ])
  const [highlight, setHighlight] = useState(-1)
  const [speedMs, setSpeedMs] = useState(400)

  const indices = useMemo(()=>Array.from({length: arr.length}, (_,i)=>i), [arr.length])

  function withFlash(i, updater){
    setHighlight(i)
    const result = updater()
    setTimeout(()=>setHighlight(-1), Math.max(300, speedMs))
    return result
  }

  function onCreate(n, min, max){
    if (n < 0) n = 0
    const next = Array.from({length: n}, ()=> Math.floor(Math.random()*(max-min+1))+min)
    setArr(next)
  }
  function onInsert(i, v){
    if (i < 0) i = 0
    if (i > arr.length) i = arr.length
    setArr(prev => {
      const next = [...prev]
      next.splice(i, 0, v)
      return next
    })
    withFlash(i, ()=>{})
  }
  function onRemove(i){
    if (i < 0 || i >= arr.length) return
    setArr(prev => {
      const next = [...prev]
      next.splice(i,1)
      return next
    })
    withFlash(i, ()=>{})
  }
  function onUpdate(i, v){
    if (i < 0 || i >= arr.length) return
    setArr(prev => {
      const next = [...prev]
      next[i] = v
      return next
    })
    withFlash(i, ()=>{})
  }
  function onSort(){
    setArr(prev => {
      const sorted = [...prev].sort((a, b) => a - b)
      return sorted
    })
    setHighlight(-1)
  }
  function onReset(){
    setArr([ -3, 5, 19, 39, 57, 64, 68, 70 ])
    setHighlight(-1)
  }

  const [showCode, setShowCode] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-start gap-1">
          <h1 className="text-xl font-semibold">Array — Visualizer</h1>
          <TextType  
            text={["Learn by visualizing arrays","Create • Insert • Remove • Update"]}
            typingSpeed={75}
            pauseDuration={1400}
            showCursor={true}
            className="text-sm text-gray-300"
            cursorCharacter="|"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <Controls 
          onCreate={onCreate} onInsert={onInsert} onRemove={onRemove} onUpdate={onUpdate} onSort={onSort} onReset={onReset}
          speedMs={speedMs} setSpeedMs={setSpeedMs}
        />

        <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <div className="text-sm text-gray-300 mb-3">Array</div>
          <div className="flex flex-wrap gap-2">
            {arr.map((v, i)=> (
              <div key={i} className="flex flex-col items-center">
                <Box value={v} index={i} highlighted={i===highlight} speedMs={speedMs} />
                <div className="mt-1 text-xs text-rose-400">{i}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={()=>setShowCode(true)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium">View C Code</button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div>UI enhanced replica for learning — Array operations: Create, Insert, Remove, Update</div>
        <div className="mt-3">
          <a href="/menu.html" className="text-emerald-400 hover:underline">Back to Menu</a>
        </div>
      </footer>
      <CodeModal slug="array" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
