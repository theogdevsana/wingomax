import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegramLink } = body;

    if (!telegramLink) {
      return NextResponse.json({ status: "error", msg: "Telegram link is required" }, { status: 400 });
    }

    await connectMongo();
    
    let settings = await Settings.findOne({});
    if (settings) {
      settings.telegramLink = telegramLink;
      await settings.save();
    } else {
      settings = await Settings.create({ telegramLink });
    }

    return NextResponse.json({
      status: "success",
      msg: "Settings updated successfully",
      data: {
        subscription_link: settings.telegramLink,
      }
    });
  } catch (error) {
    return NextResponse.json({ status: "error", msg: "Failed to update settings" }, { status: 500 });
  }
}
