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
  const q = db.questions.find(q => q.type === 'fill_in_the_blank' && q.text.includes('Output yang dihasilkan adalah'));
  console.log(JSON.stringify(q, null, 2));
})
.catch(console.error);
