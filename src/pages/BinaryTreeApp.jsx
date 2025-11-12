import React, { useState } from 'react';
import TextType from '../TextType.jsx';
import CodeModal from '../components/CodeModal';

function createNode(val){ return { val, left:null, right:null, id: Math.random().toString(36).slice(2,9) } }
function insertLevel(root,val){ const node=createNode(val); if(!root) return node; const q=[root]; while(q.length){ const n=q.shift(); if(!n.left){n.left=node; return root;} else q.push(n.left); if(!n.right){n.right=node; return root;} else q.push(n.right);} return root }
function findLastNodeAndParent(root){ if(!root) return {last:null,parent:null}; const q=[{node:root,parent:null}]; let last=null; while(q.length){ const {node,parent}=q.shift(); last={node,parent}; if(node.left) q.push({node:node.left,parent:node}); if(node.right) q.push({node:node.right,parent:node}); } return last }
function deleteLevel(root,val){ if(!root) return null; let target=null; const q=[root]; while(q.length){ const n=q.shift(); if(n.val===val){ target=n; break;} if(n.left) q.push(n.left); if(n.right) q.push(n.right);} if(!target) return root; const lastInfo=findLastNodeAndParent(root); if(!lastInfo||!lastInfo.node) return root; const last=lastInfo.node; const parent=lastInfo.parent; if(last===target && !parent) return null; target.val=last.val; if(parent){ if(parent.right===last) parent.right=null; else if(parent.left===last) parent.left=null;} return root }
function inorder(n,o=[]){ if(!n) return o; inorder(n.left,o); o.push(n.val); inorder(n.right,o); return o }
function preorder(n,o=[]){ if(!n) return o; o.push(n.val); preorder(n.left,o); preorder(n.right,o); return o }
function postorder(n,o=[]){ if(!n) return o; postorder(n.left,o); postorder(n.right,o); o.push(n.val); return o }
function levelorder(r){ const o=[]; if(!r) return o; const q=[r]; while(q.length){ const n=q.shift(); o.push(n.val); if(n.left) q.push(n.left); if(n.right) q.push(n.right);} return o }
function computeLayout(root,hs=90,vs=90){ const pos=new Map(); let x=0; function dfs(n,d=0){ if(!n) return; dfs(n.left,d+1); pos.set(n.id,{x:x++*hs,y:d*vs}); dfs(n.right,d+1);} dfs(root,0); return pos }

