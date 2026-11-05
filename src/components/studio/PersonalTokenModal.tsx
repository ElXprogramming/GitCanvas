'use client';

import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

interface PersonalTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSaveToken: (token: string) => void;
}

export default function PersonalTokenModal({
  isOpen,
  onClose,
  token,
  onSaveToken,
}: PersonalTokenModalProps) {
  const [inputVal, setInputVal] = useState(token);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveToken(inputVal.trim());
    showToast('success', 'Token Saved', 'GitHub Token has been configured for this session.');
    onClose();
  };

  const handleClear = () => {
    setInputVal('');
    onSaveToken('');
    showToast('info', 'Token Removed', 'Personal token cleared.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">GitHub Personal Access Token</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Deployment & High Rate Limits</span>
            </div>
            <p className="leading-relaxed">
              Generate a classic or fine-grained token with <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">repo</code> scope to create repositories and commit READMEs directly.
            </p>
            <a
              href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=GitCanvas%20Studio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:underline pt-1"
            >
              Generate token on GitHub &rarr;
            </a>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Token Value (<code className="text-slate-400">ghp_...</code>)
            </label>
            <input
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            {token ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Token</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-colors"
              >
                Save Token
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
