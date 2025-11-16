import React, { useState } from 'react';
import TextType from '../TextType.jsx';
import CodeModal from '../components/CodeModal';

function createNode(val){ return { val, left:null, right:null, id: Math.random().toString(36).slice(2,9) } }
function bstInsert(root,val){ if(!root) return createNode(val); if(val < root.val) root.left=bstInsert(root.left,val); else root.right=bstInsert(root.right,val); return root }
function findMin(node){ while(node.left) node=node.left; return node }
function bstDelete(root,val){ if(!root) return null; if(val < root.val) root.left=bstDelete(root.left,val); else if(val > root.val) root.right=bstDelete(root.right,val); else { if(!root.left && !root.right) return null; if(!root.left) return root.right; if(!root.right) return root.left; const succ=findMin(root.right); root.val=succ.val; root.right=bstDelete(root.right,succ.val) } return root }
function inorder(n,o=[]){ if(!n) return o; inorder(n.left,o); o.push(n.val); inorder(n.right,o); return o }
function preorder(n,o=[]){ if(!n) return o; o.push(n.val); preorder(n.left,o); preorder(n.right,o); return o }
function postorder(n,o=[]){ if(!n) return o; postorder(n.left,o); postorder(n.right,o); o.push(n.val); return o }
function levelorder(r){ const o=[]; if(!r) return o; const q=[r]; while(q.length){ const n=q.shift(); o.push(n.val); if(n.left) q.push(n.left); if(n.right) q.push(n.right) } return o }
function computeLayout(root,hs=90,vs=90){ const pos=new Map(); let x=0; function dfs(n,d=0){ if(!n) return; dfs(n.left,d+1); pos.set(n.id,{x:x++*hs,y:d*vs}); dfs(n.right,d+1) } dfs(root,0); return pos }

