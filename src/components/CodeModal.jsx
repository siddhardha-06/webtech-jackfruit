import React, { useEffect, useState } from 'react'

export default function CodeModal({ slug, open, onClose, language = 'c', apiBase = 'http://localhost:4000' }){
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    let aborted = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${apiBase}/api/ds/${slug}/snippets?lang=${language}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!aborted) setSnippets(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!aborted) setError(e.message || 'Failed to load code')
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    load()
    return () => { aborted = true }
  }, [open, slug, language, apiBase])

  function copy(txt){
    navigator.clipboard?.writeText(txt)
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[min(900px,94vw)] max-h-[80vh] bg-[#0b1220] text-white rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="text-sm text-slate-300">Code snippets — {slug} ({language.toUpperCase()})</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-sm px-2 py-1">Close</button>
        </div>
        <div className="p-4 space-y-4 overflow-auto" style={{maxHeight:'70vh'}}>
          {loading && <div className="text-slate-400 text-sm">Loading…</div>}
          {error && <div className="text-rose-400 text-sm">{error}</div>}
          {!loading && !error && snippets.length === 0 && (
            <div className="text-slate-400 text-sm">No snippets available.</div>
          )}
          {snippets.map((s, i) => (
            <div key={s.id || i} className="border border-white/10 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10">
                <div className="text-sm font-medium">{s.title || 'Untitled'}</div>
                <div className="flex items-center gap-2">
                  {s.complexity?.time && (
                    <span className="text-xs text-slate-300">Time: {s.complexity.time}</span>
                  )}
                  {s.complexity?.space && (
                    <span className="text-xs text-slate-300">Space: {s.complexity.space}</span>
                  )}
                  <button onClick={() => copy(s.code)} className="text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white">Copy</button>
                </div>
              </div>
              {/* Ensure newlines display correctly. Some sources may contain literal "\\n" sequences,
                  so normalize them to actual newlines and use whitespace-preserving style. */}
              <pre className="m-0 p-3 text-sm overflow-auto whitespace-pre-wrap" style={{background:'#0a0f1a'}}>
                <code>{String(s.code || '').replace(/\\r?\\n/g, '\n').replace(/\\\\n/g, '\n')}</code>
              </pre>
              {s.notes && <div className="px-3 py-2 text-xs text-slate-300 bg-white/5 border-t border-white/10">{s.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
