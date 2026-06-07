'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users2 } from 'lucide-react';
import {
  ACCOUNT_STYLES, AGE_GROUPS, GENDERS, NICHES,
  type AccountStyle, type AgeGroup, type BrandInfo, type Gender, type KocInfo, type Niche,
} from '@/lib/types';

interface InputPanelProps {
  brand: BrandInfo;
  koc: KocInfo;
  loading: boolean;
  canSubmit: boolean;
  onBrandChange: (b: BrandInfo) => void;
  onKocChange: (k: KocInfo) => void;
  onSubmit: () => void;
}

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.25 },
  },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function InputPanel({
  brand, koc, loading, canSubmit, onBrandChange, onKocChange, onSubmit,
}: InputPanelProps) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative rounded-[28px] border border-line bg-white/95 p-7 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_60px_-30px_rgba(0,0,0,0.18)] backdrop-blur-sm md:p-9"
    >
      <motion.div variants={item} className="mb-7 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
          Step 01 · Inputs
        </p>
        <span className="font-serif text-sm italic text-ink/40">fill the slip</span>
      </motion.div>

      {/* Brand */}
      <motion.div variants={item} className="space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" strokeWidth={2} />
          <h2 className="font-serif text-xl text-ink">品牌信息</h2>
        </div>

        <Field label="产品名称">
          <input
            type="text"
            value={brand.name}
            onChange={(e) => onBrandChange({ ...brand, name: e.target.value })}
            placeholder="例如：喵选宠物零食"
            maxLength={50}
            className="form-input"
          />
        </Field>

        <Field label="一句话描述">
          <textarea
            value={brand.description}
            onChange={(e) => onBrandChange({ ...brand, description: e.target.value })}
            placeholder="面向年轻女性的高端宠物零食品牌，主打天然成分..."
            maxLength={300}
            rows={3}
            className="form-input resize-none"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="目标用户年龄段">
            <Select<AgeGroup>
              value={brand.audienceAge}
              options={AGE_GROUPS}
              onChange={(v) => onBrandChange({ ...brand, audienceAge: v })}
            />
          </Field>
          <Field label="目标用户性别">
            <Select<Gender>
              value={brand.audienceGender}
              options={GENDERS}
              onChange={(v) => onBrandChange({ ...brand, audienceGender: v })}
            />
          </Field>
        </div>
      </motion.div>

      <motion.div variants={item} className="my-8 h-px w-full bg-line" />

      {/* KOC */}
      <motion.div variants={item} className="space-y-5">
        <div className="flex items-center gap-2">
          <Users2 className="h-4 w-4 text-accent" strokeWidth={2} />
          <h2 className="font-serif text-xl text-ink">KOC 信息</h2>
        </div>

        <Field label="KOC 名字">
          <input
            type="text"
            value={koc.name}
            onChange={(e) => onKocChange({ ...koc, name: e.target.value })}
            placeholder="例如：橘子小姐"
            maxLength={50}
            className="form-input"
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="粉丝数量">
            <input
              type="number"
              min={0}
              value={koc.followers}
              onChange={(e) => {
                const v = e.target.value;
                onKocChange({ ...koc, followers: v === '' ? '' : Math.max(0, parseInt(v, 10) || 0) });
              }}
              placeholder="例如：32000"
              className="form-input"
            />
          </Field>
          <Field label="近期平均点赞数">
            <input
              type="number"
              min={0}
              value={koc.avgLikes}
              onChange={(e) => {
                const v = e.target.value;
                onKocChange({ ...koc, avgLikes: v === '' ? '' : Math.max(0, parseInt(v, 10) || 0) });
              }}
              placeholder="例如：1200"
              className="form-input"
            />
          </Field>
        </div>

        <Field label="内容方向">
          <Select<Niche>
            value={koc.niche}
            options={NICHES}
            onChange={(v) => onKocChange({ ...koc, niche: v })}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="近期平均评论数">
            <input
              type="number"
              min={0}
              value={koc.avgComments}
              onChange={(e) => {
                const v = e.target.value;
                onKocChange({ ...koc, avgComments: v === '' ? '' : Math.max(0, parseInt(v, 10) || 0) });
              }}
              placeholder="例如：80"
              className="form-input"
            />
          </Field>
          <Field label="粉丝主要性别">
            <Select<Gender>
              value={koc.fanGender}
              options={GENDERS}
              onChange={(v) => onKocChange({ ...koc, fanGender: v })}
            />
          </Field>
        </div>

        <Field label="账号风格">
          <Select<AccountStyle>
            value={koc.style}
            options={ACCOUNT_STYLES}
            onChange={(v) => onKocChange({ ...koc, style: v })}
          />
        </Field>

        <div className="rounded-2xl border border-dashed border-line bg-mist/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.18em] text-accent">
              深度素材 · 可选
            </p>
            <span className="text-[10px] text-ink/45">提供后诊断从「经验推理」升级为「基于真实内容」</span>
          </div>

          <Field label="KOC 主页链接（小红书 / 抖音）">
            <input
              type="url"
              value={koc.homepageUrl ?? ''}
              onChange={(e) => onKocChange({ ...koc, homepageUrl: e.target.value })}
              placeholder="https://www.xiaohongshu.com/user/profile/..."
              className="form-input"
            />
          </Field>

          <div className="mt-4">
            <Field label="最近 3-5 篇笔记标题或简要内容">
              <textarea
                value={koc.recentPosts ?? ''}
                onChange={(e) => onKocChange({ ...koc, recentPosts: e.target.value })}
                placeholder={'例如：\n1. "我家主子终于肯吃这个了！喵选冻干开箱"\n2. "新手养猫必看的 5 个坑"\n3. "猫粮对比测评｜进口 vs 国产"'}
                maxLength={800}
                rows={5}
                className="form-input resize-none text-[13px]"
              />
            </Field>
            <p className="mt-2 text-[10px] text-ink/40">
              粘贴真实笔记后，喵医生会基于内容做更可靠的判断，并在报告中明确标注「基于真实素材」徽章。
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="mt-10">
        <button
          type="button"
          disabled={!canSubmit || loading}
          onClick={onSubmit}
          data-magnetic="true"
          className="group relative w-full overflow-hidden rounded-full bg-accent px-8 py-4 text-[15px] font-medium tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-btn-glow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? '诊断中…' : '开始诊断'}
            <span aria-hidden="true">🐾</span>
          </span>
        </button>
        <p className="mt-3 text-center text-[11px] text-ink/40">
          填完所有必填项即可开始 · 由喵医生为你出具一份诊断书
        </p>
      </motion.div>
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-ink/45">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select<T extends string>({
  value, options, onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="form-input appearance-none pr-9 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-ink/40"
        viewBox="0 0 12 8" fill="none"
      >
        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
