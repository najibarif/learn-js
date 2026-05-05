import { NextResponse } from 'next/server';
import { getDb, saveDb, Quiz, Question } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const db = await getDb();

    // 1. Cari kuis asli
    const originalQuiz = db.quizzes.find(q => q.id === resolvedParams.id);
    if (!originalQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // 2. Ambil semua soal dari kuis asli
    const originalQuestions = db.questions.filter(q => q.quizId === originalQuiz.id);

    // 3. Buat Kuis Baru (Duplikat)
    const newQuizId = crypto.randomUUID();
    const newJoinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newQuiz: Quiz = {
      ...originalQuiz,
      id: newQuizId,
      title: `${originalQuiz.title} (Copy)`,
      joinCode: newJoinCode,
      status: 'waiting',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // 4. Salin semua soal dengan mengaitkannya ke newQuizId
    const newQuestions: Question[] = originalQuestions.map(q => ({
      ...q,
      id: crypto.randomUUID(), // Berikan ID soal baru
      quizId: newQuizId,       // Kaitkan ke kuis hasil salinan
      options: q.options.map(opt => ({
        ...opt,
        id: crypto.randomUUID() // Berikan ID opsi baru
      }))
    }));

    // 5. Simpan ke Database
    db.quizzes.push(newQuiz);
    db.questions.push(...newQuestions);
    
    await saveDb(db);

    return NextResponse.json({ success: true, newId: newQuizId });
  } catch (error) {
    console.error('Error copying quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
