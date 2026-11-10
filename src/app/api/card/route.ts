import { NextRequest } from 'next/server';
import { GET as getCardItem } from '@/app/api/cards/[item]/route';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return getCardItem(req, { params: { item: 'canvas' } });
}
