import { NextResponse } from "next/server";

const UPSTREAM: Record<string, string> = {
  "30s": "https://cloud-apis.com/v2/history/30s",
  "1m":  "https://cloud-apis.com/v2/history/1m",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "1m";
  const url = UPSTREAM[mode];

  if (!url) {
    return NextResponse.json({ success: false, history: [] }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const data = await res.json();
    const raw: any[] = Array.isArray(data?.history) ? data.history : [];

    const history = raw.slice(0, 10).map((h: any) => ({
      issueNumber: String(h.period  ?? h.issueNumber ?? ""),
      number:      String(h.number  ?? ""),
      color:       String(h.color   ?? ""),
      size:        String(h.size    ?? (parseInt(h.number) >= 5 ? "Big" : "Small")),
    }));

    return NextResponse.json(
      { success: true, history },
      { headers: { "Cache-Control": "no-store, no-cache" } }
    );
  } catch {
    return NextResponse.json({ success: false, history: [] });
  }
}
