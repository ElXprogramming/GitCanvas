import { StatGrade } from '@/types/stats';

export interface DesignTheme {
  id: string;
  label: string;
  cardBg: string;
  cardBgGradientEnd: string;
  border: string;
  borderRadius: number;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  gradeColors: Record<StatGrade, { text: string; bg: string; border: string }>;
  heatmapLevels: [string, string, string, string, string]; // 0 (empty) to 4 (most active)
}

const DEFAULT_GRADE_COLORS: Record<
  StatGrade,
  { text: string; bg: string; border: string }
> = {
  S: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.14)', border: '#10b981' },
  A: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)', border: '#38bdf8' },
  B: { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.14)', border: '#a855f7' },
  C: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)', border: '#f59e0b' },
  D: { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#64748b' },
};

export const DESIGN_THEMES: Record<string, DesignTheme> = {
  default: {
    id: 'default',
    label: 'Default Dark',
    cardBg: '#111622',
    cardBgGradientEnd: '#0d111a',
    border: '#262f45',
    borderRadius: 14,
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#ef4444',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#1e2638', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  catppuccin_mocha: {
    id: 'catppuccin_mocha',
    label: 'Catppuccin Mocha',
    cardBg: '#1e1e2e',
    cardBgGradientEnd: '#181825',
    border: '#313244',
    borderRadius: 14,
    textPrimary: '#cdd6f4',
    textSecondary: '#a6adc8',
    accent: '#f38ba8',
    gradeColors: {
      S: { text: '#a6e3a1', bg: 'rgba(166, 227, 161, 0.15)', border: '#a6e3a1' },
      A: { text: '#89b4fa', bg: 'rgba(137, 180, 250, 0.15)', border: '#89b4fa' },
      B: { text: '#cba6f7', bg: 'rgba(203, 166, 247, 0.15)', border: '#cba6f7' },
      C: { text: '#f9e2af', bg: 'rgba(249, 226, 175, 0.15)', border: '#f9e2af' },
      D: { text: '#9399b2', bg: 'rgba(147, 153, 178, 0.15)', border: '#7f849c' },
    },
    heatmapLevels: ['#313244', '#45475a', '#74c7ec', '#89b4fa', '#cba6f7'],
  },
  tokyonight: {
    id: 'tokyonight',
    label: 'Tokyo Night',
    cardBg: '#1a1b26',
    cardBgGradientEnd: '#16161e',
    border: '#292e42',
    borderRadius: 14,
    textPrimary: '#c0caf5',
    textSecondary: '#7aa2f7',
    accent: '#f7768e',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#24283b', '#1f3a5f', '#2b5b84', '#3d85c6', '#7aa2f7'],
  },
  dracula: {
    id: 'dracula',
    label: 'Dracula',
    cardBg: '#282a36',
    cardBgGradientEnd: '#21222c',
    border: '#44475a',
    borderRadius: 14,
    textPrimary: '#f8f8f2',
    textSecondary: '#bd93f9',
    accent: '#ff5555',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#343746', '#44475a', '#6272a4', '#bd93f9', '#ff79c6'],
  },
  nord: {
    id: 'nord',
    label: 'Nord',
    cardBg: '#2e3440',
    cardBgGradientEnd: '#242933',
    border: '#3b4252',
    borderRadius: 14,
    textPrimary: '#eceff4',
    textSecondary: '#88c0d0',
    accent: '#bf616a',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#3b4252', '#4c566a', '#5e81ac', '#81a1c1', '#88c0d0'],
  },
  github_dark: {
    id: 'github_dark',
    label: 'GitHub Dark',
    cardBg: '#0d1117',
    cardBgGradientEnd: '#010409',
    border: '#30363d',
    borderRadius: 14,
    textPrimary: '#e6edf3',
    textSecondary: '#8b949e',
    accent: '#f85149',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  radical: {
    id: 'radical',
    label: 'Radical',
    cardBg: '#141321',
    cardBgGradientEnd: '#0a0914',
    border: '#2a2744',
    borderRadius: 14,
    textPrimary: '#a9fef7',
    textSecondary: '#fe428e',
    accent: '#f8d847',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#221f3b', '#522258', '#8c3061', '#c63c51', '#fe428e'],
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    cardBg: '#1f132b',
    cardBgGradientEnd: '#140c1c',
    border: '#3c2554',
    borderRadius: 14,
    textPrimary: '#fae3d9',
    textSecondary: '#ff7e67',
    accent: '#ff2a7a',
    gradeColors: DEFAULT_GRADE_COLORS,
    heatmapLevels: ['#2c1b3d', '#5c2a5d', '#943764', '#cc4964', '#ff7e67'],
  },
  straw_hat: {
    id: 'straw_hat',
    label: 'Straw Hat (Mugiwara)',
    cardBg: '#0b132b',
    cardBgGradientEnd: '#070c1d',
    border: '#d97706',
    borderRadius: 14,
    textPrimary: '#f8fafc',
    textSecondary: '#fcd34d',
    accent: '#ef4444',
    gradeColors: {
      S: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.16)', border: '#ef4444' },
      A: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.16)', border: '#fbbf24' },
      B: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.16)', border: '#38bdf8' },
      C: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', border: '#10b981' },
      D: { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#64748b' },
    },
    heatmapLevels: ['#162038', '#1e3a8a', '#d97706', '#f59e0b', '#ef4444'],
  },
  gear_5_nika: {
    id: 'gear_5_nika',
    label: 'Sun God Nika (Gear 5)',
    cardBg: '#13141f',
    cardBgGradientEnd: '#0b0c13',
    border: '#cbd5e1',
    borderRadius: 16,
    textPrimary: '#ffffff',
    textSecondary: '#fde047',
    accent: '#f59e0b',
    gradeColors: {
      S: { text: '#fde047', bg: 'rgba(253, 224, 71, 0.18)', border: '#fde047' },
      A: { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.18)', border: '#a855f7' },
      B: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)', border: '#38bdf8' },
      C: { text: '#fb923c', bg: 'rgba(251, 146, 60, 0.18)', border: '#fb923c' },
      D: { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#64748b' },
    },
    heatmapLevels: ['#1e1f30', '#6366f1', '#a855f7', '#fbbf24', '#fef08a'],
  },
  wano_zoro: {
    id: 'wano_zoro',
    label: 'Wano Ronin (Zoro)',
    cardBg: '#071811',
    cardBgGradientEnd: '#030c08',
    border: '#7c3aed',
    borderRadius: 12,
    textPrimary: '#f0fdf4',
    textSecondary: '#4ade80',
    accent: '#a855f7',
    gradeColors: {
      S: { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7' },
      A: { text: '#34d399', bg: 'rgba(52, 211, 153, 0.2)', border: '#34d399' },
      B: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)', border: '#38bdf8' },
      C: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24' },
      D: { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#64748b' },
    },
    heatmapLevels: ['#0f291e', '#065f46', '#059669', '#10b981', '#a855f7'],
  },
  bounty_poster: {
    id: 'bounty_poster',
    label: 'Grand Line Bounty',
    cardBg: '#1c1512',
    cardBgGradientEnd: '#110c09',
    border: '#78350f',
    borderRadius: 12,
    textPrimary: '#fef3c7',
    textSecondary: '#d97706',
    accent: '#dc2626',
    gradeColors: {
      S: { text: '#dc2626', bg: 'rgba(220, 38, 38, 0.18)', border: '#dc2626' },
      A: { text: '#d97706', bg: 'rgba(217, 119, 6, 0.18)', border: '#d97706' },
      B: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.18)', border: '#f59e0b' },
      C: { text: '#ca8a04', bg: 'rgba(202, 138, 4, 0.18)', border: '#ca8a04' },
      D: { text: '#78716c', bg: 'rgba(120, 113, 108, 0.14)', border: '#57534e' },
    },
    heatmapLevels: ['#291e17', '#451a03', '#78350f', '#b45309', '#f59e0b'],
  },
};

export function getDesignTheme(themeId?: string | null): DesignTheme {
  const key = (themeId || 'default').toLowerCase().trim();
  if (key === 'dark') return DESIGN_THEMES.github_dark;
  if (key === 'onepiece' || key === 'one_piece' || key === 'luffy') return DESIGN_THEMES.straw_hat;
  if (key === 'nika' || key === 'gear5' || key === 'gear_5') return DESIGN_THEMES.gear_5_nika;
  if (key === 'zoro') return DESIGN_THEMES.wano_zoro;
  if (key === 'bounty') return DESIGN_THEMES.bounty_poster;
  return DESIGN_THEMES[key] || DESIGN_THEMES.default;
}
