import TextType from '../TextType'

export default function About(){
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col items-start gap-1">
          <h1 className="text-xl font-semibold">About — Structify</h1>
          <TextType
            text={["Interactive Data Structure Visualizer","Built for learning by doing"]}
            typingSpeed={75}
            pauseDuration={1400}
            showCursor={true}
            className="text-sm text-gray-300"
            cursorCharacter="|"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
        <section className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <p className="text-slate-300 leading-relaxed">
            Structify is a lightweight, educational visualizer for core data structures. It mirrors
            classroom operations with a clean UI so you can see how each operation changes the
            structure in real-time.
          </p>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 p-4 bg-black/40">
              <h3 className="font-semibold mb-2">What you can explore</h3>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                <li>Array: create, insert, remove, update</li>
                <li>Linked List: create, insert, remove, update</li>
                <li>Stack: push, pop, peek</li>
                <li>Queue: enqueue, dequeue, peek</li>
                <li>Binary Tree: level-order build, traversals</li>
                <li>BST: insert, delete, traversals</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 p-4 bg-black/40">
              <h3 className="font-semibold mb-2">Tech stack</h3>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                <li>Frontend: React + Vite + Tailwind-style utilities</li>
                <li>Optional backend: Express server (seeded examples)</li>
                <li>Animations: small utility components (e.g., TextType)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-sm text-slate-400">
            Tip: Every visualizer page includes a “View C Code” button with a concise reference
            implementation of the shown operations.
          </div>
          <div className="mt-6">
            <a href="/menu.html" className="inline-block px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium">Back to Menu</a>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-400">
        <div>© 2025 Structify • Built for learning</div>
      </footer>
    </div>
  )
}
