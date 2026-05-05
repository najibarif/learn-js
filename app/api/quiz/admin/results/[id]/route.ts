import { NextResponse } from 'next/server';
import { getDb, Attempt, Answer, Question } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const quizId = resolvedParams.id;
    const db = await getDb();

    const quiz = db.quizzes.find(q => q.id === quizId);
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

    const questions: Question[] = db.questions
      .filter(q => q.quizId === quizId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      
    const attempts: Attempt[] = db.attempts.filter(a => a.quizId === quizId);
    
    // Enrich attempts with detailed answers
    const detailedResults = attempts.map((attempt: Attempt) => {
      const studentAnswers = (db.answers || []).filter((ans: Answer) => ans.attemptId === attempt.id);
      
      const analysis = questions.map((q: Question) => {
        const ans = studentAnswers.find((a: Answer) => a.questionId === q.id);
        let humanReadableAnswer = "Tidak dijawab";

        if (ans) {
          if (q.type === 'mcq' || q.type === 'boolean') {
            const opt = q.options.find(o => o.id === ans.optionId);
            humanReadableAnswer = opt ? opt.text : (ans.textValue || ans.optionId || "Pilihan dihapus");
          } else if (q.type === 'multi_select') {
            // Try matching by stored optionIds or fallback to textValue
            const opted = q.options.filter(o => ans.optionIds?.includes(o.id));
            const texts = opted.length > 0 ? opted.map(o => o.text) : (ans.textValue ? ans.textValue.split(", ") : []);
            humanReadableAnswer = texts.length > 0 ? texts.join(", ") : "Tidak ada yang dipilih";
          } else if (q.type === 'fill_in_the_blank') {
            humanReadableAnswer = Array.isArray(ans.dynamicAnswer) ? ans.dynamicAnswer.join(", ") : (ans.textValue || "Kosong");
          } else if (q.type === 'drag_drop') {
             // Map dynamicAnswer [{itemId, targetId}] to human readable
             const items = q.metadata?.items || [];
             const targets = q.metadata?.targets || [];
             humanReadableAnswer = (ans.dynamicAnswer || []).length > 0 
                ? (ans.dynamicAnswer || []).map((da: any) => {
                    const item = items.find((i: any) => i.id === da.itemId);
                    const target = targets.find((t: any) => t.id === da.targetId);
                    return `${item?.text || 'Kartu'} → ${target?.text || 'Slot'}`;
                  }).join(" | ")
                : "Tidak ada interaksi";
          } else if (q.type === 'match') {
             const items = q.metadata?.items || [];
             humanReadableAnswer = (ans.dynamicAnswer || []).length > 0
                ? (ans.dynamicAnswer || []).map((da: any) => {
                    const left = items.find((i: any) => i.id === da.leftId);
                    const right = items.find((i: any) => i.id === da.rightId);
                    return `${left?.text} 🔗 ${right?.text}`;
                  }).join(" | ")
                : "Tidak ada pasangan";
          } else if (q.type === 'poll') {
             const opt = q.options.find(o => o.id === ans.optionId);
             humanReadableAnswer = opt ? opt.text : (ans.textValue || "Kosong");
          }
        }

        if (ans && !humanReadableAnswer) humanReadableAnswer = "Jawaban Kosong";

        // AUTO-FEEDBACK GENERATOR (If no manual explanation provided)
        let finalExplanation = q.explanation;
        if (!finalExplanation && ans && !ans.isCorrect) {
          if (q.type === 'mcq' || q.type === 'boolean') {
            const correctOpt = q.options.find(o => o.isCorrect);
            finalExplanation = `Jawaban Anda kurang tepat. Pilihan yang benar adalah "${correctOpt?.text}".`;
          } else if (q.type === 'multi_select') {
            const correctOpts = q.options.filter(o => o.isCorrect).map(o => o.text);
            const studentSelected = q.options.filter(o => ans.optionIds?.includes(o.id)).map(o => o.text);
            
            const missing = correctOpts.filter(x => !studentSelected.includes(x));
            const wrongExtra = studentSelected.filter(x => !correctOpts.includes(x));

            if (wrongExtra.length > 0 && missing.length > 0) {
              finalExplanation = `Campuran: Anda memilih yang salah (${wrongExtra.join(", ")}) dan melewatkan pilihan benar (${missing.join(", ")}).`;
            } else if (missing.length > 0) {
              finalExplanation = `Kurang lengkap: Anda melewatkan pilihan benar yaitu "${missing.join(", ")}".`;
            } else if (wrongExtra.length > 0) {
              finalExplanation = `Kelebihan: Pilihan "${wrongExtra.join(", ")}" sebenarnya tidak termasuk jawaban benar.`;
            }
          } else if (q.type === 'fill_in_the_blank') {
            const correctTexts = q.options.map(o => o.text);
            finalExplanation = `Cek kembali ejaan atau tanda baca Anda. Jawaban yang diminta adalah: "${correctTexts.join(" / ")}".`;
          } else if (q.type === 'match' || q.type === 'drag_drop') {
            finalExplanation = "Pasangan atau penempatan item belum sesuai. Silakan tinjau kembali hubungan antar konsep tersebut.";
          }
        }

        return {
          questionId: q.id,
          questionText: q.text,
          questionType: q.type,
          isAnswered: !!ans,
          isCorrect: ans?.isCorrect || false,
          studentAnswer: humanReadableAnswer,
          timeSpent: ans?.timeSpent || 0,
          explanation: finalExplanation,
          correctAnswer: q.type === 'mcq' || q.type === 'boolean' || q.type === 'multi_select' 
            ? q.options.filter(o => o.isCorrect).map(o => o.text).join(", ")
            : (q.type === 'fill_in_the_blank' ? q.options.map(o => o.text).join(", ") : "Manual")
        };
      });

      return {
        ...attempt,
        analysis
      };
    }).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

    return NextResponse.json({
      success: true,
      quiz: {
        title: quiz.title,
        id: quiz.id
      },
      results: detailedResults,
      questions: questions.map(q => ({ id: q.id, text: q.text, type: q.type }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
