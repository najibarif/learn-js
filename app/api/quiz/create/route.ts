import { NextResponse } from 'next/server';
import { getDb, saveDb, Quiz } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = await getDb();
    
    // Generate simple 6-char code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newQuiz: Quiz = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      joinCode,
      isActive: true,
      status: 'waiting', // Start in waiting mode for synchronization
      createdAt: new Date().toISOString()
    };

    db.quizzes.push(newQuiz);
    await saveDb(db);

    return NextResponse.json({ success: true, quiz: newQuiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
