import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: quizId } = await params;
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attemptId');

    if (!attemptId) {
      return NextResponse.json({ error: 'attemptId is required' }, { status: 400 });
    }

    const db = await getDb();

    const attempt = db.attempts.find(a => a.id === attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Always rely on the attempt's recorded quizId to guarantee consistency
    const quiz = db.quizzes.find(q => q.id === attempt.quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const baseQuestions = db.questions.filter(q => q.quizId === attempt.quizId).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    
    // Seeded shuffle to match what the student saw
    const shuffleForUser = (arr: any[], seed: string): any[] => {
      const result = [...arr];
      let s = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      for (let i = result.length - 1; i > 0; i--) {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        const j = Math.abs(s) % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };
    const questions = shuffleForUser(baseQuestions, attemptId);
    
    const myAnswers = db.answers.filter(a => a.attemptId === attemptId);

    // Build detailed result per question
    const results = questions.map((q, idx) => {
      const answer = myAnswers.find(a => a.questionId === q.id);

      // Find the correct answer text for display
      let correctAnswerText = '';
      if (q.type === 'mcq' || q.type === 'boolean') {
        const correct = q.options.find((o: any) => o.isCorrect);
        correctAnswerText = correct?.text ?? '';
      } else if (q.type === 'multi_select') {
        correctAnswerText = q.options.filter((o: any) => o.isCorrect).map((o: any) => o.text).join(', ');
      } else if (q.type === 'fill_in_the_blank') {
        correctAnswerText = q.options.map((o: any) => o.text).join(', ');
      } else if (q.type === 'drag_drop') {
        let targets = q.metadata?.targets || [];
        const items = q.metadata?.items || [];
        
        // Self-heal targets if missing
        const expectedCount = ((q.text || "") + (q.code || "")).match(/___/g)?.length || 0;
        if (targets.length === 0 && expectedCount > 0) {
           targets = Array.from({ length: expectedCount }, (_, i) => ({ id: `slot-${i}`, text: `Slot ${i+1}` }));
        }

        correctAnswerText = targets.map((t: any) => {
          const correctItem = items.find((i: any) => i.correctTargetId === t.id);
          return correctItem ? `${correctItem.text} → ${t.text}` : null;
        }).filter(Boolean).join(' | ');
      } else if (q.type === 'match') {
        const items = q.metadata?.items || [];
        const pairs = q.metadata?.pairs || [];
        correctAnswerText = pairs.map((p: any) => {
          const left = items.find((i: any) => i.id === p.id);
          const right = items.find((i: any) => i.id === p.right);
          return `${left?.text} ↔ ${right?.text}`;
        }).join(' | ');
      } else if (q.type === 'poll') {
        correctAnswerText = '(Soal opini)';
      }

      // Resolve submitted answer text (poll stores optionId, not textValue)
      let submittedAnswerText = answer?.textValue ?? null;
      if (!submittedAnswerText && answer?.optionId && q.type === 'poll') {
        const chosenOption = q.options.find((o: any) => o.id === answer.optionId);
        submittedAnswerText = chosenOption?.text ?? null;
      }
      // Also handle mcq/boolean that might have stored ID instead of text
      if (!submittedAnswerText && answer?.optionId && (q.type === 'mcq' || q.type === 'boolean')) {
        const chosenOption = q.options.find((o: any) => o.id === answer.optionId);
        submittedAnswerText = chosenOption?.text ?? null;
      }

      return {
        questionNumber: idx + 1,
        questionId: q.id,
        questionText: q.text,
        code: q.code ?? null,
        questionType: q.type,
        explanation: q.explanation ?? null,
        submittedAnswer: submittedAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: answer?.isCorrect ?? false,
        isAnswered: !!answer,
        timeSpent: answer?.timeSpent ?? 0,
      };
    });

    const correctCount = results.filter(r => r.isCorrect).length;
    const answeredCount = results.filter(r => r.isAnswered).length;

    return NextResponse.json({
      success: true,
      quiz: { title: quiz.title, id: quiz.id },
      attempt: {
        id: attempt.id,
        studentName: attempt.studentName,
        avatar: attempt.avatar,
        totalScore: attempt.totalScore,
        streak: attempt.streak,
      },
      results,
      summary: {
        total: questions.length,
        answered: answeredCount,
        correct: correctCount,
        incorrect: answeredCount - correctCount,
        unanswered: questions.length - answeredCount,
        accuracy: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching my result:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
