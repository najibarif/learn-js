import { Redis } from "@upstash/redis";

export type QuestionType = 'mcq' | 'boolean' | 'multi_select' | 'fill_in_the_blank' | 'drag_drop' | 'match' | 'poll';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  image?: string;
  order?: number;
  timeLimit: number;
  options: Option[];
  explanation?: string;
  code?: string;
  metadata?: any;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  joinCode: string;
  isActive: boolean;
  status: 'waiting' | 'live' | 'finished';
  createdAt: string;
}

export interface Attempt {
  id: string;
  quizId: string;
  studentName: string;
  totalScore: number;
  streak: number;
  lastAnswerCorrect: boolean;
  isReady: boolean;
  avatar?: string;
  startedAt: string;
  finishedAt?: string;
}

export interface Answer {
  id: string;
  attemptId: string;
  questionId: string;
  optionId?: string;
  optionIds?: string[];
  textValue?: string;
  dynamicAnswer?: any;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: string;
}

export interface DbSchema {
  quizzes: Quiz[];
  questions: Question[];
  attempts: Attempt[];
  answers: Answer[];
}

// Upstash Redis Client Configuration
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn("⚠️  WARNING: Upstash Redis credentials (URL/TOKEN) are missing in environment variables!");
  console.warn("If running locally, please add them to your .env.local file.");
}

export const redis = new Redis({
  url: redisUrl || "http://localhost", // Placeholder to prevent crash, will fail gracefully in try-catch
  token: redisToken || "",
});

const DB_KEY = "learnjs_quiz_db";

export async function getDb(): Promise<DbSchema> {
  // Safeguard if redis is not properly configured locally
  if (!redisUrl || redisUrl === "" || redisUrl === "http://localhost") {
    return { quizzes: [], questions: [], attempts: [], answers: [] };
  }

  try {
    const data = await redis.get<DbSchema>(DB_KEY);
    if (!data) {
      return {
        quizzes: [],
        questions: [],
        attempts: [],
        answers: []
      };
    }
    // Ensure all arrays exist
    return {
      quizzes: data.quizzes || [],
      questions: data.questions || [],
      attempts: data.attempts || [],
      answers: data.answers || []
    };
  } catch (err) {
    console.error("Redis Get Error:", err);
    return { quizzes: [], questions: [], attempts: [], answers: [] };
  }
}

export async function saveDb(newDb: DbSchema): Promise<void> {
  if (!redisUrl || redisUrl === "" || redisUrl === "http://localhost") {
    console.warn("Skipping saveDb: Redis not configured.");
    return;
  }
  try {
    await redis.set(DB_KEY, newDb);
  } catch (err) {
    console.error("Redis Store Error:", err);
  }
}
