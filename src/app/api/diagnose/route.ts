import { NextRequest, NextResponse } from 'next/server';
import type {
  DiagnoseErrorResponse,
  DiagnoseRequest,
  DiagnoseResponse,
  ErrorCode,
} from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const ENDPOINT = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
// 主用模型 ID（按 PRD 要求保留 GLM-5.1）
const PRIMARY_MODEL = 'GLM-5.1';
// 当主模型不可用时，按顺序自动回退到当前 API Key 实际可访问的模型
const FALLBACK_MODELS = [
  'doubao-1-5-pro-32k-250115',
  'doubao-1-5-lite-32k-250115',
];
const API_KEY = process.env.ARK_API_KEY ?? '';

function fail(code: ErrorCode, error: string, status = 400) {
  const body: DiagnoseErrorResponse = { code, error };
  return NextResponse.json(body, { status });
}

function buildPrompt(req: DiagnoseRequest): { system: string; user: string; hasRealContent: boolean } {
  const { brand, koc } = req;
  const hp = (koc as unknown as { homepageUrl?: string }).homepageUrl?.trim() ?? '';
  const posts = (koc as unknown as { recentPosts?: string }).recentPosts?.trim() ?? '';
  const hasRealContent = !!(hp || posts);

  const system = `你是「喵医生」——一位极简、克制、专业的品牌×KOC 合作诊断顾问。
说话风格像一位戴听诊器的猫医生：温柔、精炼、带一点点猫式幽默，但绝不卖萌、不夸张、不奉承。

任务：基于用户提供的「品牌」与「KOC」信息，输出一份**严格遵守 JSON Schema** 的诊断报告。

【打分四维度（每项 0-100 分）】
1. audience_fit    用户画像匹配度（性别契合 + 品牌目标年龄段 vs KOC 内容方向/账号风格暗示的受众层）
2. content_fit     内容方向与品牌定位契合度
3. engagement     互动健康度（结合粉丝数、点赞率、**评论率**、点赞/评论比合理性，识别可能的买粉或僵尸粉）
4. authenticity   ${hasRealContent
    ? '内容真实质量与可信度（基于用户提供的"主页链接 / 最近笔记"做实质判断）'
    : '账号风格与品牌调性匹配度（用户未提供真实素材，请保守估分并在 comment 里注明"基于经验推测"）'}

【总分 score】取四个维度的加权平均（audience_fit 0.25 + content_fit 0.3 + engagement 0.2 + authenticity 0.25），四舍五入到整数。

【硬性约束】
- **禁止编造任何用户没提供的数据**（粉丝数、互动率只能用用户填写的）。
- ${hasRealContent
    ? '用户提供了真实素材（主页链接/笔记内容），原因和 authenticity 维度的 comment **必须引用具体笔记内容**或主页观察。'
    : '用户未提供真实素材，必须在 suggestion 末尾追加一句："建议提供 KOC 主页链接与近期笔记内容，可获得更精准诊断"。'}
- 严格输出 JSON，禁止任何额外文字、解释或 Markdown 包裹。

【JSON Schema】
{
  "score": <0-100 整数>,
  "dimensions": [
    { "name": "用户画像匹配", "score": <0-100>, "comment": "<不超过 30 字>" },
    { "name": "内容方向契合", "score": <0-100>, "comment": "<不超过 30 字>" },
    { "name": "互动健康度",   "score": <0-100>, "comment": "<不超过 30 字>" },
    { "name": "${hasRealContent ? '内容真实质量' : '风格调性匹配'}", "score": <0-100>, "comment": "<不超过 30 字>" }
  ],
  "reasons": [
    { "type": "pro"|"con", "text": "<不超过 40 字的中文短句>" },
    { "type": "pro"|"con", "text": "<不超过 40 字的中文短句>" },
    { "type": "pro"|"con", "text": "<不超过 40 字的中文短句>" }
  ],
  "suggestion": "<1-2 句具体可执行的合作建议，不超过 100 字，带一点猫医生口吻>",
  "based_on_real_content": ${hasRealContent}
}`;

  const engagementRate = typeof koc.followers === 'number' && koc.followers > 0 && typeof koc.avgLikes === 'number'
    ? ((koc.avgLikes / koc.followers) * 100).toFixed(2) + '%'
    : '未知';

  const commentRate = typeof koc.followers === 'number' && koc.followers > 0 && typeof koc.avgComments === 'number'
    ? ((koc.avgComments / koc.followers) * 100).toFixed(2) + '%'
    : '未知';

  const likeToCommentRatio = typeof koc.avgLikes === 'number' && typeof koc.avgComments === 'number' && koc.avgComments > 0
    ? (koc.avgLikes / koc.avgComments).toFixed(1)
    : '未知';

  const realBlock = hasRealContent
    ? `

【🔍 KOC 真实素材（用户提供，必须基于此分析）】
${hp ? `- 主页链接：${hp}` : ''}
${posts ? `- 最近笔记内容：\n${posts}` : ''}`
    : `

【⚠️ 未提供真实素材】用户没有粘贴 KOC 主页链接和笔记内容。
请按"经验推测"模式诊断，并在 suggestion 末尾提示用户补充素材以获得精准结果。`;

  const user = `【品牌信息】
- 产品名称：${brand.name}
- 一句话描述：${brand.description}
- 目标用户年龄段：${brand.audienceAge}
- 目标用户性别：${brand.audienceGender}

【KOC 基础信息】
- 名字：${koc.name}
- 粉丝数：${typeof koc.followers === 'number' ? koc.followers.toLocaleString() : '未填'}
- 内容方向：${koc.niche}
- 近期平均点赞：${typeof koc.avgLikes === 'number' ? koc.avgLikes.toLocaleString() : '未填'}
- 近期平均评论：${typeof koc.avgComments === 'number' ? koc.avgComments.toLocaleString() : '未填'}
- 点赞率参考：${engagementRate}
- 评论率参考：${commentRate}（评论率 > 1% 通常代表互动健康；< 0.1% 警惕僵尸粉）
- 点赞/评论比：${likeToCommentRatio}（健康账号通常 5-30 之间，过高警惕买赞或评论冷淡）
- 粉丝主要性别：${koc.fanGender}
- 账号风格：${koc.style}${realBlock}

请严格按 JSON Schema 输出。`;

  return { system, user, hasRealContent };
}

