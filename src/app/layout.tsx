import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '猫咪流量诊所 🐾 · Brand × KOC 智能匹配诊断',
  description:
    '基于 GLM 模型，对品牌与 KOC 的合作匹配度进行智能诊断与可解释分析。极简、克制、优雅。',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-white text-ink antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
