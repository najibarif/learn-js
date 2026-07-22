"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Code, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/submissions", label: "Tugas" },
  { href: "/quiz", label: "Kuis" },
];

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/70 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          {/* Left */}
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
            >
              <Code className="h-5 w-5 text-slate-500" />
              <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                LearnJS
              </span>
            </Link>
          </div>

          {/* Center */}
          <nav className="hidden md:flex items-center justify-center gap-10">
            {navLinks.map((item) =>
              item.href.startsWith("/#") ? (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right */}
          <div className="flex flex-1 justify-end items-center gap-2">

            <ThemeToggle />

            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 md:hidden",
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        )}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg transition-all duration-200 md:hidden",
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col py-2">
          {navLinks.map((item) =>
            item.href.startsWith("/#") ? (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className="px-6 py-4 text-left text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
}