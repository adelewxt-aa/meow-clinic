# 猫咪流量诊所 🐾

> 一只戴听诊器的猫医生，30 秒为品牌×KOC 投放出一份可解释的匹配诊断书。

**Live Demo**：[meow-clinic-stfd.vercel.app](https://meow-clinic-stfd.vercel.app/) · 海外可直接访问，国内建议挂梯子
**GitHub**：[adelewxt-aa/meow-clinic](https://github.com/adelewxt-aa/aa)

---

## 这是什么 / 解决什么问题

新锐消费品的最大获客困境之一：**KOC 投放选号靠拍脑袋，ROI 不可控**。

`猫咪流量诊所` 是一个**实验性的 AI 工具**：用户在左侧分别填写「品牌」与「KOC」画像信息（可选粘贴 KOC 主页链接与近期笔记），后端通过 LLM 在四个维度（**用户画像 / 内容契合 / 互动健康 / 内容真实质量**）打分，30 秒给出可解释的 0-100 匹配评分、三因利弊和具体合作建议。

设计上故意做得**极简、克制、像 Stripe 的产品页一样**，因为我相信"专业的工具长得就该让人愿意认真填写"。

---

## 一周末，从 0 到上线的 Vibe Coding 复盘

这个项目是我用 **Vibe Coding 模式**（AI 编程助手 + 高频对话式协作）从 0 到部署上线的真实记录。下面是我对自己工作流的一次结构化复盘。

### 1. 项目背景

- **触发场景**：我在面试某 AI 战略岗位时，被问到 Vibe Coding 的实战经验，回答得不够好。回去后心里一直挂着这件事——"我得用一个真实的、上线的产品来证明这件事"。
- **48 小时内的成果**：
  - 完整的 Next.js 14 App Router 项目
  - 自定义磁性鼠标指针、Three.js 极简 3D 背景、Lenis 平滑滚动、Framer Motion 入场动画、GSAP 微交互
  - 后端 Route Handler 代理火山方舟豆包大模型（带模型自动 fallback、严格 JSON 解析容错、四维度评分 prompt 工程）
  - 部署到 Vercel + 多次迭代

### 2. 工作流的实际节奏

```
需求脑暴 ─→ 用 AI 写 PRD（输出到 .trae/documents/PRD.md）
       ─→ 一句话指令生成第一版骨架（Next.js + Tailwind 模板）
       ─→ 视觉迭代（在对话里直接说"这个橙色再暗 5%"、"鼠标在白底上看不清，换个颜色"）
       ─→ 真实问题驱动（"为什么填啥都返回 502？"→ 暴露出 GLM-5.1 模型 ID 不存在的真问题）
       ─→ 部署 → 收到使用反馈 → 反向重构 prompt
```

### 3. 我学到的 3 件事

#### ① "Vibe Coding ≠ 不写代码"，而是**重新分配脑力**
传统工作流中我会花大量时间写样板代码（Tailwind class、Three.js 初始化、表单状态管理）。Vibe Coding 让这部分时间被压缩到几乎为零，**我把节省的时间投入到了"判断哪个细节最值得抠"** —— 比如鼠标指针的颜色从深炭黑改成主橙色这种 5 分钟改动，反而是用户体验最有感的部分。

#### ② AI 也会"自信地编造"，**产品人必须做现实检验**
项目第一次部署后，"无论填什么都返回 502"。我没有让 AI 直接猜原因，而是要求它**调用真实 HTTP 探测脚本逐个测试模型 ID**，最终定位真因：`GLM-5.1` 这个模型在火山方舟根本不存在（这个 API Key 实际只有豆包 1.5 的访问权限）。
**洞察**：LLM 的训练数据有截止时间，很多"看起来对"的代码（模型名、API 路径）需要真实环境校验。

#### ③ **LLM 推理 ≠ 真实数据**——这正是产品迭代的关键洞察
V1 版本所有诊断都基于用户手填的字段做"文字推理"，AI 并不会真的去小红书查"橘子小姐"是不是真有这个人。
这促使我在 V1.1 里加上了**"粘贴主页链接 + 近期笔记内容"**字段，并明确在诊断报告里用徽章区分「基于真实素材」与「基于经验推测」——让产品**对自己的能力边界保持诚实**，这是 AI 工具区别于"AI 玩具"的第一步。

### 4. 下一步 Roadmap

| 阶段 | 目标 | 关键动作 |
|---|---|---|
| **V1**（已上线） | 用 LLM 跑通端到端流程 | Next.js + 火山方舟豆包 + Vercel 部署 |
| **V1.1**（已上线） | 引入真实素材依据，让诊断"可被验证" | 加链接 / 笔记字段 + 多维评分 + 真实素材徽章 |
| **V2**（规划中） | 接入第三方真实 KOC 数据 API | 千瓜（小红书）/ 蝉妈妈（抖音），按号自动拉粉丝画像与互动数据 |
| **V3**（规划中） | Agent 化——喵医生主动追问 | 用 Function Calling 让 AI 在关键信息缺失时主动追问而非编造 |
| **V4**（远期） | 投放预算优化建议 | 引入 LTV / ROI 模型，从"匹配诊断"走向"投放策略" |

### 5. 这个项目跟「AI 战略 / 用户增长」的连接

- **AI 战略**：这是一个真实业务场景下"在产品哪个环节插入 LLM 才能撬动价值"的微观实验。诊断本身是低频但高价值的决策——LLM 在这里能做的不是替代专家，而是让"决策的可解释性"对没有专业知识的小品牌方也变得可触达。
- **用户增长**：品牌方的 KOC 投放本质是用户增长漏斗最上层的获客优化。**让选号效率提升 50%，就等于让获客 ROI 提升 50%**。这个工具如果能演化到 V3，它就是一个"AI 时代的小型增长工程师"。

---

## 技术栈

| 类别 | 选型 |
|---|---|
| Framework | Next.js 14（App Router）+ React 18 + TypeScript |
| 样式 | Tailwind CSS（自定义设计令牌） |
| 动画 | Framer Motion · GSAP · Lenis（平滑滚动）|
| 3D | Three.js（极简线框背景）|
| LLM 调用 | 火山方舟 ARK · 豆包 1.5 Pro 32K（实际可访问模型，PRD 里写的 GLM-5.1 已 fallback）|
| 部署 | Vercel（Serverless Function）|

## 本地运行

```bash
git clone https://github.com/adelewxt-aa/meow-clinic
cd meow-clinic
npm install
cp .env.local.example .env.local   # 填入 ARK_API_KEY
npm run dev                        # http://localhost:3000
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx                  # 根布局
│   ├── page.tsx                    # 主页（左右双栏 + 状态机）
│   ├── globals.css                 # Tailwind + 全局光标隐藏 + Lenis 样式
│   └── api/diagnose/route.ts       # GLM/豆包代理 + Prompt 工程 + 模型 fallback
├── components/
│   ├── Header.tsx                  # Logo + 导航
│   ├── InputPanel.tsx              # 品牌 / KOC 表单（含深度素材区）
│   ├── ResultPanel.tsx             # 评分 + 四维 + 三因 + 建议
│   ├── CustomCursor.tsx            # 自定义磁性鼠标
│   ├── SmoothScroll.tsx            # Lenis 阻尼滚动
│   └── ThreeBackground.tsx         # Three.js 极简 3D 背景
└── lib/types.ts                    # TypeScript 类型 + 评分→表情映射
```

## 致谢

- 设计灵感：Stripe、Linear、Apple Newsroom 的极简克制
- 字体：Playfair Display × Inter
- 工具：感谢这一周末耐心陪我改了几十轮的 AI 编程助手 🐾

---

**做这个项目的人**：王宣婷
**联系**：wxtadele@163.com

> "每一次诊断，都是猫医生对市场温柔的判断。"
