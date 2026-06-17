import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    const telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";

    return NextResponse.json({ status: "success", data: { subscription_link: telegramLink } });
  } catch (error) {
    return NextResponse.json({ status: "error", msg: "Failed to fetch settings" }, { status: 500 });
  }
}
