import './index.css'
import llVideo from './LL_video.mp4'
import quevideo from './Queue_video.mp4'
import binaryvideo from './Binary_video.mp4'
import bstvideo from './BST_video.mp4'
import stackvideo from './Stack_video.mp4'
import arrayvideo from './Array_video.mp4'
import TextType from './TextType'
import Aurora from './components/Aurora'

function App() {
	const navigate = (path) => {
		// Use absolute paths to avoid issues if current URL has a nested segment or query params
		if(!path.startsWith('/')) path = '/' + path
		window.location.href = path
	}

	return (
		<div className="app-root relative min-h-screen">
			{/* Aurora background layer for second page (menu) */}
			<div className="app-aurora-wrapper">
				<Aurora colorStops={["#5227FF", "#7cff67", "#5227FF"]} amplitude={1.0} blend={0.55} />
			</div>
			<div className="app-content relative z-10">
				<header>
					<div className="text-3xl font-bold font-mono mb-4 mt-4">
						<TextType
							text={["Welcome to Structify", "Visualising DSA", "Happy coding!"]}
							typingSpeed={75}
							pauseDuration={1500}
							showCursor={true}
							cursorCharacter=""
						/>
					</div>
				</header>

				<article>
					<div className="flex flex-wrap justify-around gap-6 mb-10 mt-10">
						{/* Array */}
						<button
							type="button"
							className="containers relative overflow-hidden flex justify-center items-center text-xl py-6 px-6 w-[300px] h-[200px] text-white bg-transparent hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg"
							onClick={() => navigate('array.html')}
						>
							<div className="relative z-10 flex items-end justify-center w-full h-full pointer-events-none">
								<h3 className="text-white">Array</h3>
							</div>
							<video
								style={{ pointerEvents: 'none' }}
								className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
								autoPlay
								loop
								muted
								playsInline
								src={arrayvideo}
								aria-hidden="true"
							/>
						</button>

						{/* Linked List tile with video */}
						<button
							type="button"
							className="containers relative overflow-hidden flex justify-center items-center text-xl py-6 px-6 w-[300px] h-[200px] text-white bg-transparent hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg"
							onClick={() => navigate('linked_list.html')}
						>
							<div className="relative z-10 flex items-end justify-center w-full h-full pointer-events-none">
								<h3 className="text-white">Linked List</h3>
							</div>
							<video
								style={{ pointerEvents: 'none' }}
								className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
								autoPlay
								loop
								muted
								playsInline
								src={llVideo}
								aria-hidden="true"
							/>
						</button>

						{/* Stack */}
						<button
							type="button"
							className="containers relative overflow-hidden flex justify-center items-center text-xl py-6 px-6 w-[300px] h-[200px] text-white bg-transparent hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg"
							onClick={() => navigate('stack.html')}
						>
							<div className="relative z-10 flex items-end justify-center w-full h-full pointer-events-none">
								<h3 className="text-white">Stack</h3>
							</div>
							<video
								style={{ pointerEvents: 'none' }}
								className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
								autoPlay
								loop
								muted
								playsInline
								src={stackvideo}
								aria-hidden="true"
							/>
						</button>
					</div>

					<div className="flex flex-wrap justify-around gap-6">
							<button
							type="button"
							className="containers relative overflow-hidden flex justify-center items-center text-xl py-6 px-6 w-[300px] h-[200px] text-white bg-transparent hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg"
							onClick={() => navigate('queue.html')}
						>
							<div className="relative z-10 flex items-end justify-center w-full h-full pointer-events-none">
								<h3 className="text-white">Queue</h3>
							</div>
							<video
								style={{ pointerEvents: 'none' }}
								className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
								autoPlay
								loop
								muted
								playsInline
								src={quevideo}
								aria-hidden="true"
							/>
						</button>
						<button
							type="button"
							className="containers relative overflow-hidden flex justify-center items-center text-xl py-6 px-6 w-[300px] h-[200px] text-white bg-transparent hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg"
							onClick={() => navigate('binarytree.html')}
						>
							<div className="relative z-10 flex items-end justify-center w-full h-full pointer-events-none">
								<h3 className="text-white">Binary Tree</h3>
							</div>
							<video
								style={{ pointerEvents: 'none' }}
								className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
								autoPlay
								loop
								muted
								playsInline
								src={binaryvideo}
								aria-hidden="true"
							/>
						</button>
						<button
							type="button"
							className="containers relative overflow-hidden flex justify-center items-center text-xl py-6 px-6 w-[300px] h-[200px] text-white bg-transparent hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg"
							onClick={() => navigate('bst.html')}
						>
							<div className="relative z-10 flex items-end justify-center w-full h-full pointer-events-none">
								<h3 className="text-white">Binary Search Tree</h3>
							</div>
							<video
								style={{ pointerEvents: 'none' }}
								className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
								autoPlay
								loop
								muted
								playsInline
								src={bstvideo}
								aria-hidden="true"
							/>
						</button>
					</div>
					<aside className="text-center h-16 flex items-center justify-center bg-transparent border-t border-white/10 mt-10">
						<a href="/about.html" className="text-sm text-slate-300 hover:text-white">About us</a>
					</aside>
				</article>
			</div>
			<footer className="py-6 text-center text-xs text-gray-300">© 2025 VisuAlgo Replica</footer>
		</div>
	);
}

export default App
