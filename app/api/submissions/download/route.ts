import { NextResponse } from "next/server";
import { getSubmissionsList } from "@/lib/submissions-db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 });
    }

    const submissions = await getSubmissionsList();
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
