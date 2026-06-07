'use client';

import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <div className="flex items-baseline gap-3">
          <PawMark className="h-5 w-5 text-accent" />
          <h1 className="font-serif text-2xl tracking-tight text-ink md:text-[28px]">
            猫咪流量诊所
          </h1>
          <span className="text-xl md:text-2xl" aria-hidden="true">🐾</span>
        </div>

        <nav className="hidden items-center gap-7 text-[12px] uppercase tracking-[0.18em] text-ink/55 md:flex">
          <a className="transition-colors hover:text-ink" href="#">Diagnose</a>
          <a className="transition-colors hover:text-ink" href="#">About</a>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-ink/65">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Powered · GLM
          </span>
        </nav>
      </div>
    </motion.header>
  );
}

function PawMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="9" r="1.6" />
      <circle cx="10" cy="6" r="1.6" />
      <circle cx="14" cy="6" r="1.6" />
      <circle cx="18" cy="9" r="1.6" />
      <path d="M7.5 16c0-3 2-5 4.5-5s4.5 2 4.5 5c0 2-1.6 3-2.8 3-1 0-1.2-.6-1.7-.6s-.7.6-1.7.6C9.1 19 7.5 18 7.5 16Z" />
    </svg>
  );
}
