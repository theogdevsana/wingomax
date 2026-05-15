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
    const externalApiUrl = 'https://api.nexapk.in/myapp/user/api.php?action=getPrediction&key=enzo';
    const response = await fetch(externalApiUrl, {
      cache: 'no-store', // Ensure we always get fresh data
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'error', msg: 'External API Error' }, { status: 502 });
    }

    const data = await response.json();

    // 3. Extract and Clean the Response
    if (data && data.predictionResult) {
      const { predictionResult } = data;
      
      // Filter out unwanted fields like lossRecovery
      const cleanResult = {
        gameType: predictionResult.gameType,
        period: predictionResult.period,
        prediction: predictionResult.prediction,
        status: predictionResult.status,
        confidence: predictionResult.confidence,
        skipped: predictionResult.skipped,
        skipReason: predictionResult.skipReason
      };

      return NextResponse.json({
        predictionResult: cleanResult
      });
    }

    return NextResponse.json({ status: 'error', msg: 'Invalid Data Format' }, { status: 500 });

  } catch (error) {
    console.error('Prediction API Error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
