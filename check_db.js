const { Redis } = require("@upstash/redis");
require('dotenv').config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function main() {
  const data = await redis.get("learnjs_quiz_db");
  const q = data.questions.find(q => q.type === 'fill_in_the_blank' && q.text.includes('Output yang dihasilkan adalah'));
  console.log(JSON.stringify(q, null, 2));
}

main().catch(console.error);
