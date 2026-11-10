import {
  ProfileItemData,
  PinnedProjectItem,
  LanguagesItemData,
  GradedMetricItemData,
  OverallItemData,
  StreakMetricItemData,
  ContributionsItemData,
  FullCanvasData,
  FullCanvasRenderOptions,
} from '@/types/stats';
import { getDesignTheme } from './themes';
import { getDesignFont, getSvgFontImport } from './fonts';
import { OnePieceMascot, STRAW_HAT_FRAMES } from './onepiece-stickers';

const XML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
const XML_ESCAPE_REGEX = /[&<>"']/g;

export function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe.replace(XML_ESCAPE_REGEX, (m) => XML_ESCAPE_MAP[m] || m);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

export function wrapTextTwoLines(
  rawText: string,
  maxLine1 = 34,
  maxLine2 = 34
): [string, string] {
  const clean = rawText.trim().replace(/\s+/g, ' ');
  if (clean.length <= maxLine1) {
    return [clean, ''];
  }

  // Find last space at or before maxLine1 so we never split a word in half
  const slice1 = clean.slice(0, maxLine1 + 1);
  const lastSpace = slice1.lastIndexOf(' ');

  let line1 = '';
  let remainder = '';

  if (lastSpace > 16) {
    line1 = clean.slice(0, lastSpace).trimEnd();
    remainder = clean.slice(lastSpace + 1).trimStart();
  } else {
    line1 = clean.slice(0, maxLine1).trimEnd();
    remainder = clean.slice(maxLine1).trimStart();
  }

  const line2 = remainder ? truncateText(remainder, maxLine2) : '';
  return [line1, line2];
}

export function isFloatingHatTheme(
  themeId?: string | null,
  mascotId?: string | null
): boolean {
  const t = (themeId || '').toLowerCase().trim();
  const m = (mascotId || '').toLowerCase().trim();
  return (
    t === 'onepiece_gatling' ||
    t === 'gatling' ||
    t === 'luffy_gatling' ||
    t === 'onepiece_straw_hat' ||
    t === 'straw_hat_flapping' ||
    t === 'flapping_hat' ||
    t === 'flapping_straw_hat' ||
    m === 'luffy_gatling' ||
    m === 'gatling' ||
    m === 'straw_hat' ||
    m === 'straw_hat_flapping' ||
    m === 'flapping_hat' ||
    m === 'flapping_straw_hat' ||
    m === 'hat'
  );
}

export function getMascotAnimationStyles(
  mascot?: OnePieceMascot | null,
  themeId?: string | null
): string {
  const hasGatling =
    mascot?.id === 'luffy_gatling' ||
    themeId === 'onepiece_gatling' ||
    themeId === 'gatling' ||
    (mascot?.frames && mascot.frames.length > 1 && mascot.id !== 'straw_hat');

  const hasStrawHat =
    mascot?.id === 'straw_hat' ||
    isFloatingHatTheme(themeId, mascot?.id);

  if (!hasGatling && !hasStrawHat && (!mascot?.frames || mascot.frames.length <= 1)) {
    return '';
  }

  const gatlingStyles = hasGatling
    ? `
      @keyframes gatlingF0 { 0%, 25% { opacity: 1; } 25.01%, 100% { opacity: 0; } }
      @keyframes gatlingF1 { 0%, 24.99% { opacity: 0; } 25%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
      @keyframes gatlingF2 { 0%, 49.99% { opacity: 0; } 50%, 75% { opacity: 1; } 75.01%, 100% { opacity: 0; } }
      @keyframes gatlingF3 { 0%, 74.99% { opacity: 0; } 75%, 100% { opacity: 1; } }
      .gatling-f0 { animation: gatlingF0 0.44s steps(1) infinite; }
      .gatling-f1 { animation: gatlingF1 0.44s steps(1) infinite; }
      .gatling-f2 { animation: gatlingF2 0.44s steps(1) infinite; }
      .gatling-f3 { animation: gatlingF3 0.44s steps(1) infinite; }`
    : '';

  const strawHatStyles = hasStrawHat
    ? `
      @keyframes hatFlap0 { 0%, 25% { opacity: 1; } 25.01%, 100% { opacity: 0; } }
      @keyframes hatFlap1 { 0%, 24.99% { opacity: 0; } 25%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
      @keyframes hatFlap2 { 0%, 49.99% { opacity: 0; } 50%, 75% { opacity: 1; } 75.01%, 100% { opacity: 0; } }
      @keyframes hatFlap3 { 0%, 74.99% { opacity: 0; } 75%, 100% { opacity: 1; } }
      .hat-f0 { animation: hatFlap0 0.52s steps(1) infinite; }
      .hat-f1 { animation: hatFlap1 0.52s steps(1) infinite; }
      .hat-f2 { animation: hatFlap2 0.52s steps(1) infinite; }
      .hat-f3 { animation: hatFlap3 0.52s steps(1) infinite; }
      @keyframes windRoamCanvas1 {
        0%   { transform: translate(50px, 50px) rotate(-8deg); }
        18%  { transform: translate(380px, 160px) rotate(14deg); }
        35%  { transform: translate(730px, 80px) rotate(-12deg); }
        52%  { transform: translate(540px, 380px) rotate(16deg); }
        70%  { transform: translate(160px, 320px) rotate(-15deg); }
        86%  { transform: translate(420px, 180px) rotate(8deg); }
        100% { transform: translate(50px, 50px) rotate(-8deg); }
      }
      @keyframes windRoamCanvas2 {
        0%   { transform: translate(700px, 480px) rotate(10deg); }
        20%  { transform: translate(360px, 620px) rotate(-12deg); }
        40%  { transform: translate(80px, 500px) rotate(14deg); }
        60%  { transform: translate(280px, 720px) rotate(-10deg); }
        80%  { transform: translate(660px, 660px) rotate(12deg); }
        100% { transform: translate(700px, 480px) rotate(10deg); }
      }
      @keyframes windRoamCanvas3 {
        0%   { transform: translate(120px, 720px) rotate(-16deg); }
        22%  { transform: translate(460px, 440px) rotate(18deg); }
        45%  { transform: translate(740px, 240px) rotate(-14deg); }
        68%  { transform: translate(340px, 80px) rotate(12deg); }
        85%  { transform: translate(60px, 340px) rotate(-10deg); }
        100% { transform: translate(120px, 720px) rotate(-16deg); }
      }
      @keyframes windRoamOverall {
        0%   { transform: translate(14px, 16px) rotate(-6deg); }
        22%  { transform: translate(95px, 68px) rotate(12deg); }
        45%  { transform: translate(192px, 18px) rotate(-8deg); }
        68%  { transform: translate(135px, 42px) rotate(10deg); }
        84%  { transform: translate(45px, 66px) rotate(-12deg); }
        100% { transform: translate(14px, 16px) rotate(-6deg); }
      }
      @keyframes windRoamProfile800 {
        0%   { transform: translate(105px, 14px) rotate(-6deg); }
        25%  { transform: translate(340px, 65px) rotate(14deg); }
        50%  { transform: translate(690px, 16px) rotate(-10deg); }
        75%  { transform: translate(490px, 62px) rotate(12deg); }
        100% { transform: translate(105px, 14px) rotate(-6deg); }
      }
      @keyframes windRoamProfile420 {
        0%   { transform: translate(105px, 14px) rotate(-6deg); }
        25%  { transform: translate(200px, 65px) rotate(14deg); }
        50%  { transform: translate(315px, 16px) rotate(-10deg); }
        75%  { transform: translate(220px, 62px) rotate(12deg); }
        100% { transform: translate(105px, 14px) rotate(-6deg); }
      }
      @keyframes windRoamContrib {
        0%   { transform: translate(35px, 18px) rotate(-8deg); }
        20%  { transform: translate(240px, 115px) rotate(14deg); }
        40%  { transform: translate(480px, 22px) rotate(-10deg); }
        60%  { transform: translate(710px, 110px) rotate(12deg); }
        80%  { transform: translate(360px, 125px) rotate(-14deg); }
        100% { transform: translate(35px, 18px) rotate(-8deg); }
      }
      @keyframes windFloatAmbient {
        0% { transform: translate(0px, 0px) rotate(-5deg); }
        25% { transform: translate(14px, -7px) rotate(5deg); }
        50% { transform: translate(28px, 1px) rotate(-3deg); }
        75% { transform: translate(12px, 7px) rotate(6deg); }
        100% { transform: translate(0px, 0px) rotate(-5deg); }
      }
      @keyframes windDriftAcross {
        0% { transform: translate(0px, 0px) rotate(-6deg); }
        35% { transform: translate(35px, -12px) rotate(7deg); }
        70% { transform: translate(70px, 5px) rotate(-4deg); }
        100% { transform: translate(0px, 0px) rotate(-6deg); }
      }
      @keyframes windGustSweep {
        0% { opacity: 0.12; stroke-dashoffset: 40; }
        50% { opacity: 0.35; }
        100% { opacity: 0.12; stroke-dashoffset: -40; }
      }
      .wind-hat-roam-canvas-1 { animation: windRoamCanvas1 22s ease-in-out infinite; transform-origin: 24px 13px; }
      .wind-hat-roam-canvas-2 { animation: windRoamCanvas2 26s ease-in-out infinite; transform-origin: 20px 11px; }
      .wind-hat-roam-canvas-3 { animation: windRoamCanvas3 30s ease-in-out infinite; transform-origin: 16px 8px; }
      .wind-hat-roam-overall { animation: windRoamOverall 13s ease-in-out infinite; transform-origin: 18px 10px; }
      .wind-hat-roam-profile-800 { animation: windRoamProfile800 16s ease-in-out infinite; transform-origin: 20px 11px; }
      .wind-hat-roam-profile-420 { animation: windRoamProfile420 14s ease-in-out infinite; transform-origin: 20px 11px; }
      .wind-hat-roam-contrib { animation: windRoamContrib 18s ease-in-out infinite; transform-origin: 22px 12px; }
      .wind-hat-ambient { animation: windFloatAmbient 5.5s ease-in-out infinite; transform-origin: 21px 12px; }
      .wind-hat-drift { animation: windDriftAcross 7.5s ease-in-out infinite; transform-origin: 26px 14px; }
      .wind-gust { animation: windGustSweep 4s linear infinite; }`
    : '';

  return `${gatlingStyles}${strawHatStyles}
      @media (prefers-reduced-motion: reduce) {
        .gatling-f0, .hat-f0 { opacity: 1 !important; animation: none !important; }
        .gatling-f1, .gatling-f2, .gatling-f3, .hat-f1, .hat-f2, .hat-f3 { opacity: 0 !important; animation: none !important; }
        .wind-hat-roam-canvas-1, .wind-hat-roam-canvas-2, .wind-hat-roam-canvas-3,
        .wind-hat-roam-overall, .wind-hat-roam-profile-800, .wind-hat-roam-profile-420,
        .wind-hat-roam-contrib, .wind-hat-ambient, .wind-hat-drift, .wind-gust {
          animation: none !important;
        }
      }`;
}

export function renderMascotSvg(
  mascot: OnePieceMascot,
  x: number,
  y: number,
  width: number,
  height: number,
  groupClass = 'p-mascot'
): string {
  const safeName = escapeXml(mascot.name);
  if (mascot.frames && mascot.frames.length > 1) {
    const numFrames = mascot.frames.length;
    const dur = ((mascot.frameDuration || 0.11) * numFrames).toFixed(2);
    const keyTimes = Array.from({ length: numFrames + 1 }, (_, i) =>
      (i / numFrames).toFixed(2)
    ).join(';');
    const frameClassPrefix = mascot.id === 'straw_hat' ? 'hat-f' : 'gatling-f';

    const images = mascot.frames
      .map((frameB64, idx) => {
        const vals = Array.from({ length: numFrames + 1 }, (_, i) => {
          const frameIndex = i === numFrames ? 0 : i;
          return frameIndex === idx ? '1' : '0';
        }).join(';');
        const initOpacity = idx === 0 ? '1' : '0';
        return `    <image href="${frameB64}" class="${frameClassPrefix}${idx}" x="${x}" y="${y}" width="${width}" height="${height}" opacity="${initOpacity}" preserveAspectRatio="xMidYMid meet" style="image-rendering: pixelated; image-rendering: crisp-edges;">
      <animate attributeName="opacity" values="${vals}" keyTimes="${keyTimes}" dur="${dur}s" repeatCount="indefinite" calcMode="discrete" />
    </image>`;
      })
      .join('\n');

    return `\n  <!-- Theme Character Mascot (Animated Borderless) -->\n  <g class="${groupClass}" role="img" aria-label="${safeName}">\n${images}\n  </g>`;
  }

  return `\n  <!-- Theme Character Mascot (Borderless) -->\n  <g class="${groupClass}" role="img" aria-label="${safeName}">\n    <image href="${mascot.avatarBase64}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" style="image-rendering: pixelated; image-rendering: crisp-edges;" />\n  </g>`;
}

export function renderFloatingBackgroundHats(
  themeId?: string | null,
  width = 800,
  height = 104,
  isMasterCanvas = false,
  mascotId?: string | null
): string {
  if (!isFloatingHatTheme(themeId, mascotId)) return '';

  const numFrames = STRAW_HAT_FRAMES.length; // 4
  const frameDur = '0.52';
  const keyTimes = '0.00;0.25;0.50;0.75;1.00';

  const renderHatFrames = (hatW: number, hatH: number) => {
    return STRAW_HAT_FRAMES.map((frameB64, idx) => {
      const vals = Array.from({ length: numFrames + 1 }, (_, i) => {
        const frameIndex = i === numFrames ? 0 : i;
        return frameIndex === idx ? '1' : '0';
      }).join(';');
      const initOpacity = idx === 0 ? '1' : '0';
      return `<image href="${frameB64}" class="hat-f${idx}" x="0" y="0" width="${hatW}" height="${hatH}" opacity="${initOpacity}" preserveAspectRatio="xMidYMid meet" style="image-rendering: pixelated; image-rendering: crisp-edges;">
        <animate attributeName="opacity" values="${vals}" keyTimes="${keyTimes}" dur="${frameDur}s" repeatCount="indefinite" calcMode="discrete" />
      </image>`;
    }).join('\n      ');
  };

  if (isMasterCanvas) {
    // Canvas-wide floating wind hats roaming all over the canvas space at different depths
    const hat1W = 48;
    const hat1H = 26;
    const hat1Y_mid = Math.floor(height * 0.42);
    const hat1Y_low = Math.floor(height * 0.34);
    const hat1Y_ret = Math.floor(height * 0.20);

    const hat2W = 40;
    const hat2H = 22;
    const hat2Y_0 = Math.floor(height * 0.52);
    const hat2Y_1 = Math.floor(height * 0.70);
    const hat2Y_2 = Math.floor(height * 0.56);
    const hat2Y_3 = Math.floor(height * 0.86);
    const hat2Y_4 = Math.floor(height * 0.76);

    const hat3W = 34;
    const hat3H = 19;
    const hat3Y_0 = Math.floor(height * 0.80);
    const hat3Y_1 = Math.floor(height * 0.48);
    const hat3Y_2 = Math.floor(height * 0.26);
    const hat3Y_3 = 80;
    const hat3Y_4 = Math.floor(height * 0.38);

    const windTrail1 = `<path d="M 20 80 Q 240 170 460 70 T 820 130" stroke="rgba(253, 224, 71, 0.22)" stroke-width="1.6" stroke-linecap="round" fill="none" stroke-dasharray="12 10" class="wind-gust" />`;
    const windTrail2 = `<path d="M 40 ${Math.floor(height * 0.42)} Q 300 ${Math.floor(height * 0.34)} 540 ${Math.floor(height * 0.46)} T 800 ${Math.floor(height * 0.40)}" stroke="rgba(245, 158, 11, 0.18)" stroke-width="1.5" stroke-linecap="round" fill="none" stroke-dasharray="14 10" class="wind-gust" />`;
    const windTrail3 = `<path d="M 50 ${Math.floor(height * 0.78)} Q 320 ${Math.floor(height * 0.86)} 560 ${Math.floor(height * 0.74)} T 810 ${Math.floor(height * 0.82)}" stroke="rgba(253, 224, 71, 0.16)" stroke-width="1.4" stroke-linecap="round" fill="none" stroke-dasharray="12 8" class="wind-gust" />`;

    return `\n  <!-- Master Profile Canvas Floating Straw Hats (Roaming Full Space) -->\n  <g class="canvas-floating-hats" role="img" aria-label="Floating Straw Hats Roaming All Over Space">\n    ${windTrail1}\n    ${windTrail2}\n    ${windTrail3}\n    <g class="wind-hat-roam-canvas-1" transform="translate(50, 50)" opacity="0.95">\n      <animateTransform attributeName="transform" type="translate" values="50,50; 380,160; 730,80; 540,${hat1Y_mid}; 160,${hat1Y_low}; 420,${hat1Y_ret}; 50,50" dur="22s" repeatCount="indefinite" />\n      <g transform="rotate(-8 ${hat1W / 2} ${hat1H / 2})">\n        <animateTransform attributeName="transform" type="rotate" values="-8 ${hat1W / 2} ${hat1H / 2}; 14 ${hat1W / 2} ${hat1H / 2}; -12 ${hat1W / 2} ${hat1H / 2}; 16 ${hat1W / 2} ${hat1H / 2}; -15 ${hat1W / 2} ${hat1H / 2}; 8 ${hat1W / 2} ${hat1H / 2}; -8 ${hat1W / 2} ${hat1H / 2}" dur="22s" repeatCount="indefinite" additive="sum" />\n        ${renderHatFrames(hat1W, hat1H)}\n      </g>\n    </g>\n    <g class="wind-hat-roam-canvas-2" transform="translate(700, ${hat2Y_0})" opacity="0.75">\n      <animateTransform attributeName="transform" type="translate" values="700,${hat2Y_0}; 360,${hat2Y_1}; 80,${hat2Y_2}; 280,${hat2Y_3}; 660,${hat2Y_4}; 700,${hat2Y_0}" dur="26s" repeatCount="indefinite" />\n      <g transform="rotate(10 ${hat2W / 2} ${hat2H / 2})">\n        <animateTransform attributeName="transform" type="rotate" values="10 ${hat2W / 2} ${hat2H / 2}; -12 ${hat2W / 2} ${hat2H / 2}; 14 ${hat2W / 2} ${hat2H / 2}; -10 ${hat2W / 2} ${hat2H / 2}; 12 ${hat2W / 2} ${hat2H / 2}; 10 ${hat2W / 2} ${hat2H / 2}" dur="26s" repeatCount="indefinite" additive="sum" />\n        ${renderHatFrames(hat2W, hat2H)}\n      </g>\n    </g>\n    <g class="wind-hat-roam-canvas-3" transform="translate(120, ${hat3Y_0})" opacity="0.55">\n      <animateTransform attributeName="transform" type="translate" values="120,${hat3Y_0}; 460,${hat3Y_1}; 740,${hat3Y_2}; 340,${hat3Y_3}; 60,${hat3Y_4}; 120,${hat3Y_0}" dur="30s" repeatCount="indefinite" />\n      <g transform="rotate(-16 ${hat3W / 2} ${hat3H / 2})">\n        <animateTransform attributeName="transform" type="rotate" values="-16 ${hat3W / 2} ${hat3H / 2}; 18 ${hat3W / 2} ${hat3H / 2}; -14 ${hat3W / 2} ${hat3H / 2}; 12 ${hat3W / 2} ${hat3H / 2}; -10 ${hat3W / 2} ${hat3H / 2}; -16 ${hat3W / 2} ${hat3H / 2}" dur="30s" repeatCount="indefinite" additive="sum" />\n        ${renderHatFrames(hat3W, hat3H)}\n      </g>\n    </g>\n  </g>`;
  }

  // Single card floating hat roaming all over the card space
  if (width <= 260) {
    // Overall / Streak box (258 x 104)
    const hatW = 36;
    const hatH = 20;
    const trail = `<path d="M 10 32 Q 80 82 155 26 T 246 50" stroke="rgba(245, 158, 11, 0.22)" stroke-width="1.4" stroke-linecap="round" fill="none" stroke-dasharray="8 6" class="wind-gust" />`;
    return `\n  <!-- Card Background Floating Straw Hat (Roaming Full Space) -->\n  <g class="card-floating-hat" role="img" aria-label="Floating Straw Hat Roaming All Over Space">\n    ${trail}\n    <g class="wind-hat-roam-overall" transform="translate(14, 16)" opacity="0.85">\n      <animateTransform attributeName="transform" type="translate" values="14,16; 95,68; 192,18; 135,42; 45,66; 14,16" dur="13s" repeatCount="indefinite" />\n      <g transform="rotate(-6 ${hatW / 2} ${hatH / 2})">\n        <animateTransform attributeName="transform" type="rotate" values="-6 ${hatW / 2} ${hatH / 2}; 12 ${hatW / 2} ${hatH / 2}; -8 ${hatW / 2} ${hatH / 2}; 10 ${hatW / 2} ${hatH / 2}; -12 ${hatW / 2} ${hatH / 2}; -6 ${hatW / 2} ${hatH / 2}" dur="13s" repeatCount="indefinite" additive="sum" />\n        ${renderHatFrames(hatW, hatH)}\n      </g>\n    </g>\n  </g>`;
  }

  if (height <= 100) {
    // Profile card (800x96 or 420x96)
    const hatW = 38;
    const hatH = 21;
    const isSmall = width <= 460;
    const p1X = isSmall ? 200 : 340;
    const p2X = isSmall ? 315 : 690;
    const p3X = isSmall ? 220 : 490;
    const cls = isSmall ? 'wind-hat-roam-profile-420' : 'wind-hat-roam-profile-800';
    const dur = isSmall ? '14s' : '16s';
    const trail = `<path d="M 80 34 Q ${Math.floor(width * 0.4)} 80 ${Math.floor(width * 0.7)} 24 T ${width - 40} 54" stroke="rgba(245, 158, 11, 0.22)" stroke-width="1.4" stroke-linecap="round" fill="none" stroke-dasharray="10 8" class="wind-gust" />`;

    return `\n  <!-- Profile Card Background Floating Straw Hat (Roaming Full Space) -->\n  <g class="card-floating-hat" role="img" aria-label="Floating Straw Hat Roaming All Over Space">\n    ${trail}\n    <g class="${cls}" transform="translate(105, 14)" opacity="0.85">\n      <animateTransform attributeName="transform" type="translate" values="105,14; ${p1X},65; ${p2X},16; ${p3X},62; 105,14" dur="${dur}" repeatCount="indefinite" />\n      <g transform="rotate(-6 ${hatW / 2} ${hatH / 2})\">\n        <animateTransform attributeName="transform" type="rotate" values="-6 ${hatW / 2} ${hatH / 2}; 14 ${hatW / 2} ${hatH / 2}; -10 ${hatW / 2} ${hatH / 2}; 12 ${hatW / 2} ${hatH / 2}; -6 ${hatW / 2} ${hatH / 2}" dur="${dur}" repeatCount="indefinite" additive="sum" />\n        ${renderHatFrames(hatW, hatH)}\n      </g>\n    </g>\n  </g>`;
  }

  // Contributions card (800 x 166) or general wide cards
  const hatW = 44;
  const hatH = 24;
  const trail = `<path d="M 25 36 Q 240 125 460 30 T 780 85" stroke="rgba(245, 158, 11, 0.22)" stroke-width="1.5" stroke-linecap="round" fill="none" stroke-dasharray="12 8" class="wind-gust" />`;

  return `\n  <!-- Contributions Card Background Floating Straw Hat (Roaming Full Space) -->\n  <g class="card-floating-hat" role="img" aria-label="Floating Straw Hat Roaming All Over Space">\n    ${trail}\n    <g class="wind-hat-roam-contrib" transform="translate(35, 18)" opacity="0.85">\n      <animateTransform attributeName="transform" type="translate" values="35,18; 240,115; 480,22; 710,110; 360,125; 35,18" dur="18s" repeatCount="indefinite" />\n      <g transform="rotate(-8 ${hatW / 2} ${hatH / 2})">\n        <animateTransform attributeName="transform" type="rotate" values="-8 ${hatW / 2} ${hatH / 2}; 14 ${hatW / 2} ${hatH / 2}; -10 ${hatW / 2} ${hatH / 2}; 12 ${hatW / 2} ${hatH / 2}; -14 ${hatW / 2} ${hatH / 2}; -8 ${hatW / 2} ${hatH / 2}" dur="18s" repeatCount="indefinite" additive="sum" />\n        ${renderHatFrames(hatW, hatH)}\n      </g>\n    </g>\n  </g>`;
}

// ==========================================================
// 1. PROFILE HEADER CARD (PFP + Name + @nickname)
// ==========================================================
export interface ProfileCardRenderOptions {
  customName?: string | null;
  showCompany?: boolean;
  companyText?: string | null;
  showBio?: boolean;
  bioText?: string | null;
  width?: number;
  height?: number;
  mascot?: string | null;
  isSubCard?: boolean;
}

export function designProfileCard(
  profile: ProfileItemData,
  themeId?: string | null,
  fontId?: string | null,
  options?: ProfileCardRenderOptions
): string {
  const theme = getDesignTheme(themeId, options?.mascot);
  const font = getDesignFont(fontId);
  const width = options?.width || (options?.showBio || options?.showCompany ? 800 : 420);
  const height = options?.height || 96;
  const mascot = theme.mascot;
  const maxNameLength = mascot && width <= 460 ? 18 : 26;
  const name = escapeXml(
    truncateText(options?.customName || profile.name || profile.username, maxNameLength)
  );
  const nickname = escapeXml(`@${profile.username}`);
  const avatarHref = profile.avatarBase64 || profile.avatarUrl;

  const showCompany =
    Boolean(options?.showCompany) && Boolean(options?.companyText || profile.company);
  const company = showCompany
    ? escapeXml(truncateText(options?.companyText || profile.company || '', 32))
    : null;

  const showBio =
    Boolean(options?.showBio) && Boolean(options?.bioText || profile.bio);
  const bio = showBio
    ? escapeXml(truncateText(options?.bioText || profile.bio || '', 85))
    : null;

  const hasExtra = Boolean(company || bio);
  const nameY = hasExtra ? 28 : 44;
  const nameSize = hasExtra ? 22 : 26;
  const nickY = hasExtra ? 50 : 72;
  const nickSize = hasExtra ? 15 : 18;
  const bioY = 74;

  const mascotBadge = mascot
    ? renderMascotSvg(mascot, width - 92, 6, 84, 84, 'p-mascot')
    : '';

  const floatingHat = !options?.isSubCard
    ? renderFloatingBackgroundHats(themeId, width, height, false, options?.mascot)
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${name} (${nickname})">
  <defs>
    <clipPath id="pfpClip">
      <rect x="8" y="8" width="80" height="80" rx="14" />
    </clipPath>
    <style>
      ${getSvgFontImport(font)}
      ${getMascotAnimationStyles(mascot, themeId)}
      .p-name { font: 800 ${nameSize}px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .p-nick { font: 600 ${nickSize}px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .p-bio { font: 400 13px ${font.fontFamily}; fill: ${theme.textSecondary}; }
    </style>
  </defs>

  <!-- PFP Frame -->
  <rect x="8" y="8" width="80" height="80" rx="14" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="2" />
  ${
    avatarHref
      ? `<image href="${escapeXml(avatarHref)}" x="8" y="8" width="80" height="80" clip-path="url(#pfpClip)" preserveAspectRatio="xMidYMid slice" />`
      : `<text x="48" y="55" text-anchor="middle" font-size="22" font-weight="700" fill="${theme.textSecondary}" font-family="sans-serif">PFP</text>`
  }
  <rect x="8" y="8" width="80" height="80" rx="14" fill="none" stroke="${theme.border}" stroke-width="2" />

  <!-- Name & @nickname & optional company -->
  <text x="104" y="${nameY}" class="p-name" fill="${theme.textPrimary}">${name}</text>
  <text x="104" y="${nickY}" class="p-nick" fill="${theme.textSecondary}"><tspan>${nickname}</tspan>${
    company
      ? `<tspan fill="${theme.textSecondary}" font-weight="400">  ·  </tspan><tspan fill="${theme.textPrimary}" font-weight="600">${company}</tspan>`
      : ''
  }</text>
  ${bio ? `<text x="104" y="${bioY}" class="p-bio" fill="${theme.textSecondary}">${bio}</text>` : ''}${floatingHat}${mascotBadge}
</svg>`;
}

// ==========================================================
// 2. SOCIAL HEADER ITEM CARD (Email, LinkedIn, Portfolio, etc.)
// ==========================================================
export function designSocialItemCard(
  type: string,
  label: string,
  themeId?: string | null,
  fontId?: string | null,
  width = 68,
  height = 44
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const safeLabel = escapeXml(truncateText(label, 10));
  const norm = type.toLowerCase();

  let iconSvg = '';
  if (norm === 'email') {
    iconSvg = `<path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2l8 5 8-5" stroke="${theme.textPrimary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  } else if (norm === 'linkedin') {
    iconSvg = `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" stroke="${theme.textPrimary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="4" cy="4" r="2" fill="${theme.textPrimary}"/>`;
  } else if (norm === 'portfolio' || norm === 'website') {
    iconSvg = `<circle cx="12" cy="12" r="9" stroke="${theme.textPrimary}" stroke-width="1.8" fill="none"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18z" stroke="${theme.textPrimary}" stroke-width="1.6" fill="none"/>`;
  } else if (norm === 'twitter' || norm === 'x') {
    iconSvg = `<path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-6.8-8.5L19.5 4h-2l-5 6.2L8 4H4z" stroke="${theme.textPrimary}" stroke-width="1.6" stroke-linejoin="round" fill="none"/>`;
  } else if (norm === 'youtube') {
    iconSvg = `<rect x="2" y="5" width="20" height="14" rx="4" stroke="${theme.textPrimary}" stroke-width="1.8" fill="none"/><polygon points="10,9 16,12 10,15" fill="${theme.textPrimary}"/>`;
  } else if (norm === 'discord') {
    iconSvg = `<path d="M8 8a10 10 0 0 1 8 0M6 16c2 1.5 10 1.5 12 0M5.5 7.5C4.2 10 3.8 13.5 4.5 16.5c1.5 1.2 3 1.8 4 2l.8-1.6m9.2-9.4c1.3 2.5 1.7 6 1 9-1.5 1.2-3 1.8-4 2l-.8-1.6" stroke="${theme.textPrimary}" stroke-width="1.6" stroke-linecap="round" fill="none"/><circle cx="9.5" cy="12.5" r="1.2" fill="${theme.textPrimary}"/><circle cx="14.5" cy="12.5" r="1.2" fill="${theme.textPrimary}"/>`;
  } else {
    iconSvg = `<circle cx="12" cy="12" r="8" stroke="${theme.textPrimary}" stroke-width="1.8" fill="none"/><path d="M9 12l2 2 4-4" stroke="${theme.textPrimary}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }

  const scale = 0.68;
  const iconSize = 24 * scale;
  const iconX = ((width - iconSize) / 2).toFixed(1);
  const iconY = 5.5;
  const textY = height - 9;
  const textX = (width / 2).toFixed(1);
  const rx = Math.min(theme.borderRadius, 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${safeLabel}">
  <rect width="${width}" height="${height}" rx="${rx}" fill="${theme.cardBg}" stroke="none" />
  <g transform="translate(${iconX}, ${iconY}) scale(${scale})">
    ${iconSvg}
  </g>
  <text x="${textX}" y="${textY}" text-anchor="middle" font-size="10" font-weight="600" fill="${theme.textSecondary}" font-family="${font.fontFamily}">${safeLabel}</text>
</svg>`;
}

// ==========================================================
// 3. PINNED PROJECT CARD (Compact 3-in-a-row Grid)
// ==========================================================
export function designPinnedProjectCard(
  project: PinnedProjectItem,
  themeId?: string | null,
  width = 256,
  height = 96,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const name = escapeXml(truncateText(project.name, 22));
  const safeId = project.name.replace(/[^a-zA-Z0-9_-]/g, '_') || 'repo';
  const rawDesc = project.description || 'Open-source repository on GitHub.';
  const [rawLine1, rawLine2] = wrapTextTwoLines(rawDesc, 34, 34);
  const line1 = escapeXml(rawLine1);
  const line2 = escapeXml(rawLine2);
  const lang = escapeXml(truncateText(project.language || 'Code', 10));
  const langColor = project.languageColor || theme.accent;
  const stars = formatCompactNumber(project.stars);
  const forks = formatCompactNumber(project.forks);

  const descY1 = line2 ? 39 : 43;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="Pinned Project: ${name}">
  <defs>
    <linearGradient id="projGrad_${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${getSvgFontImport(font)}
      .proj-title { font: 600 13px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .proj-desc { font: 400 10.5px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .proj-meta { font: 500 10px ${font.fontFamily}; fill: ${theme.textSecondary}; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" rx="${theme.borderRadius}" fill="url(#projGrad_${safeId})" stroke="none" />

  <!-- Repo Icon + Title -->
  <g transform="translate(14, 16)">
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" fill="${theme.textSecondary}" transform="scale(0.85) translate(0, -1)" />
    <text x="18" y="10" class="proj-title" fill="${theme.textPrimary}">${name}</text>
  </g>

  <!-- Description -->
  <text x="14" y="${descY1}" class="proj-desc" fill="${theme.textSecondary}">${line1}</text>
  ${line2 ? `<text x="14" y="53" class="proj-desc" fill="${theme.textSecondary}">${line2}</text>` : ''}

  <!-- Bottom Footer: Language + Stars + Forks -->
  <g transform="translate(14, 78)">
    <circle cx="4" cy="-3.5" r="3" fill="${langColor}" />
    <text x="12" y="0" class="proj-meta" fill="${theme.textSecondary}">${lang}</text>

    <!-- Star Octicon + Count -->
    <g transform="translate(112, -9)">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" fill="${theme.textSecondary}" transform="scale(0.75)" />
      <text x="15" y="9" class="proj-meta" fill="${theme.textSecondary}">${stars}</text>
    </g>

    <!-- Fork Octicon + Count -->
    <g transform="translate(170, -9)">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" fill="${theme.textSecondary}" transform="scale(0.75)" />
      <text x="14" y="9" class="proj-meta" fill="${theme.textSecondary}">${forks}</text>
    </g>
  </g>
</svg>`;
}

// ==========================================================
// 4. LANGUAGES BAR CARD (Horizontal Segmented Bar + Labels Underneath)
// ==========================================================
export function designLanguagesBarCard(
  data: LanguagesItemData,
  themeId?: string | null,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const langs = (data.languages || []).slice(0, 7);
  const totalBytes = langs.reduce((acc, l) => acc + l.bytes, 0) || 1;

  const barX = 20;
  const barY = 14;
  const barWidth = 760;
  const barHeight = 8;
  const cardHeight = 58;

  // Compute normalized widths so every language is visible (min 6px) and total sum === barWidth (760px)
  const minSegWidth = langs.length > 1 ? 6 : barWidth;
  const rawWidths = langs.map((lang) =>
    Math.max(minSegWidth, (lang.bytes / totalBytes) * barWidth)
  );
  const rawSum = rawWidths.reduce((a, b) => a + b, 0) || 1;
  const normalizedWidths = rawWidths.map((w) =>
    Math.max(minSegWidth, Math.round((w / rawSum) * barWidth))
  );

  // Adjust largest segment so exact sum equals barWidth (760px)
  if (normalizedWidths.length > 0) {
    const currentSum = normalizedWidths.reduce((a, b) => a + b, 0);
    const diff = barWidth - currentSum;
    let maxIdx = 0;
    for (let i = 1; i < normalizedWidths.length; i++) {
      if (normalizedWidths[i] > normalizedWidths[maxIdx]) maxIdx = i;
    }
    normalizedWidths[maxIdx] = Math.max(minSegWidth, normalizedWidths[maxIdx] + diff);
  }

  let currentX = barX;
  const segments: string[] = [];
  const dividers: string[] = [];

  langs.forEach((lang, idx) => {
    const w =
      idx === langs.length - 1
        ? Math.max(4, barX + barWidth - currentX)
        : normalizedWidths[idx];

    segments.push(
      `<rect x="${currentX}" y="${barY}" width="${w}" height="${barHeight}" fill="${lang.color || theme.accent}" />`
    );

    if (idx > 0 && currentX > barX && currentX < barX + barWidth) {
      dividers.push(
        `<line x1="${currentX}" y1="${barY}" x2="${currentX}" y2="${barY + barHeight}" stroke="${theme.cardBg}" stroke-width="1.5" />`
      );
    }
    currentX += w;
  });

  // Labels placed underneath the bar
  const slotWidth = Math.floor(barWidth / Math.max(langs.length, 1));
  const labels = langs.map((lang, idx) => {
    const x = barX + idx * slotWidth;
    const safeName = escapeXml(truncateText(lang.name, 12));
    return `<g transform="translate(${x}, 38)">
      <circle cx="4" cy="-3.5" r="3" fill="${lang.color || theme.accent}" />
      <text x="12" y="0" font-size="11" font-weight="600" fill="${theme.textPrimary}" font-family="${font.fontFamily}">${safeName}</text>
      <text x="12" y="13" font-size="9.5" font-weight="400" fill="${theme.textSecondary}" font-family="${font.fontFamily}">${lang.percentage}%</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${cardHeight}" viewBox="0 0 800 ${cardHeight}" fill="none" role="img" aria-label="Languages Distribution">
  <defs>
    <clipPath id="langBarClip">
      <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" />
    </clipPath>
  </defs>

  <rect x="0" y="0" width="800" height="${cardHeight}" rx="${theme.borderRadius}" fill="${theme.cardBg}" />

  <!-- Segmented Proportional Bar -->
  <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" fill="${theme.cardBg}" />
  <g clip-path="url(#langBarClip)">
    ${segments.join('\n    ')}
    ${dividers.join('\n    ')}
  </g>

  <!-- Language Names Underneath -->
  ${labels.join('\n  ')}
</svg>`;
}

// ==========================================================
// 5. GRADED STAT BOX (commits, PR, issues, stars earned, Repos, Polyglot)
// ==========================================================
export function designGradedStatBox(
  data: GradedMetricItemData,
  themeId?: string | null,
  width = 192,
  height = 98,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const label = escapeXml(data.label);
  const valStr = escapeXml(formatCompactNumber(data.value));
  const grade = data.grade;
  const gColor = theme.gradeColors[grade] || theme.gradeColors.C;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${label}: ${valStr} (Grade ${grade})">
  <defs>
    <linearGradient id="statGrad_${data.item}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${getSvgFontImport(font)}
      .stat-label { font: 600 13.5px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .stat-value { font: 800 28px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .stat-grade-${data.item} { font: 800 15px ${font.fontFamily}; fill: ${gColor.text}; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" rx="${theme.borderRadius}" fill="url(#statGrad_${data.item})" stroke="none" />

  <!-- Top-Left Label -->
  <text x="16" y="28" class="stat-label" fill="${theme.textSecondary}">${label}</text>

  <!-- Top-Right Grade Pill -->
  <g transform="translate(${width - 42}, 11)">
    <rect x="0" y="0" width="26" height="24" rx="7" fill="${gColor.bg}" stroke="${gColor.border}" stroke-width="1.2" />
    <text x="13" y="17" text-anchor="middle" class="stat-grade-${data.item}" fill="${gColor.text}">${grade}</text>
  </g>

  <!-- Main Value -->
  <text x="16" y="${height - 20}" class="stat-value" fill="${theme.textPrimary}">${valStr}</text>
</svg>`;
}

// ==========================================================
// 6. OVERALL GRADE BOX ('overall' -> C / B / A / S)
// ==========================================================
export function designOverallBox(
  data: OverallItemData,
  themeId?: string | null,
  width = 258,
  height = 104,
  fontId?: string | null,
  mascotId?: string | null
): string {
  const theme = getDesignTheme(themeId, mascotId);
  const font = getDesignFont(fontId);
  const grade = data.grade;
  const gColor = theme.gradeColors[grade] || theme.gradeColors.C;
  // Exclude Luffy punching (luffy_gatling) and straw_hat from the overall grade box
  const mascot =
    theme.mascot &&
    theme.mascot.id !== 'luffy_gatling' &&
    theme.mascot.id !== 'straw_hat'
      ? theme.mascot
      : null;
  const contentX = mascot ? (width - 48) / 2 : width / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="overall grade: ${grade}">
  <defs>
    <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${getSvgFontImport(font)}
      ${getMascotAnimationStyles(mascot, themeId)}
      .ov-label { font: 600 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .ov-grade { font: 900 42px ${font.fontFamily}; fill: ${gColor.text}; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" rx="${theme.borderRadius}" fill="url(#overallGrad)" stroke="none" />

  <text x="${contentX}" y="28" text-anchor="middle" class="ov-label" fill="${theme.textSecondary}">overall</text>
  <text x="${contentX}" y="${height - 18}" text-anchor="middle" class="ov-grade" fill="${gColor.text}">${grade}</text>
  ${
    mascot
      ? renderMascotSvg(mascot, width - 66, 22, 52, 60, 'ov-mascot')
      : ''
  }
</svg>`;
}

// ==========================================================
// 7. STREAK METRIC BOX ('streak', 'longest streak', 'active days this year')
// ==========================================================
export function designStreakBox(
  data: StreakMetricItemData,
  themeId?: string | null,
  width = 258,
  height = 104,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const label = escapeXml(data.label);
  const formatted = escapeXml(data.formatted);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${label}: ${formatted}">
  <defs>
    <linearGradient id="streakGrad_${data.item}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${getSvgFontImport(font)}
      .st-label { font: 600 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .st-val { font: 800 28px ${font.fontFamily}; fill: ${theme.textPrimary}; }
    </style>
  </defs>

  <rect width="${width}" height="${height}" rx="${theme.borderRadius}" fill="url(#streakGrad_${data.item})" stroke="none" />

  <text x="18" y="30" class="st-label" fill="${theme.textSecondary}">${label}</text>
  <text x="18" y="${height - 20}" class="st-val" fill="${theme.textPrimary}">${formatted}</text>
</svg>`;
}

// ==========================================================
// 8. CONTRIBUTIONS LAST YEAR BOX (Full-width bottom box with grid)
// ==========================================================
export function designContributionsBox(
  data: ContributionsItemData,
  themeId?: string | null,
  fontId?: string | null
): string {
  const theme = getDesignTheme(themeId);
  const font = getDesignFont(fontId);
  const rightLabel = escapeXml(data.rightLabel);
  const weeks = (data.weeks || []).slice(-53);

  // Align heatmap grid flush with left label (x=22) and right label (x=778 => total width 756)
  const gridStartX = 22;
  const gridStartY = 48;
  const targetGridWidth = 756;
  const numWeeks = Math.max(weeks.length, 52);
  const cellSize = 11;
  const stepX =
    numWeeks > 1 ? (targetGridWidth - cellSize) / (numWeeks - 1) : 14.2;
  const stepY = 14.2;

  // Precompute y offsets for each day of the week (0..6)
  const yOffsets = Array.from({ length: 7 }, (_, dIdx) => (gridStartY + dIdx * stepY).toFixed(1));

  const cells: string[] = [];

  weeks.forEach((week, wIdx) => {
    const days = week.contributionDays || [];
    const x = (gridStartX + wIdx * stepX).toFixed(1);

    days.forEach((day, dIdx) => {
      const count = day.contributionCount || 0;
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      const color = theme.heatmapLevels[level];
      const y = yOffsets[dIdx] || (gridStartY + dIdx * stepY).toFixed(1);

      cells.push(
        `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2.5" fill="${color}" />`
      );
    });
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="166" viewBox="0 0 800 166" fill="none" role="img" aria-label="contributions last year: ${rightLabel}">
  <defs>
    <linearGradient id="contribGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.cardBg}" />
      <stop offset="100%" stop-color="${theme.cardBgGradientEnd}" />
    </linearGradient>
    <style>
      ${getSvgFontImport(font)}
      ${getMascotAnimationStyles(null, themeId)}
      .c-title { font: 600 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .c-right { font: 700 14px ${font.fontFamily}; fill: ${theme.textPrimary}; }
    </style>
  </defs>

  <rect width="800" height="166" rx="${theme.borderRadius}" fill="url(#contribGrad)" stroke="none" />
  ${renderFloatingBackgroundHats(themeId, 800, 166, false)}

  <!-- Top Left & Top Right Labels -->
  <text x="22" y="29" class="c-title" fill="${theme.textSecondary}">contributions last year</text>
  <text x="778" y="29" text-anchor="end" class="c-right" fill="${theme.textPrimary}">${rightLabel}</text>

  <!-- Contribution Calendar Grid -->
  ${cells.join('\n  ')}
</svg>`;
}

// ==========================================================
// 9. FULL COMPOSITE PROFILE CANVAS CARD (Single-Line API)
// ==========================================================

/**
 * Embeds a sub-SVG within a master composite SVG.
 * Deduplicates nested Google Fonts @import rules and standardizes dimensions.
 */
function embedSubSvg(
  svgMarkup: string,
  x: number,
  y: number,
  width?: number,
  height?: number
): string {
  const widthMatch = svgMarkup.match(/\bwidth="(\d+(?:\.\d+)?)"/);
  const heightMatch = svgMarkup.match(/\bheight="(\d+(?:\.\d+)?)"/);
  const viewBoxMatch = svgMarkup.match(/\bviewBox="([^"]+)"/);

  const origW = widthMatch ? Number(widthMatch[1]) : 100;
  const origH = heightMatch ? Number(heightMatch[1]) : 100;
  const targetW = width ?? origW;
  const targetH = height ?? origH;
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${origW} ${origH}`;

  // Strip redundant Google Font @import statements in nested sub-SVGs
  // (the master SVG top-level <defs> already imports the font for the whole canvas)
  const cleanedSvg = svgMarkup.replace(/@import\s+url\([^)]+\);?/g, '');

  return cleanedSvg.replace(
    /^<svg[^>]*>/,
    `<svg x="${x}" y="${y}" width="${targetW}" height="${targetH}" viewBox="${viewBox}" fill="none">`
  );
}

export function designFullCanvasCard(
  data: FullCanvasData,
  options?: FullCanvasRenderOptions
): string {
  const themeId = options?.theme;
  const theme = getDesignTheme(themeId, options?.mascot);
  const fontId = options?.font;
  const font = getDesignFont(fontId);
  const canvasWidth = 840;
  const padX = 20;
  const innerWidth = 800; // 840 - 2 * 20

  const sections =
    options?.sections && options.sections.length > 0
      ? options.sections
      : ['pinned_projects', 'tech_stack', 'github_stats', 'streak_trophies'];

  const hideRows = new Set(options?.hideRows || []);

  const elements: string[] = [];
  let y = 20;

  const showProfile = !options?.hideProfile;

  // 1. Header Row: Profile Card
  if (showProfile) {
    elements.push(
      embedSubSvg(
        designProfileCard(data.profile, themeId, fontId, {
          customName: options?.customName,
          showCompany: options?.showCompany,
          companyText: options?.customCompany,
          showBio: options?.showBio,
          bioText: options?.customBio,
          mascot: options?.mascot,
          width: innerWidth,
          height: 96,
          isSubCard: true,
        }),
        padX,
        y,
        innerWidth,
        96
      )
    );

    y += 96 + 14;

    // Optional Tagline
    if (options?.tagline && options.tagline.trim().length > 0) {
      const safeTagline = escapeXml(truncateText(options.tagline.trim(), 96));
      elements.push(
        `<text x="${padX + 8}" y="${y + 14}" class="canvas-tagline" fill="${theme.textSecondary}">${safeTagline}</text>`
      );
      y += 26;
    }

    // Divider Line under Header
    elements.push(
      `<line x1="${padX}" y1="${y}" x2="${padX + innerWidth}" y2="${y}" stroke="${theme.border}" stroke-width="1.5" />`
    );
    y += 24;
  }

  const renderSectionHeading = (title: string) => {
    elements.push(
      `<text x="${padX + 2}" y="${y + 20}" class="canvas-section-title" fill="${theme.textPrimary}">${escapeXml(title)}</text>`
    );
    y += 32;
  };

  const renderStatsRows = (rowIds: string[]) => {
    const activeRows = rowIds.filter((r) => !hideRows.has(r));
    if (activeRows.length === 0) return;

    renderSectionHeading('Github stats');

    activeRows.forEach((rowId) => {
      if (rowId === 'r1') {
        // Row 1: commits | PR | issues | stars earned (4 x 191 + 3 x 12 = 800px)
        const boxW = 191;
        const boxH = 98;
        const gap = 12;
        const r1Items = [data.commits, data.prs, data.issues, data.stars];
        r1Items.forEach((metric, idx) => {
          const bx = padX + idx * (boxW + gap);
          elements.push(
            embedSubSvg(
              designGradedStatBox(metric, themeId, boxW, boxH, fontId),
              bx,
              y,
              boxW,
              boxH
            )
          );
        });
        y += boxH + 14;
      } else if (rowId === 'r2') {
        // Row 2: Repos | Polyglot | overall (3 x 258 + 2 x 13 = 800px)
        const boxW = 258;
        const boxH = 104;
        const gap = 13;
        elements.push(
          embedSubSvg(
            designGradedStatBox(data.repos, themeId, boxW, boxH, fontId),
            padX,
            y,
            boxW,
            boxH
          )
        );
        elements.push(
          embedSubSvg(
            designGradedStatBox(data.polyglot, themeId, boxW, boxH, fontId),
            padX + (boxW + gap),
            y,
            boxW,
            boxH
          )
        );
        elements.push(
          embedSubSvg(
            designOverallBox(data.overall, themeId, boxW, boxH, fontId, options?.mascot),
            padX + 2 * (boxW + gap),
            y,
            boxW,
            boxH
          )
        );
        y += boxH + 14;
      } else if (rowId === 'r3') {
        // Row 3: streak | longest streak | active days (3 x 258 + 2 x 13 = 800px)
        const boxW = 258;
        const boxH = 104;
        const gap = 13;
        const r3Items = [data.streak, data.longestStreak, data.activeDays];
        r3Items.forEach((metric, idx) => {
          const bx = padX + idx * (boxW + gap);
          elements.push(
            embedSubSvg(
              designStreakBox(metric, themeId, boxW, boxH, fontId),
              bx,
              y,
              boxW,
              boxH
            )
          );
        });
        y += boxH + 14;
      } else if (rowId === 'r4') {
        // Row 4: contributions last year (800 x 166)
        elements.push(
          embedSubSvg(
            designContributionsBox(data.contributions, themeId, fontId),
            padX,
            y,
            800,
            166
          )
        );
        y += 166 + 14;
      }
    });

    y += 14;
  };

  // Iterate through ordered sections, coalescing adjacent github_stats & streak_trophies
  const processedStatsIndices = new Set<number>();

  for (let i = 0; i < sections.length; i++) {
    if (processedStatsIndices.has(i)) continue;
    const sec = sections[i];

    if (sec === 'pinned_projects') {
      const projects = (data.projects || []).slice(0, 6);
      if (projects.length > 0) {
        renderSectionHeading('Pinned projects');
        const cardW = 256;
        const cardH = 96;
        const colGap = 16; // 256 * 3 + 16 * 2 = 800px
        const rowGap = 14;

        projects.forEach((proj, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const px = padX + col * (cardW + colGap);
          const py = y + row * (cardH + rowGap);
          elements.push(
            embedSubSvg(
              designPinnedProjectCard(proj, themeId, cardW, cardH, fontId),
              px,
              py,
              cardW,
              cardH
            )
          );
        });

        const numRows = Math.ceil(projects.length / 3);
        y += numRows * cardH + (numRows - 1) * rowGap + 28;
      }
    } else if (sec === 'tech_stack') {
      renderSectionHeading('Languages');
      elements.push(
        embedSubSvg(
          designLanguagesBarCard(data.languages, themeId, fontId),
          padX,
          y,
          800,
          58
        )
      );
      y += 58 + 28;
    } else if (sec === 'github_stats' || sec === 'streak_trophies') {
      const rowsToRender: string[] = [];
      let j = i;
      while (
        j < sections.length &&
        (sections[j] === 'github_stats' || sections[j] === 'streak_trophies')
      ) {
        processedStatsIndices.add(j);
        if (sections[j] === 'github_stats') {
          rowsToRender.push('r1', 'r2');
        } else {
          rowsToRender.push('r3', 'r4');
        }
        j++;
      }
      renderStatsRows(rowsToRender);
    } else if (sec === 'bio') {
      const bioLines: Array<{ label: string; value: string }> = [];
      if (options?.bio?.workingOn) {
        bioLines.push({
          label: 'Currently working on:',
          value: options.bio.workingOn,
        });
      }
      if (options?.bio?.learning) {
        bioLines.push({
          label: 'Currently learning:',
          value: options.bio.learning,
        });
      }
      if (options?.bio?.askMeAbout) {
        bioLines.push({
          label: 'Ask me about:',
          value: options.bio.askMeAbout,
        });
      }
      if (options?.bio?.funFact) {
        bioLines.push({
          label: 'Fun fact:',
          value: options.bio.funFact,
        });
      }
      if (options?.bio?.focusAreas && options.bio.focusAreas.length > 0) {
        bioLines.push({
          label: 'Focus areas:',
          value: options.bio.focusAreas.join(' · '),
        });
      }
      if (bioLines.length === 0 && data.profile.bio) {
        bioLines.push({
          label: 'Bio:',
          value: data.profile.bio,
        });
      }
      if (bioLines.length === 0) {
        bioLines.push({
          label: 'Focus areas:',
          value: 'Open-Source · Systems Architecture · Developer Tooling',
        });
      }

      renderSectionHeading('About me');
      const bioCardH = 28 + bioLines.length * 26;
      const bioItemsSvg = bioLines
        .map((item, idx) => {
          const ly = 30 + idx * 26;
          return `<text x="20" y="${ly}" class="canvas-bio-line"><tspan font-weight="700" fill="${theme.textPrimary}">${escapeXml(item.label)}</tspan> <tspan fill="${theme.textSecondary}">${escapeXml(truncateText(item.value, 72))}</tspan></text>`;
        })
        .join('\n  ');

      elements.push(`<g transform="translate(${padX}, ${y})">
  <rect width="800" height="${bioCardH}" rx="${theme.borderRadius}" fill="${theme.cardBg}" stroke="none" />
  ${bioItemsSvg}
</g>`);
      y += bioCardH + 28;
    }
  }

  const totalHeight = Math.max(180, y + 6);
  const fullName = escapeXml(data.profile.name || data.profile.username);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${totalHeight}" viewBox="0 0 ${canvasWidth} ${totalHeight}" fill="none" role="img" aria-label="${fullName}'s GitHub Profile">
  <defs>
    <style>
      ${getSvgFontImport(font)}
      ${getMascotAnimationStyles(theme.mascot, themeId)}
      .canvas-section-title { font: 700 20px ${font.fontFamily}; fill: ${theme.textPrimary}; }
      .canvas-tagline { font: 400 14px ${font.fontFamily}; fill: ${theme.textSecondary}; }
      .canvas-bio-line { font: 400 13.5px ${font.fontFamily}; }
    </style>
  </defs>

  <!-- Master Profile Canvas Background -->
  <rect x="1" y="1" width="${canvasWidth - 2}" height="${totalHeight - 2}" rx="18" fill="${theme.cardBgGradientEnd}" stroke="${theme.border}" stroke-width="1.5" />
  ${renderFloatingBackgroundHats(themeId, canvasWidth, totalHeight, true, options?.mascot)}

  ${elements.join('\n\n  ')}
</svg>`;
}
