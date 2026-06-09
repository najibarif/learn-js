"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Code,
  Users,
  FileText,
  Download,
  Clock,
  ArrowLeft,
  Loader2,
  Inbox,
  Folder,
  FolderPlus,
  Trash2,
  Edit3,
  Plus,
  Search,
  ChevronRight,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Assignment {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  groupName: string;
  members: string[];
  fileName: string;
  fileSize: number;
  filePath: string;
  submittedAt: string;
}

export default function AdminSubmissionsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Active folder view state
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Modals / forms states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [asmRes, subRes] = await Promise.all([
        fetch("/api/assignments"),
        fetch("/api/submissions")
      ]);
      
      if (asmRes.ok) {
        const asmData = await asmRes.json();
        setAssignments(asmData);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newTitle.trim()) {
      setErrorMsg("Nama folder wajib diisi.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssignments((prev) => [data.assignment, ...prev]);
        setNewTitle("");
        setNewDesc("");
        setIsCreateOpen(false);
      } else {
        setErrorMsg(data.error || "Gagal membuat folder.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!editTitle.trim() || !editingId) {
      setErrorMsg("Nama folder wajib diisi.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/assignments?id=${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssignments((prev) =>
          prev.map((asm) => (asm.id === editingId ? data.assignment : asm))
        );
        setIsEditOpen(false);
        setEditingId(null);
      } else {
        setErrorMsg(data.error || "Gagal mengubah folder.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFolder = async (id: string, title: string) => {
    const confirmDelete = confirm(
      `Apakah Anda yakin ingin menghapus folder "${title}"?\n\nTindakan ini bersifat permanen dan AKAN MENGHAPUS SELURUH TUGAS KELOMPOK SISWA yang berada di dalam folder ini!`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/assignments?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAssignments((prev) => prev.filter((asm) => asm.id !== id));
        setSubmissions((prev) => prev.filter((sub) => sub.assignmentId !== id));
        if (activeAssignmentId === id) {
          setActiveAssignmentId(null);
        }
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus folder.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const activeAssignment = assignments.find((a) => a.id === activeAssignmentId);

  // Filter submissions belonging to the active folder & matching search query
  const filteredSubmissions = submissions
    .filter((sub) => sub.assignmentId === activeAssignmentId)
    .filter((sub) => {
      const query = searchTerm.toLowerCase();
      return (
        sub.groupName.toLowerCase().includes(query) ||
        sub.members.some((m) => m.toLowerCase().includes(query)) ||
        sub.fileName.toLowerCase().includes(query)
      );
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/quiz"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Kembali ke Dashboard Kuis"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Code className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">LearnJS Admin</span>
            <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pengelolaan Tugas</span>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/admin/quiz">
                <Button variant="ghost" className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg">
                  Kuis Admin
                </Button>
             </Link>
             <ThemeToggle />
             <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
             <Button 
               variant="outline" 
               onClick={async () => {
                 await fetch('/api/quiz/admin/logout', { method: 'POST' });
                 window.location.href = '/admin/quiz/login';
               }}
               className="text-slate-500 border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-xl px-4 h-9 text-xs font-bold transition-all"
             >
               SIGN OUT
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        
        {/* Navigation Breadcrumb / Folder path */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span 
            className="hover:text-violet-500 cursor-pointer transition-colors"
            onClick={() => {
              setActiveAssignmentId(null);
              setSearchTerm("");
            }}
          >
            Folder Tugas
          </span>
          {activeAssignment && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-700 dark:text-slate-300 font-extrabold max-w-[200px] truncate">
                {activeAssignment.title}
              </span>
            </>
          )}
        </div>

        {/* Dynamic Main Section depending on selected folder */}
        {activeAssignmentId === null ? (
          /* =================================================================== */
          /* 1. FOLDER EXPLORER VIEW (Default)                                   */
          /* =================================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Pengelolaan Folder Tugas
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
                  Buat folder tugas untuk mengelompokkan hasil pengerjaan siswa. Anda dapat mengedit nama folder dan menghapusnya.
                </p>
              </div>

              <Button
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-xs h-10 px-5 shadow-md shadow-violet-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-1.5"
              >
                <FolderPlus className="h-4 w-4" />
                BUAT FOLDER BARU
              </Button>
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin text-violet-500 mb-2" />
                <p className="text-sm font-medium">Memuat semua folder tugas...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 transition-colors">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-full flex items-center justify-center mb-4">
                  <Folder className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Belum Ada Folder Tugas</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm font-medium">
                  Buat folder tugas pertama Anda untuk mulai menerima pengumpulan tugas dari kelompok siswa.
                </p>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  variant="outline"
                  className="mt-5 rounded-xl border-dashed text-violet-600 dark:text-violet-400 font-bold border-violet-200 dark:border-violet-850 hover:bg-violet-50 dark:hover:bg-violet-950/20 text-xs px-4"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Buat Folder Pertama
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((asm) => {
                  const count = submissions.filter((sub) => sub.assignmentId === asm.id).length;
                  return (
                    <div
                      key={asm.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500/30 dark:hover:border-violet-500/30 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between min-h-[180px] relative overflow-hidden"
                    >
                      {/* Decorative top strip */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />

                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div
                            onClick={() => setActiveAssignmentId(asm.id)}
                            className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
                          >
                            <FolderOpen className="h-5 w-5" />
                          </div>
                          
                          {/* Card actions */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingId(asm.id);
                                setEditTitle(asm.title);
                                setEditDesc(asm.description);
                                setIsEditOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit nama/deskripsi"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFolder(asm.id, asm.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Hapus folder beserta isinya"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div 
                          onClick={() => setActiveAssignmentId(asm.id)}
                          className="cursor-pointer space-y-1"
                        >
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-violet-500 transition-colors line-clamp-1">
                            {asm.title}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">
                            {asm.description || "Tidak ada deskripsi."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span className="font-semibold bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md text-[10px]">
                          {count} Tugas Siswa
                        </span>
                        <span className="font-mono">{formatDate(asm.createdAt).split(" pukul ")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* =================================================================== */
          /* 2. SUBMISSIONS LIST INSIDE AN ASSIGNMENT FOLDER                    */
          /* =================================================================== */
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => {
                    setActiveAssignmentId(null);
                    setSearchTerm("");
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-950 transition-all cursor-pointer flex-shrink-0 mt-0.5"
                  title="Kembali ke Daftar Folder"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <FolderOpen className="h-6 w-6 text-amber-500" />
                    {activeAssignment?.title}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm mt-0.5">
                    {activeAssignment?.description || "Tidak ada deskripsi."}
                  </p>
                </div>
              </div>

              {/* Stats & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-655 dark:text-slate-400 flex items-center gap-2">
                  <Users className="h-4 w-4 text-violet-500" />
                  <span>{filteredSubmissions.length} Tugas Kelompok</span>
                </div>
              </div>
            </div>

            {/* Search Input Filter */}
            {submissions.filter(s => s.assignmentId === activeAssignmentId).length > 0 && (
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama kelompok atau anggota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-violet-500 outline-none text-xs font-semibold"
                />
              </div>
            )}

            {filteredSubmissions.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 transition-colors">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {searchTerm ? "Tugas Tidak Ditemukan" : "Belum Ada Tugas"}
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-sm font-medium">
                  {searchTerm 
                    ? `Tidak ditemukan tugas siswa yang cocok dengan kata kunci "${searchTerm}"`
                    : "Belum ada kelompok siswa yang mengunggah berkas untuk folder tugas ini."
                  }
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">
                        <th className="py-4 px-6">Nama Kelompok</th>
                        <th className="py-4 px-6">Anggota Kelompok</th>
                        <th className="py-4 px-6">File Tugas</th>
                        <th className="py-4 px-6">Ukuran</th>
                        <th className="py-4 px-6">Waktu Kumpul</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold">
                      {filteredSubmissions.map((sub) => (
                        <tr 
                          key={sub.id} 
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                        >
                          {/* Group Name */}
                          <td className="py-5 px-6 font-extrabold text-slate-900 dark:text-white">
                            {sub.groupName}
                          </td>

                          {/* Group Members Badges */}
                          <td className="py-5 px-6">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {sub.members.map((member, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400"
                                >
                                  {member}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* File Name */}
                          <td className="py-5 px-6 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[150px] font-bold" title={sub.fileName}>
                                {sub.fileName}
                              </span>
                            </div>
                          </td>

                          {/* File Size */}
                          <td className="py-5 px-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                            {formatBytes(sub.fileSize)}
                          </td>

                          {/* Submitted Time */}
                          <td className="py-5 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {formatDate(sub.submittedAt)}
                            </div>
                          </td>

                          {/* Download Action */}
                          <td className="py-5 px-6 text-center">
                            <a
                              href={sub.filePath}
                              download={sub.fileName}
                              className="inline-flex items-center justify-center p-2 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-650 dark:text-violet-400 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white transition-all shadow-sm cursor-pointer"
                              title={`Unduh file ${sub.fileName}`}
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* 3. MODAL DIALOGS FOR FOLDER CRUD                                    */}
      {/* =================================================================== */}

      {/* Create Folder Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <FolderPlus className="h-5 w-5 text-violet-500" />
              Buat Folder Tugas Baru
            </h3>
            
            {errorMsg && (
              <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-2.5 rounded-xl mb-4">
                ⚠️ {errorMsg}
              </p>
            )}

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Nama Folder / Judul Tugas</label>
                <input
                  type="text"
                  placeholder="Contoh: Tugas 1: Variabel & Tipe Data"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-violet-500 outline-none text-xs font-semibold"
                  disabled={actionLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Deskripsi (Opsional)</label>
                <textarea
                  placeholder="Keterangan singkat materi tugas..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-violet-500 outline-none text-xs font-semibold resize-none"
                  disabled={actionLoading}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setErrorMsg(null);
                    setNewTitle("");
                    setNewDesc("");
                  }}
                  className="flex-1 rounded-xl h-11 text-xs font-bold"
                  disabled={actionLoading}
                >
                  BATAL
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-11 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? "MEMPROSES..." : "BUAT"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <FolderOpen className="h-5 w-5 text-violet-500" />
              Edit Folder Tugas
            </h3>

            {errorMsg && (
              <p className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-2.5 rounded-xl mb-4">
                ⚠️ {errorMsg}
              </p>
            )}

            <form onSubmit={handleEditFolder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Nama Folder / Judul Tugas</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-violet-500 outline-none text-xs font-semibold"
                  disabled={actionLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Deskripsi (Opsional)</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-violet-500 outline-none text-xs font-semibold resize-none"
                  disabled={actionLoading}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false);
                    setErrorMsg(null);
                    setEditingId(null);
                  }}
                  className="flex-1 rounded-xl h-11 text-xs font-bold"
                  disabled={actionLoading}
                >
                  BATAL
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl h-11 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? "MENYIMPAN..." : "SIMPAN"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors mt-20 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-xs font-normal">
          &copy; {new Date().getFullYear()} LearnJS. Panel Pengelolaan Tugas Kelompok Admin.
        </p>
      </footer>
    </div>
  );
}
