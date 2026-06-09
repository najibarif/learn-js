import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({
  url: redisUrl || "http://localhost",
  token: redisToken || "",
});

const isRedisAvailable = !!(redisUrl && redisUrl !== "http://localhost" && redisToken);

const ASSIGNMENTS_KEY = "learnjs_assignments";
const SUBMISSIONS_KEY = "learnjs_submissions";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  groupName: string;
  members: string[];
  fileName: string;
  fileSize: number;
  fileType: string;
  fileData?: string; // Stored in DB, but omitted in GET listings
  submittedAt: string;
}

export async function getAssignmentsList(): Promise<Assignment[]> {
  if (isRedisAvailable) {
    try {
      const data = await redis.get<Assignment[]>(ASSIGNMENTS_KEY);
      return data || [];
    } catch (e) {
      console.error("Redis error reading assignments:", e);
    }
  }
  
  // Local fallback
  try {
    const filePath = path.join(process.cwd(), "assignments.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Local file error reading assignments:", e);
  }
  return [];
}

export async function saveAssignmentsList(list: Assignment[]): Promise<void> {
  if (isRedisAvailable) {
    try {
      await redis.set(ASSIGNMENTS_KEY, list);
      return;
    } catch (e) {
      console.error("Redis error writing assignments:", e);
    }
  }
  
  // Local fallback
  try {
    const filePath = path.join(process.cwd(), "assignments.json");
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {
    console.error("Local file error writing assignments:", e);
  }
}

export async function getSubmissionsList(): Promise<Submission[]> {
  if (isRedisAvailable) {
    try {
      const data = await redis.get<Submission[]>(SUBMISSIONS_KEY);
      return data || [];
    } catch (e) {
      console.error("Redis error reading submissions, falling back to local:", e);
    }
  }
  
  // Local fallback
  try {
    const filePath = path.join(process.cwd(), "submissions.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Local file error reading submissions:", e);
  }
  return [];
}

export async function saveSubmissionsList(list: Submission[]): Promise<void> {
  if (isRedisAvailable) {
    try {
      await redis.set(SUBMISSIONS_KEY, list);
      return;
    } catch (e) {
      console.error("Redis error writing submissions:", e);
    }
  }
  
  // Local fallback
  try {
    const filePath = path.join(process.cwd(), "submissions.json");
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {
    console.error("Local file error writing submissions:", e);
  }
}
