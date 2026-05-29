import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    // 1. JWT Authentication Check
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ status: 'error', msg: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch Prediction from External API with 2.5s timeout
    const externalApiUrl = 'https://api.nexapk.in/myapp/user/api.php?action=getPrediction&key=enzo';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response: Response;
    try {
      response = await fetch(externalApiUrl, {
        cache: 'no-store',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return NextResponse.json({ status: 'error', msg: 'External API Error' }, { status: 502 });
    }

    const data = await response.json();

    // 3. Extract and Clean the Response
    if (data && data.predictionResult) {
      const { predictionResult } = data;

      const cleanResult = {
        gameType: predictionResult.gameType,
        period: predictionResult.period,
        prediction: predictionResult.prediction,
        status: predictionResult.status,
        confidence: predictionResult.confidence,
        skipped: predictionResult.skipped,
        skipReason: predictionResult.skipReason,
      };

      return NextResponse.json({ predictionResult: cleanResult });
    }

    return NextResponse.json({ status: 'error', msg: 'Invalid Data Format' }, { status: 500 });

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ status: 'error', msg: 'Prediction API Timeout' }, { status: 504 });
    }
    console.error('Prediction API Error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
