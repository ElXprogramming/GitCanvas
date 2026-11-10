export interface DesignFont {
  id: string;
  label: string;
  category:
    | 'Clean Sans'
    | 'Modern Sans'
    | 'Humanist Sans'
    | 'Geometric Sans'
    | 'Accessibility Sans'
    | 'Screen Serif'
    | 'Contemporary Serif'
    | 'Developer Mono'
    | 'Vintage Slab';
  badge: string;
  description: string;
  googleFontFamily: string;
  fontFamily: string;
  importUrl: string;
  svgImportUrl: string;
}

/**
 * 10 Top-Rated Easy-on-the-Eyes Fonts for Website Development & Digital Typography
 * Plus Josefin Slab for backwards compatibility.
 */
export const DESIGN_FONTS: Record<string, DesignFont> = {
  inter: {
    id: 'inter',
    label: 'Inter',
    category: 'Modern Sans',
    badge: '#1 UI Standard',
    description:
      'Engineered specifically for computer screens with tall x-height & effortless readability.',
    googleFontFamily: 'Inter',
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap',
  },
  roboto: {
    id: 'roboto',
    label: 'Roboto',
    category: 'Clean Sans',
    badge: 'Google Flagship',
    description:
      'Dual-nature neo-grotesque skeleton with friendly open curves that flow effortlessly.',
    googleFontFamily: 'Roboto',
    fontFamily: `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&amp;display=swap',
  },
  open_sans: {
    id: 'open_sans',
    label: 'Open Sans',
    category: 'Humanist Sans',
    badge: 'Ultra Readable',
    description:
      'Neutral, wide vertical letterforms with open counters designed to reduce eye strain.',
    googleFontFamily: 'Open Sans',
    fontFamily: `'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&amp;display=swap',
  },
  lato: {
    id: 'lato',
    label: 'Lato',
    category: 'Humanist Sans',
    badge: 'Warm & Balanced',
    description:
      'Harmonious proportions and warm semi-rounded details that ease long-term reading.',
    googleFontFamily: 'Lato',
    fontFamily: `'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&amp;display=swap',
  },
  plus_jakarta_sans: {
    id: 'plus_jakarta_sans',
    label: 'Plus Jakarta Sans',
    category: 'Geometric Sans',
    badge: 'Airy & Modern',
    description:
      'Modern geometric proportions and generous spacing that keep text blocks feeling airy.',
    googleFontFamily: 'Plus Jakarta Sans',
    fontFamily: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap',
  },
  dm_sans: {
    id: 'dm_sans',
    label: 'DM Sans',
    category: 'Geometric Sans',
    badge: 'Crisp Precision',
    description:
      'Low-contrast geometric shapes engineered to look crystal clear on high-density displays.',
    googleFontFamily: 'DM Sans',
    fontFamily: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&amp;display=swap',
  },
  lexend: {
    id: 'lexend',
    label: 'Lexend',
    category: 'Accessibility Sans',
    badge: 'Dyslexia & Low Strain',
    description:
      'Scientifically engineered to reduce visual stress and significantly improve reading speed.',
    googleFontFamily: 'Lexend',
    fontFamily: `'Lexend', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&amp;display=swap',
  },
  merriweather: {
    id: 'merriweather',
    label: 'Merriweather',
    category: 'Screen Serif',
    badge: 'Editorial Screen',
    description:
      'Sturdy screen-first serif with mild squarish curves, gentle and calming for prolonged focus.',
    googleFontFamily: 'Merriweather',
    fontFamily: `'Merriweather', Georgia, 'Times New Roman', serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&amp;display=swap',
  },
  lora: {
    id: 'lora',
    label: 'Lora',
    category: 'Contemporary Serif',
    badge: 'Calligraphic Flow',
    description:
      'Brushed curves and fluid transitional serifs that guide the eyes smoothly across lines.',
    googleFontFamily: 'Lora',
    fontFamily: `'Lora', Georgia, 'Times New Roman', serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&amp;display=swap',
  },
  fira_code: {
    id: 'fira_code',
    label: 'Fira Code',
    category: 'Developer Mono',
    badge: 'Developer Monospace',
    description:
      'Top-rated monospaced font with distinct character forms, high contrast, and zero ambiguity.',
    googleFontFamily: 'Fira Code',
    fontFamily: `'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&amp;display=swap',
  },
  josefin_slab: {
    id: 'josefin_slab',
    label: 'Josefin Slab',
    category: 'Vintage Slab',
    badge: 'Classic Default',
    description:
      'Scandinavian geometric slab serif with vintage 1930s character and distinctive lines.',
    googleFontFamily: 'Josefin Slab',
    fontFamily: `'Josefin Slab', Georgia, serif, sans-serif`,
    importUrl:
      'https://fonts.googleapis.com/css2?family=Josefin+Slab:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap',
    svgImportUrl:
      'https://fonts.googleapis.com/css2?family=Josefin+Slab:ital,wght@0,400;0,600;0,700;0,800;1,400&amp;display=swap',
  },
};

/**
 * Normalizes input font string and retrieves corresponding DesignFont configuration.
 * Defaults to 'josefin_slab'.
 */
export function getDesignFont(fontId?: string | null): DesignFont {
  if (!fontId) return DESIGN_FONTS.josefin_slab;
  const key = fontId.toLowerCase().trim().replace(/[-\s]+/g, '_');

  // Support common aliases
  if (key === 'opensans' || key === 'open') return DESIGN_FONTS.open_sans;
  if (key === 'plus_jakarta' || key === 'jakarta') return DESIGN_FONTS.plus_jakarta_sans;
  if (key === 'dmsans' || key === 'dm') return DESIGN_FONTS.dm_sans;
  if (key === 'firacode' || key === 'fira' || key === 'mono') return DESIGN_FONTS.fira_code;
  if (key === 'josefin' || key === 'josefinslab') return DESIGN_FONTS.josefin_slab;

  return DESIGN_FONTS[key] || DESIGN_FONTS.josefin_slab;
}

/**
 * Generates the valid CSS @import rule for SVG documents.
 * Ensures the Google Fonts URL is properly escaped with &amp; and wrapped in @import url('...').
 */
export function getSvgFontImport(font?: DesignFont | null): string {
  const targetFont = font || DESIGN_FONTS.josefin_slab;
  const url = targetFont.svgImportUrl || targetFont.importUrl;
  if (!url) return '';
  if (url.startsWith('@import')) return url;
  return `@import url('${url}');`;
}
