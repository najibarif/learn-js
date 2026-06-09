"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Code,
  Users,
  Upload,
  FileText,
  Trash2,
  ArrowLeft,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Submission {
  id: string;
  groupName: string;
  members: string[];
  fileName: string;
  fileSize: number;
  filePath: string;
  submittedAt: string;
}

export default function SubmissionsPage() {
  const [groupName, setGroupName] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse comma-separated members into an array for preview badges
  const parsedMembers = membersInput
    .split(",")
    .map((m) => m.trim())
    .filter((m) => m.length > 0);

  // Fetch submissions on load
  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        // Sort by submittedAt descending
        setSubmissions(data.sort((a: Submission, b: Submission) => 
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat tugas:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

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
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Refresh history
        fetchSubmissions();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS</span>
            <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pengumpulan Tugas</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* Intro Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Unggah Tugas Kelompok Anda
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base font-normal">
            Lengkapi formulir di bawah ini dengan nama kelompok, anggota yang berpartisipasi, dan lampirkan berkas tugas proyek JavaScript Anda.
          </p>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {message && (
              <div
                className={`p-4 rounded-2xl flex items-start gap-3 border ${
                  message.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
                    : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 border-red-100 dark:border-red-900/50"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium leading-relaxed">{message.text}</span>
              </div>
            )}

            {/* Grid for Name & Members */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Group Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-violet-500" />
                  Nama Kelompok
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelompok Loops 1"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all text-sm font-medium"
                  disabled={loading}
                />
              </div>

              {/* Members Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  Anggota Kelompok
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Najib, Arif, Budi"
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-900 focus:border-transparent outline-none transition-all text-sm font-medium"
                  disabled={loading}
                />
                <p className="text-slate-400 dark:text-slate-500 text-xs font-normal">
                  Pisahkan nama anggota kelompok menggunakan tanda koma ( , )
                </p>
              </div>
            </div>

            {/* Live badges preview of parsed members */}
            {parsedMembers.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">
                  Pratinjau Anggota ({parsedMembers.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {parsedMembers.map((member, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/40"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File drag and drop area */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                File Tugas (.zip, .rar, .pdf, .js, .json)
              </label>

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-violet-500 bg-violet-500/5"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 hover:border-violet-500/40 dark:hover:border-violet-500/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".zip,.rar,.pdf,.js,.json,.docx"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 animate-pulse" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Seret & letakkan file Anda di sini, atau klik untuk memilih berkas
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-normal">
                    Format yang didukung: ZIP, RAR, PDF, JS, JSON (Maksimal 10MB)
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
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
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-violet-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
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

        {/* Submission History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-violet-500" />
              Riwayat Pengumpulan Tugas
            </h2>
            <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
              {submissions.length} Total
            </span>
          </div>

          {isHistoryLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500 mb-2" />
              <p className="text-sm font-medium">Memuat riwayat pengumpulan...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-full flex items-center justify-center mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada tugas yang dikumpulkan</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-normal">Kirim tugas kelompok Anda di atas untuk memulai.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
                >
                  <div className="space-y-2.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base">
                        {submission.groupName}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/60 px-2 py-0.5 border border-slate-200/50 dark:border-slate-800/80 rounded-md">
                        {formatDate(submission.submittedAt)}
                      </span>
                    </div>

                    {/* Member List Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {submission.members.map((member, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full"
                        >
                          {member}
                        </span>
                      ))}
                    </div>

                    {/* File Attachment Info */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-md font-semibold">
                        {submission.fileName}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span>{formatBytes(submission.fileSize)}</span>
                    </div>
                  </div>

                  {/* Actions (Download) */}
                  <a
                    href={submission.filePath}
                    download={submission.fileName}
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex-shrink-0 cursor-pointer shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    UNDUH FILE
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors mt-20 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-normal">
          &copy; {new Date().getFullYear()} LearnJS. Halaman pengumpulan tugas kelompok interaktif.
        </p>
      </footer>
    </div>
  );
}
