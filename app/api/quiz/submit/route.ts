import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { attemptId, answers } = await request.json();

    if (!attemptId) {
      return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 });
    }

    const db = await getDb();
    
    // Cari attempt siswa
    const attempt = db.attempts.find(a => a.id === attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    if (attempt.finishedAt) {
      return NextResponse.json({ error: 'Attempt already submitted' }, { status: 400 });
    }

    // JIKA 'answers' dikirim (metode lama / fallback), kita hitung skornya.
    // JIKA 'answers' kosong (metode baru/real-time), kita biarkan skor yang sudah ada.
    if (Array.isArray(answers) && answers.length > 0) {
      const quizQuestions = db.questions.filter(q => q.quizId === attempt.quizId);
      let totalScore = 0;
      const BASE_SCORE = 1000;

      for (const ans of answers) {
        const q = quizQuestions.find(qq => qq.id === ans.questionId);
        if (!q) continue;

        const correctOption = q.options.find(o => o.isCorrect);
        if (correctOption && correctOption.id === ans.optionId) {
          const maxTime = q.timeLimit * 1000;
          const timeSpent = Math.min(ans.timeSpent, maxTime);
          const speedBonus = Math.floor(500 * (1 - (timeSpent / maxTime)));
          totalScore += (BASE_SCORE + Math.max(0, speedBonus));
        }
      }
      attempt.totalScore = totalScore;
    }

    // Set waktu selesai
    attempt.finishedAt = new Date().toISOString();
    await saveDb(db);

    return NextResponse.json({ 
      success: true, 
      score: attempt.totalScore 
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
