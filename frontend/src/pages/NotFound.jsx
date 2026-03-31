import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
	return (
		<main
			className="relative grid min-h-screen place-items-center overflow-hidden px-6"
			style={{
				background:
					'radial-gradient(circle at 15% 18%, rgba(148,163,184,0.22), transparent 42%), radial-gradient(circle at 83% 76%, rgba(251,191,36,0.18), transparent 46%), linear-gradient(135deg, #f8fafc 0%, #fefce8 55%, #fef3c7 100%)'
			}}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-[8%] top-[10%] aspect-square w-[min(44vw,320px)] rounded-full bg-linear-to-br from-slate-300 to-amber-200 opacity-35 blur-3xl animate-pulse [animation-duration:6.2s]"
			/>

			<section
				role="alert"
				aria-live="polite"
				className="relative z-10 w-full max-w-xl rounded-2xl border border-white/70 bg-white/80 p-8 text-center shadow-[0_14px_40px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-all duration-500 motion-safe:translate-y-0 motion-safe:opacity-100 md:p-10"
			>
				<p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
					Error 404
				</p>
				<h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
					Page not found
				</h1>
				<p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 md:text-base">
					The page you are looking for does not exist or may have been moved.
				</p>

				<Link
					to="/"
					className="mt-7 inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
				>
					Back to home
				</Link>
			</section>
		</main>
	);
}

export default NotFound;
