import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { status } = await request.json();

    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

    const db = await getDb();
    const quiz = db.quizzes.find(q => q.id === resolvedParams.id);
    
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

    quiz.status = status;
    await saveDb(db);

    return NextResponse.json({ success: true, status: quiz.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
