import { NextResponse } from 'next/server';
import { getDb, saveDb, Question, Option } from '@/lib/db';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const quizId = resolvedParams.id;
    const { questions: questionsRaw } = await request.json();

    if (!Array.isArray(questionsRaw)) {
      return NextResponse.json({ error: 'Questions must be an array' }, { status: 400 });
    }

    const db = await getDb();
    
    const quizExists = db.quizzes.some(q => q.id === quizId);
    if (!quizExists) {
      return NextResponse.json({ 
        error: `Kuis dengan ID "${quizId}" tidak ditemukan di database Redis. Pastikan Anda telah membuat kuis baru setelah migrasi.`,
        success: false 
      }, { status: 404 });
    }

    // Replace existing questions for this quiz
    db.questions = db.questions.filter(q => q.quizId !== quizId);

    const newQuestions: Question[] = questionsRaw.map((q: any, i: number) => {
      return {
        id: q.id || crypto.randomUUID(),
        quizId,
        type: q.type || 'mcq',
        text: q.text,
        image: q.image || q.mediaUrl || null,
        timeLimit: q.timeLimit || 30,
        code: q.code || null,
        order: i,
        metadata: q.metadata || {},
        options: (q.options || []).map((o: any): Option => ({
          id: o.id || crypto.randomUUID(),
          text: o.text || "",
          isCorrect: !!o.isCorrect
        }))
      };
    });

    db.questions.push(...newQuestions);
    await saveDb(db);

    return NextResponse.json({ success: true, count: newQuestions.length });
  } catch (error) {
    console.error('Error saving quiz questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
