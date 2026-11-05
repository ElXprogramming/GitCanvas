'use client';

import React, { useState, useEffect } from 'react';
import { diffLines, Change } from 'diff';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  ExternalLink,
  Plus,
  Minus,
  GitCommit,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/common/Toast';

interface DiffDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  username: string;
  personalToken?: string;
  isOAuthAuthenticated: boolean;
  onOpenTokenModal: () => void;
}

export default function DiffDeployModal({
  isOpen,
  onClose,
  markdown,
  username,
  personalToken,
  isOAuthAuthenticated,
  onOpenTokenModal,
}: DiffDeployModalProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [repoExists, setRepoExists] = useState<boolean | null>(null);
  const [existingContent, setExistingContent] = useState<string | null>(null);
  const [diffChanges, setDiffChanges] = useState<Change[]>([]);
  const [commitMessage, setCommitMessage] = useState(
    'docs: update profile README via GitCanvas Studio ✨'
  );
  const [deployResult, setDeployResult] = useState<{
    profileUrl: string;
    repoUrl: string;
    commitUrl: string;
    repoCreated: boolean;
  } | null>(null);

  const { showToast } = useToast();

  const hasAuth = isOAuthAuthenticated || !!personalToken;

  useEffect(() => {
    if (isOpen && hasAuth) {
      checkRepositoryAndDiff();
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasAuth, markdown, username]);

  const checkRepositoryAndDiff = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/github/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check',
          username,
          personalToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect GitHub repository');
      }

      setRepoExists(data.repoExists);
      setExistingContent(data.existingReadmeContent || null);
      const changes = diffLines(data.existingReadmeContent || '', markdown);
      setDiffChanges(changes);
    } catch (err: any) {
      console.warn('Check diff error:', err.message);
      setDiffChanges(diffLines('', markdown));
    } finally {
      setIsChecking(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch('/api/github/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commit',
          username,
          readmeContent: markdown,
          commitMessage,
          personalToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to deploy to GitHub');
      }

      setDeployResult({
        profileUrl: data.profileUrl,
        repoUrl: data.repoUrl,
        commitUrl: data.commitUrl,
        repoCreated: data.repoCreated,
      });

      // Trigger celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast(
        'success',
        'README deployed successfully!',
        `Your GitHub profile README has been published to ${username}/${username}.`,
        { url: data.profileUrl, label: 'View Profile' }
      );
    } catch (err: any) {
      showToast('error', 'Deployment Failed', err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Deploy to GitHub Profile
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Target: {username}/{username}/README.md
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!hasAuth ? (
            /* Unauthenticated warning with direct token or sign in prompt */
            <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-300 text-sm">
                    Authentication Required for Direct Push
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    To deploy directly to your GitHub repository, GitCanvas needs repository permissions. You can sign in with GitHub OAuth or provide a GitHub Personal Access Token (PAT) with <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">repo</code> scope.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onOpenTokenModal}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                >
                  Enter GitHub Token
                </button>
              </div>
            </div>
          ) : deployResult ? (
            /* Deployment Success View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Successfully Deployed! 🎉
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {deployResult.repoCreated
                    ? `Created the special ${username}/${username} repository and committed your new README.md!`
                    : `Updated README.md on ${username}/${username} (main branch).`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <a
                  href={deployResult.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20"
                >
                  <span>View Your GitHub Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {deployResult.commitUrl && (
                  <a
                    href={deployResult.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700"
                  >
                    <span>View Commit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Diff Inspection & Commit Form */
            <div className="space-y-4">
              {/* Repo status indicator */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Target Repository:</span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    github.com/{username}/{username}
                  </span>
                </div>
                <div>
                  {isChecking ? (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Checking...
                    </span>
                  ) : repoExists === false ? (
                    <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Will auto-create repo ✨
                    </span>
                  ) : (
                    <span className="text-cyan-400 font-medium bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Repo exists (will update)
                    </span>
                  )}
                </div>
              </div>

              {/* Commit Message Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                  Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="docs: update profile README via GitCanvas Studio ✨"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Diff Preview Container */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    Changes Diff Preview
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Plus className="w-3 h-3" /> Additions
                    </span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <Minus className="w-3 h-3" /> Deletions
                    </span>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-800 bg-[#0d1117] p-3 font-mono text-[11px] leading-relaxed">
                  {isChecking ? (
                    <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      Calculating diff with GitHub...
                    </div>
                  ) : diffChanges.length === 0 ? (
                    <div className="text-slate-500 text-center py-6">
                      No changes detected.
                    </div>
                  ) : (
                    diffChanges.map((change, idx) => {
                      const lines = change.value.replace(/\n$/, '').split('\n');
                      return lines.map((line, lineIdx) => {
                        let lineStyle = 'text-slate-400';
                        let prefix = ' ';
                        if (change.added) {
                          lineStyle = 'bg-emerald-950/40 text-emerald-300 font-medium';
                          prefix = '+';
                        } else if (change.removed) {
                          lineStyle = 'bg-rose-950/40 text-rose-300 line-through';
                          prefix = '-';
                        }
                        return (
                          <div
                            key={`${idx}-${lineIdx}`}
                            className={`px-1 rounded-sm ${lineStyle} flex`}
                          >
                            <span className="select-none w-4 shrink-0 text-slate-600">
                              {prefix}
                            </span>
                            <span className="break-all whitespace-pre-wrap">{line}</span>
                          </div>
                        );
                      });
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {deployResult ? 'Close' : 'Cancel'}
          </button>

          {!deployResult && hasAuth && (
            <button
              onClick={handleDeploy}
              disabled={isDeploying || isChecking}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Pushing to GitHub...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Confirm & Deploy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
