import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attemptId, quizId, questionId, optionId, optionIds, textValue, timeSpent, timeLeft, dynamicAnswer } = body;

    const actualAttemptId = attemptId || quizId;
    const actualTimeSpent = timeSpent || 0;

    if (!actualAttemptId || !questionId) {
      return NextResponse.json({ error: 'Missing IDs' }, { status: 400 });
    }

    const db = await getDb();
    const attempt = db.attempts.find((a: any) => a.id === actualAttemptId || a.quizId === actualAttemptId);
    if (!attempt) return NextResponse.json({ error: 'Session not found.' }, { status: 404 });

    const q = db.questions.find((qq: any) => qq.id === questionId);
    if (!q) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    // Normalize data inputs
    let normalizedOptionId = optionId;
    let normalizedOptionIds = optionIds;
    
    if (q.type === 'mcq' || q.type === 'boolean' || q.type === 'poll') {
      if (!normalizedOptionId && dynamicAnswer) normalizedOptionId = Array.isArray(dynamicAnswer) ? dynamicAnswer[0] : dynamicAnswer;
    } else if (q.type === 'multi_select') {
      if (!normalizedOptionIds && dynamicAnswer) normalizedOptionIds = Array.isArray(dynamicAnswer) ? dynamicAnswer : [dynamicAnswer];
    }

    let isCorrect = false;
    let extraResponseData: any = {};

    switch (q.type) {
      case 'mcq':
      case 'boolean': {
        const correctOption = q.options.find((o: any) => o.isCorrect);
        isCorrect = correctOption?.id === normalizedOptionId;
        break;
      }
      case 'multi_select': {
        const correctOptionIds = q.options.filter((o: any) => o.isCorrect).map((o: any) => o.id);
        const submittedIds = normalizedOptionIds || [];
        isCorrect = correctOptionIds.length === (submittedIds?.length || 0) && 
                    correctOptionIds.every(id => submittedIds.includes(id));
        break;
      }
      case 'fill_in_the_blank': {
        const correctTexts = q.options.map((o: any) => o.text.toLowerCase().trim());
        const submittedAnswers = Array.isArray(dynamicAnswer) ? dynamicAnswer : [textValue || ""];
        const submittedTexts = submittedAnswers.map((t: any) => t?.toString().toLowerCase().trim() || "");
        isCorrect = correctTexts.length > 0 && correctTexts.every((txt, i) => txt === (submittedTexts[i] || ""));
        break;
      }
      case 'drag_drop': {
        let targets = q.metadata?.targets || [];
        const items = q.metadata?.items || [];
        
        // Self-heal targets if missing
        const expectedCount = ((q.text || "") + (q.code || "")).match(/___/g)?.length || 0;
        if (targets.length === 0 && expectedCount > 0) {
           targets = Array.from({ length: expectedCount }, (_, i) => ({ id: `slot-${i}`, text: `Slot ${i+1}` }));
        }

        if (targets.length === 0 || !Array.isArray(dynamicAnswer) || dynamicAnswer.length !== targets.length) {
          isCorrect = false;
          break;
        }
        
        isCorrect = targets.every((target: any, idx: number) => {
          const correctItem = items.find((i: any) => i.correctTargetId === target.id);
          if (!correctItem) return true;
          const submittedPair = dynamicAnswer?.find((da: any) => da.targetId === target.id);
          const submittedItem = items.find((i: any) => i.id === submittedPair?.itemId);
          return submittedItem?.text === correctItem.text;
        });
        break;
      }
      case 'match': {
        const items = q.metadata?.items || [];
        const correctPairs = q.metadata?.pairs || [];
        isCorrect = correctPairs.length > 0 && 
                    correctPairs.length === (dynamicAnswer?.length || 0) &&
                    correctPairs.every((cp: any) => {
                      const leftItem = items.find((i: any) => i.id === cp.id);
                      const rightItem = items.find((i: any) => i.id === cp.right);
                      const submittedPair = dynamicAnswer?.find((da: any) => {
                        const sLeft = items.find((si: any) => si.id === da.leftId);
                        const sRight = items.find((si: any) => si.id === da.rightId);
                        return sLeft?.text === leftItem?.text && sRight?.text === rightItem?.text;
                      });
                      return !!submittedPair;
                    });
        break;
      }
      case 'poll': {
        isCorrect = true; 
        const chosenId = (normalizedOptionId || textValue)?.toString();
        if (!q.metadata) q.metadata = {};
        if (!q.metadata.pollResults) q.metadata.pollResults = {};
        q.metadata.pollResults[chosenId] = (q.metadata.pollResults[chosenId] || 0) + 1;
        extraResponseData.latestPollResults = q.metadata.pollResults;
        break;
      }
      default:
        isCorrect = false;
    }

    if (isCorrect && q.type !== 'poll') {
      let scoreForThis = 1000;
      attempt.streak++;
      if (attempt.streak > 1) scoreForThis += (attempt.streak * 150);
      attempt.totalScore += scoreForThis;
      attempt.lastAnswerCorrect = true;
    } else {
      attempt.streak = 0;
      attempt.lastAnswerCorrect = false;
    }

    // Resolve human-readable textValue before saving to prevent loss if IDs change later
    let actualTextValue = textValue;
    if (q.type === 'mcq' || q.type === 'boolean') {
      const opt = q.options.find((o: any) => o.id === normalizedOptionId);
      if (opt) actualTextValue = opt.text;
    } else if (q.type === 'multi_select') {
      const opted = q.options.filter((o: any) => normalizedOptionIds?.includes(o.id));
      if (opted.length > 0) actualTextValue = opted.map((o: any) => o.text).join(", ");
    } else if (q.type === 'fill_in_the_blank') {
      if (Array.isArray(dynamicAnswer)) actualTextValue = dynamicAnswer.join(", ");
      else actualTextValue = textValue || dynamicAnswer?.toString();
    } else if (q.type === 'drag_drop') {
      const items = q.metadata?.items || [];
      const labels = dynamicAnswer?.map((da: any) => {
        const item = items.find((it: any) => it.id === da.itemId);
        return item?.text || "???";
      });
      if (labels) actualTextValue = labels.join(", ");
    } else if (q.type === 'match') {
      const items = q.metadata?.items || [];
      const labels = dynamicAnswer?.map((da: any) => {
        const left = items.find((it: any) => it.id === da.leftId);
        const right = items.find((it: any) => it.id === da.rightId);
        return `${left?.text} ↔ ${right?.text}`;
      });
      if (labels) actualTextValue = labels.join(" | ");
    }

    const answerRecord = {
      id: crypto.randomUUID(),
      attemptId: actualAttemptId,
      questionId,
      optionId: normalizedOptionId,
      optionIds: normalizedOptionIds,
      textValue: actualTextValue,
      dynamicAnswer,
      isCorrect,
      timeSpent: actualTimeSpent,
      createdAt: new Date().toISOString()
    };

    if (!db.answers) db.answers = [];
    db.answers.push(answerRecord);

    await saveDb(db);

    return NextResponse.json({ 
      success: true, 
      isCorrect, 
      newScore: attempt.totalScore,
      streak: attempt.streak,
      ...extraResponseData
    });
  } catch (error) {
    console.error('Error answering question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
