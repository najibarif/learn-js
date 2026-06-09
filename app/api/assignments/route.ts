import { NextResponse } from "next/server";
import {
  getAssignmentsList,
  saveAssignmentsList,
  getSubmissionsList,
  saveSubmissionsList,
  Assignment
} from "@/lib/submissions-db";

export async function GET() {
  try {
    const list = await getAssignmentsList();
    // Sort assignments by createdAt descending (newest first)
    const sortedList = list.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(sortedList);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Nama folder tugas wajib diisi." }, { status: 400 });
    }

    const assignments = await getAssignmentsList();
    
    // Check for duplicate names (optional but helpful)
    if (assignments.some(a => a.title.toLowerCase() === title.trim().toLowerCase())) {
      return NextResponse.json({ error: "Folder dengan nama yang sama sudah ada." }, { status: 400 });
    }

    const assignmentId = crypto.randomUUID ? crypto.randomUUID() : `asm-${Date.now()}`;
    const newAssignment: Assignment = {
      id: assignmentId,
      title: title.trim(),
      description: (description || "").trim(),
      createdAt: new Date().toISOString(),
    };

    assignments.push(newAssignment);
    await saveAssignmentsList(assignments);

    return NextResponse.json({ success: true, assignment: newAssignment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID folder tugas tidak ditemukan." }, { status: 400 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Nama folder tugas wajib diisi." }, { status: 400 });
    }

    const assignments = await getAssignmentsList();
    const assignmentIndex = assignments.findIndex(a => a.id === id);

    if (assignmentIndex === -1) {
      return NextResponse.json({ error: "Folder tugas tidak ditemukan." }, { status: 404 });
    }

    // Check for duplicate names (excluding current folder)
    if (assignments.some(a => a.id !== id && a.title.toLowerCase() === title.trim().toLowerCase())) {
      return NextResponse.json({ error: "Folder dengan nama yang sama sudah ada." }, { status: 400 });
    }

    assignments[assignmentIndex] = {
      ...assignments[assignmentIndex],
      title: title.trim(),
      description: (description || "").trim(),
    };

    await saveAssignmentsList(assignments);

    return NextResponse.json({ success: true, assignment: assignments[assignmentIndex] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID folder tugas tidak ditemukan." }, { status: 400 });
    }

    // Delete assignment folder
    const assignments = await getAssignmentsList();
    const filteredAssignments = assignments.filter(a => a.id !== id);
    
    if (assignments.length === filteredAssignments.length) {
      return NextResponse.json({ error: "Folder tugas tidak ditemukan." }, { status: 404 });
    }

    await saveAssignmentsList(filteredAssignments);

    // Cascade Delete: delete all submissions that belong to this assignment ID
    const submissions = await getSubmissionsList();
    const filteredSubmissions = submissions.filter(s => s.assignmentId !== id);
    await saveSubmissionsList(filteredSubmissions);

    return NextResponse.json({ success: true, message: "Folder tugas dan seluruh tugas siswa di dalamnya berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
