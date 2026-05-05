const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const redisUrl = env.match(/UPSTASH_REDIS_REST_URL=(.*)/)[1].replace(/["']/g, '').trim();
const redisToken = env.match(/UPSTASH_REDIS_REST_TOKEN=(.*)/)[1].replace(/["']/g, '').trim();

async function main() {
  const res = await fetch(redisUrl + '/get/learnjs_quiz_db', {
    headers: { Authorization: `Bearer ${redisToken}` }
  });
  const json = await res.json();
  const db = JSON.parse(json.result);
  
  const tatang = db.attempts.find(a => a.studentName.toLowerCase() === 'tatang');
  const tatangAnswers = db.answers.filter(ans => ans.attemptId === tatang.id);
  
  console.log("Tatang Answers:", tatangAnswers.length);
  
  const orphanAnswers = tatangAnswers.filter(ans => !db.questions.find(q => q.id === ans.questionId));
  console.log("Orphan Answers (Question not found):", orphanAnswers.length);
  
  if (orphanAnswers.length > 0) {
    console.log("Orphan Question IDs:", orphanAnswers.map(a => a.questionId));
    console.log("Sample existing Question IDs:", db.questions.slice(0, 3).map(q => q.id));
  }
}

main();
