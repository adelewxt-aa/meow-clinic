'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import type { DiagnoseResponse } from '@/lib/types';
import { scoreToEmoji, scoreToVibe } from '@/lib/types';

type Status = 'idle' | 'loading' | 'done' | 'error';

interface Props {
  status: Status;
  result: DiagnoseResponse | null;
  errorMsg: string;
  onRetry: () => void;
}

export default function ResultPanel({ status, result, errorMsg, onRetry }: Props) {
  return (
    <section
      aria-live="polite"
      className="relative min-h-[540px] overflow-hidden rounded-[28px] border border-line bg-mist/40 p-7 backdrop-blur-sm md:p-10"
    >
      <div className="mb-7 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
          Step 02 · Diagnosis Report
        </p>
        <span className="font-serif text-sm italic text-ink/40">by Dr. Meow</span>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && <IdleState key="idle" />}
        {status === 'loading' && <LoadingState key="loading" />}
        {status === 'done' && result && <DoneState key="done" data={result} />}
        {status === 'error' && (
          <ErrorState key="error" msg={errorMsg} onRetry={onRetry} />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------- States ------- */

function IdleState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-start gap-8 pt-6"
    >
      <CatLineArt />
      <div>
        <h3 className="font-serif text-[40px] leading-[1.1] text-ink md:text-[56px]">
          一份还没<br /><span className="italic text-ink/60">开方</span>的诊断书。
        </h3>
        <p className="mt-5 max-w-md text-[14px] leading-relaxed text-ink/55">
          请在左侧填写品牌与 KOC 信息，喵医生会根据画像、内容方向、互动率与账号风格，
          为这次合作出具一份 0-100 的匹配评分与具体建议。
        </p>
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center"
    >
      <SpinningPaw />
      <div>
        <p className="font-serif text-2xl text-ink md:text-3xl">诊断中…🐾</p>
        <p className="mt-2 text-[13px] text-ink/50">喵医生正在翻阅画像档案</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink/35">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        Analyzing brand × koc fit
      </div>
    </motion.div>
  );
}

function DoneState({ data }: { data: DiagnoseResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <ScoreBlock score={data.score} basedOnRealContent={data.basedOnRealContent} />

      {data.dimensions && data.dimensions.length > 0 && (
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-ink/45">
            诊断维度
          </p>
          <div className="space-y-3">
            {data.dimensions.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-line bg-white px-4 py-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-ink">{d.name}</span>
                  <span className="font-serif text-[16px] tabular-nums text-ink">{d.score}</span>
                </div>
                <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-mist">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.score}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
                {d.comment && (
                  <p className="text-[12px] leading-relaxed text-ink/55">{d.comment}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-ink/45">
          诊断三因
        </p>
        <ul className="space-y-3">
          {data.reasons.map((r, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 rounded-2xl border border-line bg-white px-5 py-4"
            >
              <span
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                  r.type === 'pro' ? 'bg-accent text-white' : 'bg-ink text-white'
                }`}
              >
                {r.type === 'pro'
                  ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  : <X className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </span>
              <p className="text-[14px] leading-relaxed text-ink/85">{r.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.45, duration: 0.6 }}
        className="rounded-2xl bg-mist px-6 py-5"
      >
        <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-ink/45">
          喵医生建议
        </p>
        <p className="font-serif text-[18px] leading-relaxed text-ink md:text-[20px]">
          “{data.suggestion}”
        </p>
      </motion.div>
    </motion.div>
  );
}

function ErrorState({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-center"
    >
      <div className="text-[88px] leading-none">😿</div>
      <div>
        <p className="font-serif text-2xl text-ink">喵医生今天有点走神</p>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink/55">
          {msg || '诊断失败，请稍后再试。'}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        data-magnetic="true"
        className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-[13px] tracking-wide text-ink transition-all hover:border-accent hover:text-accent"
      >
        <RefreshCw className="h-3.5 w-3.5 transition-transform group-hover:rotate-[-90deg]" />
        重试一次
      </button>
    </motion.div>
  );
}

/* ------- Bits ------- */

function ScoreBlock({ score, basedOnRealContent }: { score: number; basedOnRealContent?: boolean }) {
  const display = useCountUp(score, 1400);
  const emoji = scoreToEmoji(score);
  const vibe = scoreToVibe(score);

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
          匹配度评分
        </p>
        {basedOnRealContent ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            基于真实素材
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ink/55">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/35" />
            基于经验推测
          </span>
        )}
      </div>
      <div className="flex items-end gap-5">
        <motion.span
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[120px] leading-none text-ink md:text-[160px]"
        >
          {display}
        </motion.span>
        <div className="pb-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[56px] leading-none md:text-[72px]"
          >
            {emoji}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-[12px] uppercase tracking-[0.22em] text-accent"
          >
            {vibe}
          </motion.p>
        </div>
      </div>
      <div className="mt-6 h-px w-full bg-line" />
    </div>
  );
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const v = Math.round(from + (target - from) * ease(t));
      setVal(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return val;
}

function SpinningPaw() {
  return (
    <div
      className="text-accent"
      style={{ animation: 'paw-spin 1.6s linear infinite' }}
    >
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="18" r="3" />
        <circle cx="20" cy="12" r="3" />
        <circle cx="28" cy="12" r="3" />
        <circle cx="36" cy="18" r="3" />
        <path d="M15 32c0-6 4-10 9-10s9 4 9 10c0 4-3.2 6-5.6 6-2 0-2.4-1.2-3.4-1.2s-1.4 1.2-3.4 1.2C18.2 38 15 36 15 32Z" />
      </svg>
    </div>
  );
}

function CatLineArt() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-24 w-24 text-ink/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M30 50 L24 30 L42 44" />
      <path d="M90 50 L96 30 L78 44" />
      <ellipse cx="60" cy="62" rx="34" ry="30" />
      <circle cx="50" cy="60" r="2" fill="currentColor" />
      <circle cx="70" cy="60" r="2" fill="currentColor" />
      <path d="M58 72 Q60 75 62 72" />
      <path d="M45 70 L36 68" />
      <path d="M45 73 L36 75" />
      <path d="M75 70 L84 68" />
      <path d="M75 73 L84 75" />
    </svg>
  );
}
