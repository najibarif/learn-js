import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const safeFileName = `${timestamp}-${cleanFileName}`;
    const filePath = path.join(uploadDir, safeFileName);

    // Write file to filesystem
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const submissionId = crypto.randomUUID ? crypto.randomUUID() : `sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      groupName,
      members,
      fileName: file.name,
      fileSize: file.size,
      filePath: `/uploads/${safeFileName}`,
      submittedAt: new Date().toISOString(),
    };

    // Store in submissions.json locally
    const submissionsFilePath = path.join(process.cwd(), "submissions.json");
    let submissions = [];
    if (fs.existsSync(submissionsFilePath)) {
      try {
        const fileContent = fs.readFileSync(submissionsFilePath, "utf8");
        submissions = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error reading submissions.json, initializing empty array:", e);
      }
    }

    submissions.push(newSubmission);
    fs.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      submission: newSubmission,
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
    const submissionsFilePath = path.join(process.cwd(), "submissions.json");
    let submissions = [];
    if (fs.existsSync(submissionsFilePath)) {
      try {
        const fileContent = fs.readFileSync(submissionsFilePath, "utf8");
        submissions = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error reading submissions.json:", e);
      }
    }
    return NextResponse.json(submissions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
