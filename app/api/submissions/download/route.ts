import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const SUBMISSIONS_KEY = "learnjs_submissions";

const redis = new Redis({
  url: redisUrl || "http://localhost",
  token: redisToken || "",
});

const isRedisAvailable = !!(redisUrl && redisUrl !== "http://localhost" && redisToken);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    let submissions = [];
    if (isRedisAvailable) {
      try {
        submissions = (await redis.get<any[]>(SUBMISSIONS_KEY)) || [];
      } catch (e) {
        console.error("Redis read error on download:", e);
      }
    }

    if (submissions.length === 0) {
      // Try local fallback
      try {
        const filePath = path.join(process.cwd(), "submissions.json");
        if (fs.existsSync(filePath)) {
          submissions = JSON.parse(fs.readFileSync(filePath, "utf8"));
        }
      } catch (e) {}
    }

    const submission = submissions.find((s: any) => s.id === id);
    if (!submission || !submission.fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Convert Base64 back to binary buffer
    const buffer = Buffer.from(submission.fileData, "base64");

    // Serve binary file response
    return new Response(buffer, {
      headers: {
        "Content-Type": submission.fileType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${submission.fileName}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
