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

    // 2. Fetch Prediction from External API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response: Response;
    try {
      response = await fetch('https://cloud-apis.com/model/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: 'kaelis',
          model_key: 'kaelis.ai/paid/models',
        }),
        cache: 'no-store',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      return NextResponse.json({ status: 'fallback', msg: 'External API down, using local generator' }, { status: 200 });
    }

    const data = await response.json();

    // 3. Extract and Clean the Response
    if (data && data.predictionResult) {
      const { predictionResult } = data;

      const cleanResult = {
        period: predictionResult.period,
        prediction: predictionResult.prediction,
      };

      return NextResponse.json({ predictionResult: cleanResult });
    }

    return NextResponse.json({ status: 'fallback', msg: 'Invalid Data Format, using local generator' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ status: 'fallback', msg: 'Prediction API Timeout, using local generator' }, { status: 200 });
    }
    console.error('Prediction API Error:', error);
    return NextResponse.json({ status: 'fallback', msg: 'Internal Server Error, using local generator' }, { status: 200 });
  }
}
