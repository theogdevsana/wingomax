import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

function generateHistory(period: string, count = 15) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const secondsPerPeriod = period === "30" ? 30 : 60;
  const startTime = new Date();
  startTime.setHours(5, 30, 0, 0);

  const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  const totalPeriods = Math.floor(elapsedSeconds / secondsPerPeriod);

  const history = [];
  for (let i = 0; i < count; i++) {
    const periodNum = totalPeriods - i;
    if (periodNum <= 0) break;

    const number = Math.floor(Math.random() * 10);
    const colors = ["red", "green", "violet"];
    let color: string;
    if (number === 0) color = "red";
    else if (number === 5) color = "green";
    else if ([1, 3, 7, 9].includes(number)) color = "green";
    else if ([2, 4, 6, 8].includes(number)) color = "red";
    else color = "violet";

    const periodStr = `${year}${month}${day}1000020${String(periodNum).padStart(3, '0')}`;

    history.push({
      period: periodStr,
      number,
      colour: colors.includes(color) ? color : "violet",
      size: number >= 5 ? "Big" : "Small",
    });
  }

  return history;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ status: "error", message: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawPeriod = searchParams.get("period") || "1m";
  const normalized = rawPeriod.toLowerCase();
  const period = ["30", "30s", "30sec", "30secs"].includes(normalized) ? "30" : "1m";

  const history = generateHistory(period);

  return NextResponse.json({ history });
}
