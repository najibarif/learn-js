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
  
  console.log("Total Answers:", db.answers.length);
  console.log("Last 5 Answers:", JSON.stringify(db.answers.slice(-5), null, 2));
  
  const tatang = db.attempts.find(a => a.studentName.toLowerCase() === 'tatang');
  if (tatang) {
    const tatangAnswers = db.answers.filter(ans => ans.attemptId === tatang.id);
    console.log("Tatang ID:", tatang.id);
    console.log("Tatang Answers Count:", tatangAnswers.length);
    console.log("Tatang Correct Answers Count:", tatangAnswers.filter(a => a.isCorrect).length);
  }
}

main();
