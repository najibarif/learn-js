import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const quizzes = db.quizzes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(quiz => ({
        ...quiz,
        questionCount: db.questions.filter(q => q.quizId === quiz.id).length,
        attemptCount: db.attempts.filter(a => a.quizId === quiz.id).length,
      }));

    return NextResponse.json({ success: true, quizzes });
  } catch (error) {
    console.error('Error listing quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
