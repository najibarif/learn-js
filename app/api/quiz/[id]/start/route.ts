import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const db = await getDb();

    const quiz = db.quizzes.find(q => q.id === resolvedParams.id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    quiz.status = 'live';
    await saveDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
