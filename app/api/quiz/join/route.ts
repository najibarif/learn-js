import { NextResponse } from 'next/server';
import { getDb, saveDb, Attempt } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'Code is required' }, { status: 400 });

    const db = await getDb();
    const quiz = db.quizzes.find(q => q.joinCode.toLowerCase() === code.toLowerCase() && q.isActive);
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    const questions = db.questions.filter(q => q.quizId === quiz.id);

    // Get number of ready/total students for the lobby
    const attempts = db.attempts.filter(a => a.quizId === quiz.id);
    const readyCount = attempts.filter(a => a.isReady).length;
    const totalCount = attempts.length;

    return NextResponse.json({ 
      success: true, 
      quiz, 
      questions,
      lobbyStats: { readyCount, totalCount }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { joinCode, studentName } = await request.json();
    if (!joinCode || !studentName) return NextResponse.json({ error: 'Kode kuis dan Nama harus diisi' }, { status: 400 });

    const db = await getDb();
    const quiz = db.quizzes.find(q => q.joinCode.toLowerCase() === joinCode.toLowerCase() && q.isActive);
    if (!quiz) return NextResponse.json({ error: 'Kuis tidak ditemukan.' }, { status: 404 });

    const nameCleanup = studentName.trim().toLowerCase();
    const isNameTaken = db.attempts.some(a => a.quizId === quiz.id && a.studentName.trim().toLowerCase() === nameCleanup);
    if (isNameTaken) return NextResponse.json({ error: 'Nama ini sudah digunakan.' }, { status: 403 });

    const newAttempt: Attempt = {
      id: crypto.randomUUID(),
      quizId: quiz.id,
      studentName: studentName.trim(),
      totalScore: 0,
      streak: 0,
      lastAnswerCorrect: false,
      isReady: false, // Default NOT ready
      startedAt: new Date().toISOString()
    };

    db.attempts.push(newAttempt);
    await saveDb(db);

    return NextResponse.json({ success: true, attemptId: newAttempt.id, quizId: quiz.id });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal bergabung.' }, { status: 500 });
  }
}
