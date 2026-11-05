'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Sparkles,
  Search,
  UploadCloud,
  Copy,
  Download,
  Key,
  LogOut,
  User,
  Loader2,
  Check,
} from 'lucide-react';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}
import { useToast } from '@/components/common/Toast';

interface NavbarProps {
  currentUsername: string;
  onSearchUser: (username: string) => void;
  isLoading: boolean;
  onOpenDeployModal: () => void;
  onOpenTokenModal: () => void;
  onCopyMarkdown: () => void;
  onDownloadMarkdown: () => void;
  hasPersonalToken: boolean;
}

export default function Navbar({
  currentUsername,
  onSearchUser,
  isLoading,
  onOpenDeployModal,
  onOpenTokenModal,
  onCopyMarkdown,
  onDownloadMarkdown,
  hasPersonalToken,
}: NavbarProps) {
  const { data: session, status: authStatus } = useSession();
  const [searchInput, setSearchInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearchUser(trimmed);
    }
  };

  const handleQuickLoad = (user: string) => {
    setSearchInput(user);
    onSearchUser(user);
  };

  const handleCopyClick = () => {
    onCopyMarkdown();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 px-4 py-2.5 max-w-[1920px] mx-auto">
        {/* Brand & Demo Chips */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  GitCanvas
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                GitHub Profile README Studio & Deployer
              </p>
            </div>
          </div>

          {/* Quick Demo Chips */}
          <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Demo:</span>
            {['torvalds', 'shadcn', 'gaearon', 'sindresorhus'].map((demo) => (
              <button
                key={demo}
                onClick={() => handleQuickLoad(demo)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  currentUsername.toLowerCase() === demo.toLowerCase()
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {demo}
              </button>
            ))}
          </div>
        </div>

        {/* Username Search Input */}
        <div className="w-full lg:max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)..."
              className="w-full pl-9 pr-20 py-1.5 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="absolute right-1 px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 disabled:hover:bg-cyan-600 transition-colors flex items-center gap-1"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                'Load'
              )}
            </button>
          </form>
        </div>

        {/* Actions & Authentication */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end overflow-x-auto pb-1 lg:pb-0">
          {/* Copy Button */}
          <button
            onClick={handleCopyClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Copy generated markdown to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={onDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Download README.md file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Deploy to GitHub Primary CTA */}
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Deploy directly to github.com/<username>/<username>"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Deploy to GitHub</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* GitHub Auth / Token */}
          {session?.user ? (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1 pr-2.5">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-6 h-6 rounded-full border border-slate-700"
                />
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs text-slate-200 font-medium max-w-[90px] truncate">
                {session.user.name || (session as any).user?.login || 'User'}
              </span>
              <button
                onClick={() => signOut()}
                className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => signIn('github')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
                title="Sign in with GitHub OAuth"
              >
                <GitHubIcon className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              <button
                onClick={onOpenTokenModal}
                className={`p-1.5 rounded-lg border transition-colors ${
                  hasPersonalToken
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title="Manage GitHub Token"
              >
                <Key className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
