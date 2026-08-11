import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:admin@sdnbobong.sch.id',
    vapidPublicKey,
    vapidPrivateKey
  );
}

// In-memory array of active push subscriptions
let subscriptions: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const { subscription, nip } = await req.json();
    if (!subscription) {
      return NextResponse.json({ success: false, error: 'Subscription is required' }, { status: 400 });
    }

    const exists = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
    if (!exists) {
      subscriptions.push({ ...subscription, nip });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get('title') || 'SDN Bobong Info';
    const message = url.searchParams.get('message') || 'Ada pemberitahuan penting hari ini.';

    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/assets/logo-sdn-bobong.png'
    });

    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub, payload);
          return { endpoint: sub.endpoint, status: 'success' };
        } catch (err: any) {
          console.error('[Web Push Notification Error]', err);
          return { endpoint: sub.endpoint, status: 'failed', error: err.message };
        }
      })
    );

    return NextResponse.json({ success: true, subscriptionsCount: subscriptions.length, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
