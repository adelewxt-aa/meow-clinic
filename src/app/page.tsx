'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import InputPanel from '@/components/InputPanel';
import ResultPanel from '@/components/ResultPanel';
import SmoothScroll from '@/components/SmoothScroll';
import type {
  BrandInfo,
  DiagnoseErrorResponse,
  DiagnoseResponse,
  KocInfo,
} from '@/lib/types';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function Page() {
  const [brand, setBrand] = useState<BrandInfo>({
    name: '',
    description: '',
    audienceAge: '18-24',
    audienceGender: '女性为主',
  });

  const [koc, setKoc] = useState<KocInfo>({
    name: '',
    followers: '',
    niche: '生活',
    avgLikes: '',
    avgComments: '',
    fanGender: '女性为主',
    style: '种草测评',
    homepageUrl: '',
    recentPosts: '',
  });

  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<DiagnoseResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const canSubmit = useMemo(() => {
    return (
      !!brand.name.trim() &&
      !!brand.description.trim() &&
      !!koc.name.trim() &&
      typeof koc.followers === 'number' && koc.followers >= 0 &&
      typeof koc.avgLikes === 'number' && koc.avgLikes >= 0 &&
      typeof koc.avgComments === 'number' && koc.avgComments >= 0
    );
  }, [brand, koc]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setStatus('loading');
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          koc: {
            ...koc,
            followers: typeof koc.followers === 'number' ? koc.followers : 0,
            avgLikes: typeof koc.avgLikes === 'number' ? koc.avgLikes : 0,
            avgComments: typeof koc.avgComments === 'number' ? koc.avgComments : 0,
            homepageUrl: koc.homepageUrl?.trim() || undefined,
            recentPosts: koc.recentPosts?.trim() || undefined,
          },
        }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as Partial<DiagnoseErrorResponse>;
        throw new Error(err.error || '诊断失败，喵医生暂时走神了');
      }

      const data = (await res.json()) as DiagnoseResponse;
      setResult(data);
      setStatus('done');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '未知错误';
      setErrorMsg(msg);
      setStatus('error');
    }
  }, [brand, koc, canSubmit]);

  return (
    <SmoothScroll>
      <ThreeBackground />
      <CustomCursor />

      <Header />

      <main className="relative mx-auto w-full max-w-[1400px] px-6 pb-24 pt-10 md:px-10 md:pt-14">
        {/* Hero copy */}
        <section className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-ink/55 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Brand × KOC · Diagnosis
          </p>
          <h2 className="font-serif text-[44px] leading-[1.05] tracking-tight text-ink md:text-[68px]">
            一只猫医生，<br />
            诊断你的<span className="italic text-accent">流量</span>处方。
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/60">
            填入品牌与 KOC 的基础信息，喵医生将基于 GLM 模型，
            为你的合作匹配度出具一份克制、可解释的诊断报告。
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[5fr_7fr] lg:gap-10">
          <InputPanel
            brand={brand}
            koc={koc}
            loading={status === 'loading'}
            onBrandChange={setBrand}
            onKocChange={setKoc}
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
          />
          <ResultPanel
            status={status}
            result={result}
            errorMsg={errorMsg}
            onRetry={handleSubmit}
          />
        </section>

        <footer className="mt-24 border-t border-line pt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:gap-12">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/55 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                V1 · Vibe-Coded in a Weekend
              </div>
              <p className="max-w-xl text-[12px] leading-relaxed text-ink/55">
                <span className="font-medium text-ink/75">下一步 Roadmap：</span>
                接入千瓜 / 蝉妈妈等第三方真实 KOC 数据 API，让诊断从「LLM 经验推理」升级为「基于真实粉丝画像与互动数据」的精准评估；引入 Agent 化的多轮交互，让喵医生主动追问关键缺失信息。
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 text-[11px] text-ink/45 md:items-end">
              <p>© {new Date().getFullYear()} 猫咪流量诊所 · Powered by GLM × 火山方舟</p>
              <p className="font-serif italic">— meow, with a stethoscope.</p>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}