function extractJson(text: string): unknown | null {
  if (!text) return null;
  // Direct parse
  try { return JSON.parse(text); } catch { /* noop */ }
  // Try ```json ... ``` fence
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced && fenced[1]) {
    try { return JSON.parse(fenced[1].trim()); } catch { /* noop */ }
  }
  // Try to grab first {...} block
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const slice = text.slice(first, last + 1);
    try { return JSON.parse(slice); } catch { /* noop */ }
  }
  return null;
}

function normalize(raw: unknown): DiagnoseResponse | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const score = Math.max(0, Math.min(100, Math.round(Number(r.score))));
  if (!Number.isFinite(score)) return null;

  const reasonsRaw = Array.isArray(r.reasons) ? r.reasons : [];
  const reasons = reasonsRaw.slice(0, 3).map((item) => {
    const it = (item ?? {}) as Record<string, unknown>;
    const type = it.type === 'con' ? 'con' : 'pro';
    const text = typeof it.text === 'string' ? it.text.trim() : '';
    return { type: type as 'pro' | 'con', text };
  }).filter((x) => x.text.length > 0);

  while (reasons.length < 3) {
    reasons.push({ type: 'pro', text: '喵医生暂未给出更多说明。' });
  }

  const dimsRaw = Array.isArray(r.dimensions) ? r.dimensions : [];
  const dimensions = dimsRaw.slice(0, 4).map((item) => {
    const it = (item ?? {}) as Record<string, unknown>;
    return {
      name: typeof it.name === 'string' ? it.name : '',
      score: Math.max(0, Math.min(100, Math.round(Number(it.score) || 0))),
      comment: typeof it.comment === 'string' ? it.comment.trim() : '',
    };
  }).filter((x) => x.name.length > 0);

  const suggestion = typeof r.suggestion === 'string' && r.suggestion.trim()
    ? r.suggestion.trim()
    : '建议先以小规模内容共创试水，再评估是否放大投放。';

  const basedOnRealContent =
    r.based_on_real_content === true ||
    (r as Record<string, unknown>).basedOnRealContent === true;

  return { score, reasons, suggestion, dimensions: dimensions.length ? dimensions : undefined, basedOnRealContent };
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return fail('INVALID_KEY', '服务端未配置 ARK_API_KEY 环境变量', 500);
  }

  let payload: DiagnoseRequest;
  try {
    payload = (await req.json()) as DiagnoseRequest;
  } catch {
    return fail('BAD_REQUEST', '请求体格式错误', 400);
  }

  if (!payload?.brand?.name?.trim() || !payload?.brand?.description?.trim()) {
    return fail('BAD_REQUEST', '品牌信息不完整', 400);
  }
  if (!payload?.koc?.name?.trim()) {
    return fail('BAD_REQUEST', 'KOC 信息不完整', 400);
  }

  const { system, user } = buildPrompt(payload);

  const callModel = async (modelId: string): Promise<Response> => {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.6,
        top_p: 0.9,
        max_tokens: 800,
      }),
    });
  };

  const tried: string[] = [];
  const candidates = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let upstream: Response | null = null;
  let lastErrText = '';
  let lastStatus = 0;

  for (const m of candidates) {
    tried.push(m);
    try {
      const r = await callModel(m);
      if (r.ok) {
        upstream = r;
        break;
      }
      lastStatus = r.status;
      lastErrText = await r.text().catch(() => '');
      // 401/403 不再尝试其它模型
      if (r.status === 401 || r.status === 403) {
        return fail('INVALID_KEY', `API Key 无效或权限不足：${lastErrText.slice(0, 200)}`, r.status);
      }
      // 429 立刻返回限流，不必再试
      if (r.status === 429) {
        return fail('RATE_LIMIT', '请求过于频繁，请稍后再试', 429);
      }
      // 404 / 400（模型不存在或无权访问）继续尝试下一个
    } catch (e) {
      lastErrText = e instanceof Error ? e.message : '网络错误';
    }
  }

  if (!upstream) {
    return fail(
      'UPSTREAM',
      `上游请求失败（HTTP ${lastStatus || 'NETWORK'}）。已尝试模型：${tried.join(', ')}。详情：${lastErrText.slice(0, 300)}`,
      502,
    );
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return fail('PARSE_ERROR', '上游响应解析失败', 502);
  }

  const content = (() => {
    const d = data as Record<string, unknown>;
    const choices = d?.choices as Array<Record<string, unknown>> | undefined;
    if (!choices || choices.length === 0) return '';
    const msg = choices[0]?.message as Record<string, unknown> | undefined;
    const c = msg?.content;
    return typeof c === 'string' ? c : '';
  })();

  const parsed = extractJson(content);
  const normalized = normalize(parsed);

  if (!normalized) {
    return fail('PARSE_ERROR', '喵医生今天写字有点乱，未能解析诊断结果。请稍后重试。', 502);
  }

  return NextResponse.json(normalized);
}
