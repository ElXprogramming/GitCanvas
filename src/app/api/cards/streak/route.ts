import { NextRequest, NextResponse } from 'next/server';
import { fetchUserStreakStats } from '@/lib/github-stats';
import { renderStreakSvgCard } from '@/lib/svg-cards';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = (searchParams.get('username') || searchParams.get('user'))?.trim();

    if (!username) {
      return new NextResponse(
        `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="60"><rect width="350" height="60" fill="#2d1b1b" rx="8"/><text x="175" y="35" fill="#f87171" font-family="sans-serif" font-size="14" text-anchor="middle">Error: username parameter required</text></svg>`,
        {
          status: 400,
          headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
        }
      );
    }

    const theme = searchParams.get('theme') || 'catppuccin_mocha';
    const hideBorder = searchParams.get('hide_border') === 'true';

    const authHeader = req.headers.get('authorization');
    const userToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    const streak = await fetchUserStreakStats(username, userToken);
    const svg = renderStreakSvgCard(streak, username, { theme, hideBorder });

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    console.error('Streak Card SVG Error:', error);
    const errMsg = (error.message || 'Failed to generate streak card').replace(/[<>&]/g, '');
    return new NextResponse(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="70"><rect width="400" height="70" fill="#2d1b1b" rx="8" stroke="#ef4444"/><text x="200" y="40" fill="#fca5a5" font-family="sans-serif" font-size="13" text-anchor="middle">${errMsg}</text></svg>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