export default function BSTApp(){
  const [root,setRoot]=useState(null);
  const [input,setInput]=useState('');
  const [arrayInput,setArrayInput]=useState('');
  const [clearBeforeBuild,setClear]=useState(true);
  const [message,setMessage]=useState('');
  const [traversal,setTraversal]=useState('');
  const [showCode, setShowCode] = useState(false);
  function parseValue(v){ if(v==='') return null; const n=Number(v); return Number.isNaN(n)?v:n }
  function handleInsert(){ const v=parseValue(input); if(v===null){ setMessage('Enter a value'); return;} setRoot(p=>bstInsert(structuredClone(p)||null,v)); setMessage(`Inserted ${input}`); setInput('') }
  function handleDelete(){ const v=parseValue(input); if(v===null){ setMessage('Enter a value'); return;} setRoot(p=>bstDelete(structuredClone(p)||null,v)); setMessage(`Deleted ${input} (if present)`); setInput('') }
  function handleBuild(){ if(!arrayInput){ setMessage('Enter array values'); return;} const cleaned=arrayInput.replace(/^[\[\]]+|[\[\]]+$/g,''); const tokens=cleaned.split(/[\,\s]+/).filter(Boolean); const values=tokens.map(parseValue); setRoot(prev=>{ let base=prev&&!clearBeforeBuild?structuredClone(prev):null; for(const v of values) base=bstInsert(base,v); return base }); setMessage(`Built tree from array (${values.length} items)`) }
  function handleTraverse(t){ let out=[]; if(!root){ setTraversal(''); setMessage('Tree is empty'); return;} if(t==='in') out=inorder(root,[]); if(t==='pre') out=preorder(root,[]); if(t==='post') out=postorder(root,[]); if(t==='level') out=levelorder(root); setTraversal(out.join(', ')); setMessage(`${t}order: ${out.length} nodes`) }
  const pos=computeLayout(root,90,90); let maxX=0,maxY=0; pos.forEach(p=>{ if(p.x>maxX) maxX=p.x; if(p.y>maxY) maxY=p.y }); const padding=40; const svgWidth=Math.max(600,maxX+padding*2+120); const svgHeight=Math.max(240,maxY+padding*2+120);
  const nodes=[]; (function collect(n){ if(!n) return; nodes.push(n); collect(n.left); collect(n.right) })(root);
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-start gap-1">
          <h1 className="text-xl font-semibold">Binary Search Tree — Visualizer</h1>
          <TextType
            text={["Insert • Delete • Traversals","Build from array values"]}
            typingSpeed={75}
            pauseDuration={1400}
            showCursor={true}
            className="text-sm text-gray-300"
            cursorCharacter="|"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Controls (left) */}
        <div className="grid gap-3 p-4 rounded-xl bg-white/5 border border-white/10 h-fit">
          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-1 text-sm text-gray-300">Value</label>
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. 42" className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10 text-sm" />

            <div className="col-span-3 grid grid-cols-2 gap-2">
              <button onClick={handleInsert} className="py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold">Insert</button>
              <button onClick={handleDelete} className="py-2 rounded-lg bg-rose-500/90 hover:bg-rose-400 text-black font-semibold">Delete</button>
            </div>

            <div className="col-span-3 grid grid-cols-2 gap-2 mt-2">
              <button onClick={()=>handleTraverse('in')} className="py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-400 text-black font-semibold">Inorder</button>
              <button onClick={()=>handleTraverse('pre')} className="py-2 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-black font-semibold">Preorder</button>
              <button onClick={()=>handleTraverse('post')} className="py-2 rounded-lg bg-amber-400/90 hover:bg-amber-300 text-black font-semibold">Postorder</button>
              <button onClick={()=>handleTraverse('level')} className="py-2 rounded-lg bg-sky-500/90 hover:bg-sky-400 text-black font-semibold">Levelorder</button>
            </div>

            <label className="col-span-1 text-sm text-gray-300 mt-2">Array</label>
            <input value={arrayInput} onChange={e=>setArrayInput(e.target.value)} placeholder="e.g. 5,3,7" className="col-span-2 px-2 py-1 rounded bg-white/10 border border-white/10 text-sm" />
            <div className="col-span-3 grid grid-cols-2 gap-2 mt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 bg-black/40 px-2 rounded-md border border-white/10">
                <input type="checkbox" checked={clearBeforeBuild} onChange={e=>setClear(e.target.checked)} />
                Clear first
              </label>
              <button onClick={handleBuild} className="py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold">Build</button>
            </div>

            <button onClick={()=>{ setRoot(null); setMessage('Tree cleared'); setTraversal('') }} className="col-span-3 mt-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10">Reset</button>
          </div>
        </div>

        {/* Visualization (right) */}
        <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <div className="text-sm text-gray-300 mb-3">Nodes: <span className="text-white font-medium">{nodes.length}</span></div>
          <div className="border rounded-lg p-2 bg-black/40">
            <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{background:'transparent'}}>
              <g transform={`translate(${padding + 60}, ${padding})`}>
                {nodes.map(n=>{ if(!n) return null; const p=pos.get(n.id); if(!p) return null; const children=[]; if(n.left&&pos.get(n.left.id)) children.push(pos.get(n.left.id)); if(n.right&&pos.get(n.right.id)) children.push(pos.get(n.right.id)); return children.map((c,i)=>(<line key={n.id+'-edge-'+i} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="#fff" strokeWidth={2} strokeOpacity={0.2} />)) })}
                {nodes.map(n=>{ const p=pos.get(n.id); if(!p) return null; const depth=p.y/90; const hue=(depth*60)%360; const r=20; return (<g key={n.id} transform={`translate(${p.x}, ${p.y})`}><circle r={r} cx={0} cy={0} fill={`hsl(${hue} 70% 45%)`} /><text x={0} y={5} textAnchor="middle" className="font-semibold text-white" fontSize={13}>{String(n.val)}</text></g>) })}
              </g>
            </svg>
          </div>
          <div className="text-xs text-slate-300 mt-2"><strong>Traversal:</strong> {traversal || '-'} • <span>{message}</span></div>
          <div className="mt-6">
            <button onClick={()=>setShowCode(true)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium">View C Code</button>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div>Binary Search Tree · Visualizer</div>
        <div className="mt-3">
          <a href="/menu.html" className="text-emerald-400 hover:underline">Back to Menu</a>
        </div>
      </footer>
      <CodeModal slug="bst" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
