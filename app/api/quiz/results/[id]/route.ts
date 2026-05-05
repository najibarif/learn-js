import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const attemptId = resolvedParams.id;
    const db = await getDb();

    // 1. Find the specific attempt
    const attempt = db.attempts.find(a => a.id === attemptId);
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

    // 2. Get the quiz and its questions
    const quiz = db.quizzes.find(q => q.id === attempt.quizId);
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

    const questions = db.questions.filter(q => q.quizId === quiz.id);

    // 3. Map student answers to questions
    const analysis = questions.map(q => {
      const ans = db.answers.find(a => a.attemptId === attemptId && a.questionId === q.id);
      
      let humanReadableAnswer = "TIDAK DIJAWAB";
      if (ans) {
         // Try to use existing textValue, otherwise re-resolve from raw data
         if (ans.textValue) {
            humanReadableAnswer = ans.textValue;
         } else {
            // Re-resolution Logic (Legacy/Fallback)
            if (q.type === 'mcq' || q.type === 'boolean') {
              const opt = q.options.find((o: any) => o.id === ans.optionId);
              humanReadableAnswer = opt?.text || "???";
            } else if (q.type === 'multi_select') {
              const opted = q.options.filter((o: any) => ans.optionIds?.includes(o.id));
              humanReadableAnswer = opted.length > 0 ? opted.map((o: any) => o.text).join(", ") : "Tidak ada yang dipilih";
            } else if (q.type === 'fill_in_the_blank') {
              if (Array.isArray(ans.dynamicAnswer)) humanReadableAnswer = ans.dynamicAnswer.join(", ");
              else humanReadableAnswer = ans.dynamicAnswer?.toString() || "Isian Kosong";
            } else if (q.type === 'drag_drop') {
              const items = q.metadata?.items || [];
              const labels = ans.dynamicAnswer?.map((da: any) => {
                const item = items.find((it: any) => it.id === da.itemId);
                return item?.text || "???";
              });
              humanReadableAnswer = labels ? labels.join(", ") : "Penempatan Kosong";
            } else if (q.type === 'match') {
              const items = q.metadata?.items || [];
              const labels = ans.dynamicAnswer?.map((da: any) => {
                const left = items.find((it: any) => it.id === da.leftId);
                const right = items.find((it: any) => it.id === da.rightId);
                return `${left?.text} ↔ ${right?.text}`;
              });
              humanReadableAnswer = labels ? labels.join(" | ") : "Pasangan Kosong";
            } else if (q.type === 'poll') {
              const opt = q.options.find((o: any) => o.id === (ans.optionId || ans.textValue));
              humanReadableAnswer = opt?.text || ans.textValue || "Pilihan Polling";
            } else {
              humanReadableAnswer = `Jawaban Terkirim (Tipe: ${q.type})`;
            }
         }
      }

      let resolvedCorrect = "-";
      if (q.type === 'mcq' || q.type === 'boolean' || q.type === 'multi_select') {
        resolvedCorrect = q.options.filter(o => o.isCorrect).map(o => o.text).join(", ");
      } else if (q.type === 'fill_in_the_blank') {
        resolvedCorrect = q.options.map(o => o.text).join(", ");
      } else if (q.type === 'drag_drop') {
        const items = q.metadata?.items || [];
        const targets = q.metadata?.targets || [];
        const correctLabels = targets.map((t: any) => {
           const item = items.find((i: any) => i.correctTargetId === t.id);
           return item?.text || "???";
        });
        resolvedCorrect = correctLabels.join(", ");
      } else if (q.type === 'match') {
        const items = q.metadata?.items || [];
        const pairs = q.metadata?.pairs || [];
        resolvedCorrect = pairs.map((p: any) => {
           const left = items.find((i: any) => i.id === p.id);
           const right = items.find((i: any) => i.id === p.right);
           return `${left?.text} ↔ ${right?.text}`;
        }).join(" | ");
      } else if (q.type === 'poll') {
        resolvedCorrect = "Hasil Voting";
      }

      return {
        questionText: q.text,
        type: q.type,
        studentAnswer: humanReadableAnswer,
        correctAnswer: resolvedCorrect,
        isCorrect: ans ? ans.isCorrect : false,
        timeSpent: ans ? ans.timeSpent : 0
      };
    });

    // 4. Fetch Leaderboard (Top 5 scores for this quiz)
    const leaderboard = db.attempts
      .filter(a => a.quizId === quiz.id)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5)
      .map(a => ({
        name: a.studentName,
        score: a.totalScore,
        accuracy: Math.round((db.answers.filter(ans => ans.attemptId === a.id && ans.isCorrect).length / questions.length) * 100),
        isCurrent: a.id === attemptId,
        avatar: a.avatar
      }));

    return NextResponse.json({
      success: true,
      quizTitle: quiz.title,
      studentName: attempt.studentName,
      totalScore: attempt.totalScore,
      accuracy: Math.round((analysis.filter(a => a.isCorrect).length / questions.length) * 100),
      leaderboard,
      analysis
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
