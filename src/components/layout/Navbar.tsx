'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  RotateCw,
  Loader2,
} from 'lucide-react';

interface NavbarProps {
  currentUsername: string;
  onSearchUser: (username: string, forceRefresh?: boolean) => void;
  isLoading: boolean;
  onCopyMarkdown: () => void;
}

export default function Navbar({
  currentUsername,
  onSearchUser,
  isLoading,
  onCopyMarkdown,
}: NavbarProps) {
  const [searchInput, setSearchInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearchUser(trimmed, true);
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
                GitHub Profile README Studio
              </p>
            </div>
          </div>

          {/* Quick Demo Chips */}
          <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Demo:</span>
            {['ElXprogramming'].map((demo) => (
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
              placeholder="Enter GitHub username (e.g. ElXprogramming)..."
              className="w-full pl-9 pr-24 py-1.5 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            <div className="absolute right-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSearchUser(searchInput.trim() || currentUsername, true)}
                disabled={isLoading}
                title="Force refresh stats and pinned projects from GitHub"
                className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 disabled:hover:bg-cyan-600 transition-colors flex items-center gap-1"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Load'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={handleCopyClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Copy generated markdown to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
