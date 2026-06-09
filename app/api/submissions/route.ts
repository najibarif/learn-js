import { NextResponse } from "next/server";
import {
  getSubmissionsList,
  saveSubmissionsList,
  getAssignmentsList,
  Submission
} from "@/lib/submissions-db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const groupName = formData.get("groupName") as string;
    const membersString = formData.get("members") as string;
    const assignmentId = formData.get("assignmentId") as string;
    const file = formData.get("file") as File;

    if (!groupName || !membersString || !assignmentId || !file) {
      return NextResponse.json(
        { error: "Semua input (nama kelompok, anggota, target tugas, dan file tugas) wajib diisi." },
        { status: 400 }
      );
    }

    const assignments = await getAssignmentsList();
    const targetAssignment = assignments.find(a => a.id === assignmentId);
    if (!targetAssignment) {
      return NextResponse.json(
        { error: "Folder tugas yang Anda pilih tidak valid atau telah dihapus." },
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
    const newSubmission: Submission = {
      id: submissionId,
      assignmentId,
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
        assignmentId: newSubmission.assignmentId,
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");

    let submissions = await getSubmissionsList();

    // Filter by assignmentId if provided
    if (assignmentId) {
      submissions = submissions.filter((sub) => sub.assignmentId === assignmentId);
    }
    
    // EXCLUDE the heavy fileData (Base64 string) from the list view response to keep it small and fast!
    const lightSubmissions = submissions.map((sub: any) => ({
      id: sub.id,
      assignmentId: sub.assignmentId,
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