export default function BinaryTreeApp(){
  const [root,setRoot]=useState(null);
  const [input,setInput]=useState('');
  const [arrayInput,setArrayInput]=useState('');
  const [clearBeforeBuild,setClear]=useState(true);
  const [message,setMessage]=useState('');
  const [traversal,setTraversal]=useState('');
  const [showCode, setShowCode] = useState(false);
  function parseValue(v){ if(v==='') return null; const n=Number(v); return Number.isNaN(n)?v:n }
  function handleInsert(){ const v=parseValue(input); if(v===null){ setMessage('Enter a value'); return;} setRoot(prev=>insertLevel(structuredClone(prev)||null,v)); setMessage(`Inserted ${input}`); setInput('') }
  function handleDelete(){ const v=parseValue(input); if(v===null){ setMessage('Enter a value'); return;} setRoot(prev=>deleteLevel(structuredClone(prev)||null,v)); setMessage(`Deleted ${input} (if present)`); setInput('') }
  function handleBuild(){ if(!arrayInput){ setMessage('Enter array values'); return;} const cleaned=arrayInput.replace(/^[\[\]]+|[\[\]]+$/g,''); const tokens=cleaned.split(/[\,\s]+/).filter(Boolean); const values=tokens.map(parseValue); setRoot(prev=>{ let base=prev&&!clearBeforeBuild?structuredClone(prev):null; for(const v of values) base=insertLevel(base,v); return base }); setMessage(`Built tree from array (${values.length} items)`) }
  function handleTraverse(t){ let out=[]; if(!root){ setTraversal(''); setMessage('Tree is empty'); return;} if(t==='in') out=inorder(root,[]); if(t==='pre') out=preorder(root,[]); if(t==='post') out=postorder(root,[]); if(t==='level') out=levelorder(root); setTraversal(out.join(', ')); setMessage(`${t}order: ${out.length} nodes`) }
  const pos=computeLayout(root,90,90); let maxX=0,maxY=0; pos.forEach(p=>{ if(p.x>maxX) maxX=p.x; if(p.y>maxY) maxY=p.y }); const padding=40; const svgWidth=Math.max(600,maxX+padding*2+120); const svgHeight=Math.max(240,maxY+padding*2+120);
  const nodes=[]; (function collect(n){ if(!n) return; nodes.push(n); collect(n.left); collect(n.right) })(root);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-white/5/20 backdrop-blur px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-col items-start gap-1">
          <h1 className="text-xl sm:text-2xl font-semibold">Binary Tree Visualizer (Level Insert)</h1>
          <TextType
            text={["Insert • Delete • Traversals","Build from array values"]}
            typingSpeed={70}
            pauseDuration={1400}
            className="text-sm text-slate-300"
            cursorCharacter="|"
          />
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Visualization */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="mb-3 text-slate-400 text-sm">Nodes: <span className="text-white font-medium">{nodes.length}</span></div>
            <div className="border rounded-lg p-2 bg-black/40">
              <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{background:'transparent'}}>
                <g transform={`translate(${padding + 60}, ${padding})`}>
                  {nodes.map(n=>{ if(!n) return null; const p=pos.get(n.id); if(!p) return null; const children=[]; if(n.left&&pos.get(n.left.id)) children.push(pos.get(n.left.id)); if(n.right&&pos.get(n.right.id)) children.push(pos.get(n.right.id)); return children.map((c,i)=>(<line key={n.id+'-edge-'+i} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="#fff" strokeWidth={2} strokeOpacity={0.2} />)) })}
                  {nodes.map(n=>{ const p=pos.get(n.id); if(!p) return null; const depth=p.y/90; const hue=(depth*60)%360; const r=20; return (<g key={n.id} transform={`translate(${p.x}, ${p.y})`}><circle r={r} cx={0} cy={0} fill={`hsl(${hue} 70% 45%)`} /><text x={0} y={5} textAnchor="middle" className="font-semibold text-white" fontSize={13}>{String(n.val)}</text></g>) })}
                </g>
              </svg>
            </div>
            <div className="text-xs text-slate-300 mt-2"><strong>Traversal:</strong> {traversal || '-'} • <span>{message}</span></div>
            <div className="mt-4">
              <button onClick={()=>setShowCode(true)} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium">View C Code</button>
            </div>
          </section>

          {/* Controls */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-400">Value</label>
                <div className="mt-1 flex gap-2">
                  <input value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. 42" className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500/60" />
                  <button onClick={handleInsert} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm">Insert</button>
                  <button onClick={handleDelete} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm">Delete</button>
                </div>
              </div>

              <button onClick={()=>handleTraverse('in')} className="col-span-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-sm">Inorder</button>
              <button onClick={()=>handleTraverse('pre')} className="col-span-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-sm">Preorder</button>
              <button onClick={()=>handleTraverse('post')} className="col-span-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-sm">Postorder</button>
              <button onClick={()=>handleTraverse('level')} className="col-span-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-sm">Levelorder</button>

              <div className="col-span-2 h-px bg-white/10 my-2" />

              <div className="col-span-2">
                <label className="text-xs text-slate-400">Build from array</label>
                <div className="mt-1 flex gap-2">
                  <input value={arrayInput} onChange={e=>setArrayInput(e.target.value)} placeholder="e.g. 5,3,7" className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500/60" />
                  <label className="flex items-center gap-2 text-xs text-slate-300 bg-black/40 px-2 rounded-md border border-white/10">
                    <input type="checkbox" checked={clearBeforeBuild} onChange={e=>setClear(e.target.checked)} />
                    Clear first
                  </label>
                  <button onClick={handleBuild} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm">Build</button>
                </div>
              </div>

              <button onClick={()=>{ setRoot(null); setMessage('Tree cleared'); setTraversal('') }} className="col-span-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Clear</button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs text-slate-500">Binary Tree · Visualizer</div>
          <div className="mt-3">
            <a href="/menu.html" className="text-sm text-emerald-400 hover:underline">Back to Menu</a>
          </div>
        </div>
      </footer>
      <CodeModal slug="binary-tree" open={showCode} onClose={()=>setShowCode(false)} />
    </div>
  )
}
