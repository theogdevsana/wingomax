import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

function getCloudHistoryPeriod(period: string) {
  const normalized = period.toLowerCase();
  if (["30", "30s", "30sec", "30secs"].includes(normalized)) return "30";
  return "1m";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ period: string }> }
) {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ status: "error", message: "Unauthorized access" }, { status: 401 });
  }

  const { period } = await params;
  const targetPeriod = getCloudHistoryPeriod(period || "1m");
  const api = `https://cloud-apis.com/history/${targetPeriod}`;

  try {
    const res = await fetch(api, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
