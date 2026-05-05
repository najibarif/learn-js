import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const db = await getDb();
    
    const quiz = db.quizzes.find(q => q.id === resolvedParams.id || q.joinCode.toLowerCase() === resolvedParams.id.toLowerCase());
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const questions = db.questions.filter(q => q.quizId === quiz.id);

    return NextResponse.json({ success: true, quiz, questions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { title, description } = await request.json();
    const db = await getDb();

    const quiz = db.quizzes.find(q => q.id === resolvedParams.id);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;

    await saveDb(db);
    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const db = await getDb();

    const quizIndex = db.quizzes.findIndex(q => q.id === resolvedParams.id);
    if (quizIndex === -1) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    db.quizzes.splice(quizIndex, 1);
    db.questions = db.questions.filter(q => q.quizId !== resolvedParams.id);
    db.attempts  = db.attempts.filter(a => a.quizId !== resolvedParams.id);

    await saveDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
