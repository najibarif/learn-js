import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { attemptId, isReady, avatar } = await request.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 });
    }

    const db = await getDb();
    const attempt = db.attempts.find(a => a.id === attemptId);
    
    if (!attempt) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    attempt.isReady = isReady;
    if (avatar) attempt.avatar = avatar;
    
    await saveDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
