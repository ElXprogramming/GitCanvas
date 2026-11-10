import { StatGrade } from '@/types/stats';
import {
  ONE_PIECE_MASCOTS,
  OnePieceMascot,
  getOnePieceMascot,
} from './onepiece-stickers';

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
  mascot?: OnePieceMascot;
  category?: 'showcase' | 'normal' | 'on_hold';
  onHold?: boolean;
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
    category: 'normal',
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
    category: 'normal',
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
    category: 'normal',
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
    category: 'normal',
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
    category: 'normal',
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
    category: 'normal',
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
    category: 'normal',
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
    category: 'normal',
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
    label: 'Straw Hat Luffy (Pixel Art)',
    category: 'on_hold',
    onHold: true,
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
    mascot: ONE_PIECE_MASCOTS.luffy,
  },
  gear_5_nika: {
    id: 'gear_5_nika',
    label: 'Sun God Nika (Gear 5)',
    category: 'on_hold',
    onHold: true,
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
    mascot: ONE_PIECE_MASCOTS.luffy,
  },
  wano_zoro: {
    id: 'wano_zoro',
    label: 'Wano Zoro (Lost in Wano)',
    category: 'showcase',
    cardBg: '#071811',
    cardBgGradientEnd: '#030c08',
    border: '#10b981',
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
    mascot: ONE_PIECE_MASCOTS.zoro,
  },
  onepiece_gatling: {
    id: 'onepiece_gatling',
    label: 'Luffy Gatling (Animated GIF)',
    category: 'showcase',
    cardBg: '#0b132b',
    cardBgGradientEnd: '#070c1d',
    border: 'transparent',
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
    mascot: ONE_PIECE_MASCOTS.luffy_gatling,
  },
  onepiece_straw_hat: {
    id: 'onepiece_straw_hat',
    label: 'Flapping Straw Hat (Pixel Art)',
    category: 'on_hold',
    onHold: true,
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
    mascot: ONE_PIECE_MASCOTS.straw_hat,
  },
  onepiece_chopper: {
    id: 'onepiece_chopper',
    label: 'Chopper (Pixel Art)',
    category: 'on_hold',
    onHold: true,
    cardBg: '#131124',
    cardBgGradientEnd: '#090812',
    border: '#ff6b8b',
    borderRadius: 14,
    textPrimary: '#fff5f7',
    textSecondary: '#f472b6',
    accent: '#38bdf8',
    gradeColors: {
      S: { text: '#ff6b8b', bg: 'rgba(255, 107, 139, 0.18)', border: '#ff6b8b' },
      A: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.18)', border: '#38bdf8' },
      B: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.18)', border: '#f59e0b' },
      C: { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.18)', border: '#a855f7' },
      D: { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#64748b' },
    },
    heatmapLevels: ['#1e1430', '#500724', '#9d174d', '#f43f5e', '#38bdf8'],
    mascot: ONE_PIECE_MASCOTS.chopper,
  },
  onepiece_ace: {
    id: 'onepiece_ace',
    label: 'Fire Fist Ace (Pixel Art)',
    category: 'on_hold',
    onHold: true,
    cardBg: '#180e0a',
    cardBgGradientEnd: '#0c0604',
    border: '#f97316',
    borderRadius: 14,
    textPrimary: '#fff7ed',
    textSecondary: '#fdba74',
    accent: '#ef4444',
    gradeColors: {
      S: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444' },
      A: { text: '#f97316', bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316' },
      B: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24' },
      C: { text: '#ea580c', bg: 'rgba(234, 88, 12, 0.2)', border: '#ea580c' },
      D: { text: '#78716c', bg: 'rgba(120, 113, 108, 0.14)', border: '#57534e' },
    },
    heatmapLevels: ['#291811', '#5c1d06', '#9a3412', '#ea580c', '#fde047'],
    mascot: ONE_PIECE_MASCOTS.ace,
  },
  onepiece_law: {
    id: 'onepiece_law',
    label: 'Trafalgar Law (Pixel Art)',
    category: 'on_hold',
    onHold: true,
    cardBg: '#0d131f',
    cardBgGradientEnd: '#060910',
    border: '#eab308',
    borderRadius: 14,
    textPrimary: '#fefce8',
    textSecondary: '#fde047',
    accent: '#06b6d4',
    gradeColors: {
      S: { text: '#facc15', bg: 'rgba(250, 204, 21, 0.18)', border: '#facc15' },
      A: { text: '#06b6d4', bg: 'rgba(6, 182, 212, 0.18)', border: '#06b6d4' },
      B: { text: '#818cf8', bg: 'rgba(129, 140, 248, 0.18)', border: '#818cf8' },
      C: { text: '#f97316', bg: 'rgba(249, 115, 22, 0.18)', border: '#f97316' },
      D: { text: '#64748b', bg: 'rgba(100, 116, 139, 0.14)', border: '#475569' },
    },
    heatmapLevels: ['#182030', '#164e63', '#0891b2', '#eab308', '#fef08a'],
    mascot: ONE_PIECE_MASCOTS.law,
  },
  onepiece_sanji: {
    id: 'onepiece_sanji',
    label: 'Black Leg Sanji (Pixel Art)',
    category: 'on_hold',
    onHold: true,
    cardBg: '#091528',
    cardBgGradientEnd: '#040b17',
    border: '#0284c7',
    borderRadius: 14,
    textPrimary: '#f0f9ff',
    textSecondary: '#7dd3fc',
    accent: '#f43f5e',
    gradeColors: {
      S: { text: '#f43f5e', bg: 'rgba(244, 63, 94, 0.2)', border: '#f43f5e' },
      A: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)', border: '#38bdf8' },
      B: { text: '#facc15', bg: 'rgba(250, 204, 21, 0.2)', border: '#facc15' },
      C: { text: '#fb923c', bg: 'rgba(251, 146, 60, 0.2)', border: '#fb923c' },
      D: { text: '#64748b', bg: 'rgba(100, 116, 139, 0.14)', border: '#475569' },
    },
    heatmapLevels: ['#102240', '#0369a1', '#0284c7', '#38bdf8', '#fb7185'],
    mascot: ONE_PIECE_MASCOTS.sanji,
  },
  onepiece_brook: {
    id: 'onepiece_brook',
    label: 'Soul King Brook (Pixel Art)',
    category: 'on_hold',
    onHold: true,
    cardBg: '#0c0a17',
    cardBgGradientEnd: '#06050d',
    border: '#a855f7',
    borderRadius: 14,
    textPrimary: '#faf5ff',
    textSecondary: '#d8b4fe',
    accent: '#34d399',
    gradeColors: {
      S: { text: '#34d399', bg: 'rgba(52, 211, 153, 0.2)', border: '#34d399' },
      A: { text: '#c084fc', bg: 'rgba(192, 132, 252, 0.2)', border: '#c084fc' },
      B: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)', border: '#38bdf8' },
      C: { text: '#f472b6', bg: 'rgba(244, 114, 182, 0.2)', border: '#f472b6' },
      D: { text: '#6b7280', bg: 'rgba(107, 114, 128, 0.14)', border: '#4b5563' },
    },
    heatmapLevels: ['#1c1430', '#581c87', '#7e22ce', '#34d399', '#a7f3d0'],
    mascot: ONE_PIECE_MASCOTS.brook,
  },
  onepiece_nami: {
    id: 'onepiece_nami',
    label: 'Cat Burglar Nami (Pixel Art)',
    category: 'on_hold',
    onHold: true,
    cardBg: '#081c24',
    cardBgGradientEnd: '#040e12',
    border: '#f97316',
    borderRadius: 14,
    textPrimary: '#f0fdfa',
    textSecondary: '#fdba74',
    accent: '#06b6d4',
    gradeColors: {
      S: { text: '#f97316', bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316' },
      A: { text: '#06b6d4', bg: 'rgba(6, 182, 212, 0.2)', border: '#06b6d4' },
      B: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24' },
      C: { text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)', border: '#38bdf8' },
      D: { text: '#64748b', bg: 'rgba(100, 116, 139, 0.14)', border: '#475569' },
    },
    heatmapLevels: ['#132b35', '#0e7490', '#06b6d4', '#f97316', '#fde047'],
    mascot: ONE_PIECE_MASCOTS.nami,
  },
  bounty_poster: {
    id: 'bounty_poster',
    label: 'Grand Line Bounty',
    category: 'on_hold',
    onHold: true,
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
    mascot: ONE_PIECE_MASCOTS.chopper_giant,
  },
};

