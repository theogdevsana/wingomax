import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramLink } = body;

    if (!telegramLink) {
      return NextResponse.json({ status: "error", msg: "Telegram link is required" }, { status: 400 });
    }

    const existing = await query('SELECT id FROM settings LIMIT 1');
    if (existing.rows.length > 0) {
      await query('UPDATE settings SET telegram_link = $1 WHERE id = $2', [telegramLink, existing.rows[0].id]);
    } else {
      await query('INSERT INTO settings (telegram_link) VALUES ($1)', [telegramLink]);
    }

    return NextResponse.json({ status: "success", msg: "Settings updated successfully", data: { subscription_link: telegramLink } });
  } catch (error) {
    return NextResponse.json({ status: "error", msg: "Failed to update settings" }, { status: 500 });
  }
}
