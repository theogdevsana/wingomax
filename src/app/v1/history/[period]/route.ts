import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

const HISTORY_ENDPOINTS: Record<string, string> = {
  "1m": "https://cloud-apis.com/v2/history/1m",
  "30s": "https://cloud-apis.com/v2/history/30s",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ period: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ status: "error", message: "Unauthorized access" }, { status: 401 });
  }

  const { period: rawPeriod } = await params;
  const normalized = (rawPeriod || "1m").toLowerCase();
  const period = ["30", "30s", "30sec", "30secs"].includes(normalized) ? "30s" : "1m";

  const endpoint = HISTORY_ENDPOINTS[period];
  if (!endpoint) {
    return NextResponse.json({ status: "error", message: "Invalid period" }, { status: 400 });
  }

  try {
    const resp = await fetch(endpoint, { cache: "no-store" });
    if (!resp.ok) throw new Error("External API error");
    const data = await resp.json();
    const history = (data?.history || []).slice(0, 10).map((h: any) => ({
      period: h.period,
      number: h.number,
      size: h.size,
      color: h.color || "",
    }));
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ history: [] });
  }
}
