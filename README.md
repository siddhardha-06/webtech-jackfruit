# VisuAlgo Clone (Frontend + Backend)

Interactive data structure visualizers (Array, Linked List, Queue, Stack, Binary Tree, BST) with animated backgrounds (Ballpit & Aurora) plus a backend serving code snippets (C language initially).

## Frontend (Vite + React)

Scripts:

```powershell
npm install
npm run dev
```

Open http://localhost:5173

### Organized Structure

```
root/
	array.html          # Array visualizer entry (module -> src/arrayMain.jsx)
	linked_list.html    # Linked list entry (-> src/llMain.jsx)
	queue.html          # Queue entry (-> src/queueMain.jsx)
	stack.html          # Stack entry (-> src/stackMain.jsx)
	binarytree.html     # Binary tree entry (-> src/binaryTreeMain.jsx)
	bst.html            # BST entry (-> src/bstMain.jsx)
	landing.html        # Landing page (-> src/landingMain.jsx)
	menu.html           # Menu (Aurora background) (-> src/main.jsx)
	src/
		App.jsx           # Menu React component
		index.css         # Global styles
		binaryTreeMain.jsx / bstMain.jsx  # New React entry points for tree pages
		pages/
			ArrayApp.jsx
			LinkedListApp.jsx
			QueueApp.jsx
			StackApp.jsx
			BinaryTreeApp.jsx
			BSTApp.jsx
		components/
			Aurora.jsx
			Ballpit.jsx
			CodeModal.jsx
		assets/           # Static assets (video, images)
		TextType.jsx
	server/             # Express + Mongo backend
```

Removed legacy Create React App scaffold (`first page/`) and inline UMD React implementations in `binarytree.html` & `bst.html` (migrated to proper React components).

### Cleanup Notes

- Tree visualizers now share the same React structure pattern as other data structures.
- Legacy duplicate video `LL video.mp4` removed; using `LL_video.mp4` consistently.
- Each HTML entry is a thin shell loading a dedicated `*Main.jsx` file.

### Next Improvements (Optional)

- Consolidate all `*Main.jsx` files under `src/entries/` (adjust HTML script paths).
- Add syntax highlighting (e.g. Prism) inside `CodeModal`.
- Add language switcher when more than C snippets are available.


## Backend (Express + MongoDB)

Located in `server/`.

Setup:

1. Copy `server/.env.example` to `server/.env` and adjust values if needed.
2. Install server dependencies & seed database:

```powershell
cd server
npm install
npm run seed
npm run dev
```

Server runs on http://localhost:4000

### API Endpoints

- `GET /api/health` — health check
- `GET /api/ds` — list data structures `{ slug, name, tags, order }`
- `GET /api/ds/:slug` — full data structure (embedded `codeSnippets`)
- `GET /api/ds/:slug/snippets?lang=c` — filtered snippets by language

### Data Model (Option A: Embedded Snippets)

```json
{
	"slug": "linked-list",
	"name": "Linked List",
	"description": "Singly linked list in C",
	"order": 2,
	"tags": ["linear"],
	"related": ["queue", "stack"],
	"codeSnippets": [
		{
			"id": "ll-c-basic",
			"language": "c",
			"title": "Singly Linked List (C)",
			"complexity": { "time": "O(n)", "space": "O(1)" },
			"code": "..."
		}
	]
}
```

### Seeding

Seed file: `server/seed/data-structures.json` — edit and re-run `npm run seed` to update.

### Frontend Integration (Planned)

Will add a modal component that fetches `/api/ds/:slug` and displays code snippets with syntax highlighting.

### License / Attribution

Educational clone inspired by VisuAlgo style. Not affiliated with original site.

