"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code } from "lucide-react";

const footerLinks = [
  { href: "/kurikulum", label: "Kurikulum" },
  { href: "/submissions", label: "Tugas" },
  { href: "/quiz", label: "Kuis" },
];

export function Footer() {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4 text-slate-500" />
            <span className="text-base font-medium text-slate-500 dark:text-slate-400">
              LearnJS
            </span>
          </Link>
        </div>

        {/* Center */}
        <nav className="flex items-center justify-center gap-10">
          {footerLinks.map((item) =>
            item.href.startsWith("/#") ? (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className="text-base font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right */}
        <div className="flex flex-1 justify-end">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()}
          </span>
        </div>

      </div>
    </footer>
  );
}