import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

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
  const targetPeriod = period || "1m";
  const api = `https://acxdev.us.cc/v1/GetGameHistory?period=${targetPeriod}`;

  try {
    const res = await fetch(api, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 10 }, // Cache for 10 seconds to improve performance
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Failed to fetch data" }, { status: 500 });
  }
}
