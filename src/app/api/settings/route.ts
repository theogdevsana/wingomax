import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export async function GET() {
  try {
    await connectMongo();
    let settings = await Settings.findOne({});
    
    // If no settings exist, create default
    if (!settings) {
      settings = await Settings.create({ telegramLink: "https://t.me/enzosrs" });
    }

    return NextResponse.json({
      status: "success",
      data: {
        subscription_link: settings.telegramLink,
      }
    });
  } catch (error) {
    return NextResponse.json({ status: "error", msg: "Failed to fetch settings" }, { status: 500 });
  }
}
