import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const db = await getDb();
    
    const quizQuestions = db.questions.filter(q => q.quizId === resolvedParams.id);
    const totalQuestions = quizQuestions.length;

    // Ambil SEMUA attempts dan hitung progress
    const attempts = db.attempts
      .filter(a => a.quizId === resolvedParams.id)
      .map(attempt => {
        const answeredCount = db.answers.filter(ans => ans.attemptId === attempt.id).length;
        return {
          ...attempt,
          answeredCount,
          progressPercent: totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json({ success: true, attempts, totalQuestions });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
