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

async function getSubmissionsList() {
  if (isRedisAvailable) {
    try {
      const data = await redis.get<any[]>(SUBMISSIONS_KEY);
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

async function saveSubmissionsList(list: any[]) {
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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const groupName = formData.get("groupName") as string;
    const membersString = formData.get("members") as string;
    const file = formData.get("file") as File;

    if (!groupName || !membersString || !file) {
      return NextResponse.json(
        { error: "Semua input (nama kelompok, anggota, dan file tugas) wajib diisi." },
        { status: 400 }
      );
    }

    const members = membersString
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    if (members.length === 0) {
      return NextResponse.json(
        { error: "Anggota kelompok harus berisi minimal 1 nama." },
        { status: 400 }
      );
    }

    // Convert file to Base64 string to avoid writing to read-only disk on Vercel
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const submissionId = crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      groupName,
      members,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileData: base64Data, // Stored directly in the database/JSON
      submittedAt: new Date().toISOString(),
    };

    const submissions = await getSubmissionsList();
    submissions.push(newSubmission);
    await saveSubmissionsList(submissions);

    return NextResponse.json({
      success: true,
      submission: {
        id: newSubmission.id,
        groupName: newSubmission.groupName,
        members: newSubmission.members,
        fileName: newSubmission.fileName,
        fileSize: newSubmission.fileSize,
        submittedAt: newSubmission.submittedAt,
      },
    });
  } catch (err: any) {
    console.error("Error in POST /api/submissions:", err);
    return NextResponse.json(
      { error: err.message || "Gagal mengunggah tugas." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await getSubmissionsList();
    
    // EXCLUDE the heavy fileData (Base64 string) from the list view response to keep it small and fast!
    const lightSubmissions = submissions.map((sub: any) => ({
      id: sub.id,
      groupName: sub.groupName,
      members: sub.members,
      fileName: sub.fileName,
      fileSize: sub.fileSize,
      submittedAt: sub.submittedAt,
      // We serve a custom download API path
      filePath: `/api/submissions/download?id=${sub.id}`,
    }));

    return NextResponse.json(lightSubmissions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
