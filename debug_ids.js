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
  
  const quizId = 'b2914953-fc40-4b4d-8dd0-92d312f48ee6'; // From screenshot URL
  const quizQuestions = db.questions.filter(q => q.quizId === quizId);
  console.log("Quiz ID from URL:", quizId);
  console.log("Questions for this Quiz ID:", quizQuestions.length);
  
  if (quizQuestions.length === 0) {
    console.log("Sample Question Quiz IDs:", [...new Set(db.questions.map(q => q.quizId))]);
  }
}

main();
