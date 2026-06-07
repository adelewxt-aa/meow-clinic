export type AgeGroup = '18以下' | '18-24' | '25-30' | '30以上';
export type Gender = '女性为主' | '男性为主' | '均衡';
export type Niche = '美妆' | '生活' | '宠物' | '穿搭' | '美食' | '科技' | '其他';
export type AccountStyle = '种草测评' | '生活记录' | '专业干货' | '娱乐搞笑';

export interface BrandInfo {
  name: string;
  description: string;
  audienceAge: AgeGroup;
  audienceGender: Gender;
}

export interface KocInfo {
  name: string;
  followers: number | '';
  niche: Niche;
  avgLikes: number | '';
  avgComments: number | '';
  fanGender: Gender;
  style: AccountStyle;
  // 深度素材（可选）：让诊断从"凭经验推理"升级为"基于真实内容分析"
  homepageUrl?: string;
  recentPosts?: string;
}

export interface DiagnoseRequest {
  brand: BrandInfo;
  koc: Omit<KocInfo, 'followers' | 'avgLikes' | 'avgComments'> & {
    followers: number;
    avgLikes: number;
    avgComments: number;
  };
}

export interface DiagnoseReason {
  type: 'pro' | 'con';
  text: string;
}

export interface DiagnoseDimension {
  name: string;
  score: number;
  comment: string;
}

export interface DiagnoseResponse {
  score: number;
  reasons: DiagnoseReason[];
  suggestion: string;
  dimensions?: DiagnoseDimension[];
  basedOnRealContent?: boolean;
}

export type ErrorCode =
  | 'INVALID_KEY'
  | 'RATE_LIMIT'
  | 'BAD_REQUEST'
  | 'UPSTREAM'
  | 'PARSE_ERROR'
  | 'UNKNOWN';

export interface DiagnoseErrorResponse {
  error: string;
  code: ErrorCode;
}

export const AGE_GROUPS: AgeGroup[] = ['18以下', '18-24', '25-30', '30以上'];
export const GENDERS: Gender[] = ['女性为主', '男性为主', '均衡'];
export const NICHES: Niche[] = ['美妆', '生活', '宠物', '穿搭', '美食', '科技', '其他'];
export const ACCOUNT_STYLES: AccountStyle[] = ['种草测评', '生活记录', '专业干货', '娱乐搞笑'];

export function scoreToEmoji(score: number): string {
  if (score >= 80) return '😺';
  if (score >= 60) return '😸';
  if (score >= 40) return '😼';
  if (score >= 20) return '😹';
  return '😿';
}

export function scoreToVibe(score: number): string {
  if (score >= 80) return '极佳匹配';
  if (score >= 60) return '良好匹配';
  if (score >= 40) return '中性匹配';
  if (score >= 20) return '匹配较弱';
  return '不建议合作';
}
