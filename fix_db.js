const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const redisUrl = env.match(/UPSTASH_REDIS_REST_URL=(.*)/)[1].replace(/["']/g, '').trim();
const redisToken = env.match(/UPSTASH_REDIS_REST_TOKEN=(.*)/)[1].replace(/["']/g, '').trim();

fetch(redisUrl + '/get/learnjs_quiz_db', {
  headers: { Authorization: 'Bearer ' + redisToken }
})
.then(r => r.json())
.then(d => {
  const db = JSON.parse(d.result);
  
  // Fix the specific question
  const q = db.questions.find(q => q.type === 'fill_in_the_blank' && q.text.includes('Output yang dihasilkan adalah'));
  if (q && q.options && q.options[0]) {
    q.options[0].text = "12";
    console.log("Updated question options:", q.options);
  }

  // Also fix the user's latest answer so it isCorrect: true
  // Let's find the answers for this question
  const answers = db.answers.filter(a => a.questionId === q.id);
  for (const a of answers) {
     if (a.textValue === "12" || (Array.isArray(a.dynamicAnswer) && a.dynamicAnswer[0] === "12")) {
        a.isCorrect = true;
        console.log("Fixed user answer to true!");
     }
  }

  // Update total score for the attempt
  if (answers.length > 0) {
      const attemptIds = [...new Set(answers.map(a => a.attemptId))];
      for (const attId of attemptIds) {
          const attempt = db.attempts.find(a => a.id === attId);
          if (attempt) {
             const allAttemptAnswers = db.answers.filter(a => a.attemptId === attId && a.isCorrect);
             // Just a simple recalc: 1000 per correct answer for now, or just add 1000
             const oldScore = attempt.totalScore;
             attempt.totalScore += 1000;
             console.log(`Updated attempt ${attId} score from ${oldScore} to ${attempt.totalScore}`);
          }
      }
  }

  // Save back to Redis
  return fetch(redisUrl + '/set/learnjs_quiz_db', {
    method: 'POST',
    headers: { 
      Authorization: 'Bearer ' + redisToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(db)
  }).then(res => res.json()).then(res => console.log("Save Response:", res));
})
.catch(console.error);
