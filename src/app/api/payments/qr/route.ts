import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  const orderId = new URL(request.url).searchParams.get('orderId');
  if (!orderId || orderId.length < 3 || orderId.length > 200) return NextResponse.json({ error: 'Invalid order reference' }, { status: 400 });

  try {
    const result = await query('SELECT qr_code_url FROM payment_orders WHERE order_id = $1', [orderId]);
    const qrCodeUrl = result.rows[0]?.qr_code_url as string | undefined;
    if (!qrCodeUrl) return NextResponse.json({ error: 'QR code not found' }, { status: 404 });

    const qrResponse = await fetch(qrCodeUrl, { signal: AbortSignal.timeout(10_000), cache: 'no-store' });
    if (!qrResponse.ok) return NextResponse.json({ error: 'QR code is unavailable' }, { status: 502 });
    const image = await qrResponse.arrayBuffer();
    return new NextResponse(image, {
      headers: {
        'Content-Type': qrResponse.headers.get('content-type') || 'image/png',
        'Content-Disposition': `attachment; filename="wingo-payment-${orderId}.png"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('QR download failed', error);
    return NextResponse.json({ error: 'QR code is unavailable' }, { status: 500 });
  }
}