export const NORMAL_THEMES: DesignTheme[] = [
  DESIGN_THEMES.default,
  DESIGN_THEMES.catppuccin_mocha,
  DESIGN_THEMES.tokyonight,
  DESIGN_THEMES.dracula,
  DESIGN_THEMES.nord,
  DESIGN_THEMES.github_dark,
  DESIGN_THEMES.radical,
  DESIGN_THEMES.sunset,
];

export const SHOWCASE_THEMES: DesignTheme[] = [
  DESIGN_THEMES.onepiece_gatling,
  DESIGN_THEMES.wano_zoro,
];

export const ON_HOLD_THEMES: DesignTheme[] = [
  DESIGN_THEMES.straw_hat,
  DESIGN_THEMES.gear_5_nika,
  DESIGN_THEMES.onepiece_straw_hat,
  DESIGN_THEMES.onepiece_chopper,
  DESIGN_THEMES.onepiece_ace,
  DESIGN_THEMES.onepiece_law,
  DESIGN_THEMES.onepiece_sanji,
  DESIGN_THEMES.onepiece_brook,
  DESIGN_THEMES.onepiece_nami,
  DESIGN_THEMES.bounty_poster,
];

export function getDesignTheme(
  themeId?: string | null,
  mascotId?: string | null
): DesignTheme {
  const key = (themeId || 'default').toLowerCase().trim();
  let baseTheme: DesignTheme;

  if (key === 'dark') {
    baseTheme = DESIGN_THEMES.github_dark;
  } else if (
    key === 'chopper' ||
    key === 'tony_tony_chopper' ||
    key === 'cotton_candy'
  ) {
    baseTheme = DESIGN_THEMES.onepiece_chopper;
  } else if (
    key === 'gatling' ||
    key === 'luffy_gatling' ||
    key === 'onepiece_gatling' ||
    key === 'gomu_gomu' ||
    key === 'punch'
  ) {
    baseTheme = DESIGN_THEMES.onepiece_gatling;
  } else if (
    key === 'onepiece_straw_hat' ||
    key === 'straw_hat_flapping' ||
    key === 'flapping_hat' ||
    key === 'flapping_straw_hat' ||
    key === 'hat'
  ) {
    baseTheme = DESIGN_THEMES.onepiece_straw_hat;
  } else if (
    key === 'onepiece' ||
    key === 'one_piece' ||
    key === 'luffy' ||
    key === 'strawhat' ||
    key === 'straw_hat' ||
    key === 'mugiwara'
  ) {
    baseTheme = DESIGN_THEMES.straw_hat;
  } else if (key === 'nika' || key === 'gear5' || key === 'gear_5') {
    baseTheme = DESIGN_THEMES.gear_5_nika;
  } else if (
    key === 'zoro' ||
    key === 'santoryu' ||
    key === 'wano' ||
    key === 'wano_zoro' ||
    key === 'lost_zoro' ||
    key === 'onepiece_zoro'
  ) {
    baseTheme = DESIGN_THEMES.wano_zoro;
  } else if (key === 'ace' || key === 'fire_fist' || key === 'portgas') {
    baseTheme = DESIGN_THEMES.onepiece_ace;
  } else if (key === 'law' || key === 'heart_pirates' || key === 'trafalgar') {
    baseTheme = DESIGN_THEMES.onepiece_law;
  } else if (key === 'sanji' || key === 'all_blue' || key === 'black_leg') {
    baseTheme = DESIGN_THEMES.onepiece_sanji;
  } else if (key === 'brook' || key === 'soul_king') {
    baseTheme = DESIGN_THEMES.onepiece_brook;
  } else if (key === 'nami' || key === 'cat_burglar') {
    baseTheme = DESIGN_THEMES.onepiece_nami;
  } else if (key === 'bounty') {
    baseTheme = DESIGN_THEMES.bounty_poster;
  } else {
    baseTheme = DESIGN_THEMES[key] || DESIGN_THEMES.default;
  }

  // If a specific mascot override is requested
  if (mascotId) {
    const override = getOnePieceMascot(mascotId);
    if (override) {
      return { ...baseTheme, mascot: override };
    }
  }

  return baseTheme;
}
