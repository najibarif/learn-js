"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Users,
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubmissionsPage() {
  const [groupName, setGroupName] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface Assignment {
    id: string;
    title: string;
    description: string;
    createdAt: string;
  }
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentId, setAssignmentId] = useState("");
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/assignments");
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (err) {
        console.error("Gagal memuat folder tugas:", err);
      } finally {
        setAssignmentsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const parsedMembers = membersInput
    .split(",")
    .map((m) => m.trim())
    .filter((m) => m.length > 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!assignmentId) {
      setMessage({ type: "error", text: "Silakan pilih folder tugas tujuan terlebih dahulu." });
      return;
    }
    if (!groupName.trim()) {
      setMessage({ type: "error", text: "Nama kelompok wajib diisi." });
      return;
    }
    if (parsedMembers.length === 0) {
      setMessage({ type: "error", text: "Masukkan minimal satu nama anggota kelompok." });
      return;
    }
    if (!file) {
      setMessage({ type: "error", text: "Silakan pilih atau seret file tugas Anda." });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("groupName", groupName.trim());
    formData.append("members", parsedMembers.join(","));
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Tugas kelompok berhasil diunggah!" });
        setGroupName("");
        setMembersInput("");
        setAssignmentId("");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage({ type: "error", text: data.error || "Gagal mengunggah tugas." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan. Coba lagi nanti." });
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      <Navbar />

      <main className="container mx-auto px-6 py-12 max-w-2xl space-y-12">
        {/* Intro Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-medium text-slate-900 dark:text-white">
            Unggah Tugas Kelompok Anda
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-base font-normal">
            Lengkapi formulir di bawah ini dengan nama kelompok, anggota yang berpartisipasi, dan lampirkan berkas tugas proyek JavaScript Anda.
          </p>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 md:p-10 transition-colors shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 border ${
                  message.type === "success"
                    ? "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-base font-medium leading-relaxed">{message.text}</span>
              </div>
            )}

            {/* Target Folder / Assignment Dropdown */}
            <div className="space-y-2">
              <label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-slate-500" />
                Pilih Folder Tugas / Project
              </label>
              {assignmentsLoading ? (
                <div className="flex items-center gap-2 h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 text-base font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  Memuat daftar folder tugas...
                </div>
              ) : assignments.length === 0 ? (
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-base font-medium">
                  Belum ada folder tugas aktif yang dibuka oleh Admin. Anda tidak dapat mengumpulkan tugas saat ini.
                </div>
              ) : (
                <select
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-950 focus:border-transparent outline-none transition-all text-base font-medium cursor-pointer text-slate-800 dark:text-slate-200"
                  disabled={loading}
                >
                  <option value="" className="text-slate-400">-- Pilih Target Folder Tugas --</option>
                  {assignments.map((asm) => (
                    <option key={asm.id} value={asm.id} className="text-slate-800 dark:text-slate-200">
                      {asm.title} {asm.description ? `(${asm.description})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Grid for Name & Members */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Group Name */}
              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  Nama Kelompok
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelompok Loops 1"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-950 focus:border-transparent outline-none transition-all text-base font-medium"
                  disabled={loading}
                />
              </div>

              {/* Members Input */}
              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  Anggota Kelompok
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Najib, Arif, Budi"
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:bg-white dark:focus:bg-slate-950 focus:border-transparent outline-none transition-all text-base font-medium"
                  disabled={loading}
                />
                <p className="text-slate-400 dark:text-slate-500 text-sm font-normal">
                  Pisahkan nama anggota kelompok menggunakan tanda koma ( , )
                </p>
              </div>
            </div>

            {/* Live badges preview of parsed members */}
            {parsedMembers.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">
                  Pratinjau Anggota ({parsedMembers.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {parsedMembers.map((member, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File drag and drop area */}
            <div className="space-y-2">
              <label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                File Tugas (.html, .css, .js, .zip, .rar, .docx, .pdf, etc.)
              </label>

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-slate-400 bg-slate-50 dark:bg-slate-900"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".html,.css,.js,.ts,.tsx,.jsx,.json,.txt,.zip,.rar,.pdf,.docx"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                    Seret & letakkan file Anda di sini, atau klik untuk memilih berkas
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-normal">
                    Format: HTML, CSS, JS, ZIP, RAR, TXT, PDF, DOCX (Maksimal 10MB)
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-medium text-slate-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all cursor-pointer"
                    title="Hapus file"
                    disabled={loading}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || (assignments.length === 0 && !assignmentsLoading)}
              className="w-full h-12 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-bold text-base transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Mengunggah Berkas Tugas...
                </>
              ) : (
                "KUMPULKAN TUGAS"
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
