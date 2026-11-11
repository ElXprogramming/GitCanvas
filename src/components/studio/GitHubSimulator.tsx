'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import {
  FileText,
  Eye,
  Code,
} from 'lucide-react';

interface GitHubSimulatorProps {
  markdown: string;
  username: string;
  onCopyMarkdown?: () => void;
}

// GitHub permissive sanitize schema allowing align, width, height, target, etc.
const githubSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': ['className', 'style', 'align'],
    img: ['src', 'alt', 'width', 'height', 'align', 'title', 'loading'],
    a: ['href', 'target', 'rel', 'title'],
    div: ['align'],
    p: ['align'],
    h1: ['align'],
    h2: ['align'],
    h3: ['align'],
    h4: ['align'],
    h5: ['align'],
    h6: ['align'],
    table: ['align', 'width', 'cellPadding', 'cellSpacing'],
    tr: ['align', 'valign'],
    th: ['align', 'width', 'valign', 'colSpan', 'colspan', 'rowSpan', 'rowspan'],
    td: ['align', 'width', 'valign', 'colSpan', 'colspan', 'rowSpan', 'rowspan'],
    br: ['clear'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'div',
    'span',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'a',
    'p',
    'b',
    'strong',
    'i',
    'em',
    'code',
    'pre',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
  ],
};

const remarkPlugins = [remarkGfm];
const rehypePlugins: any = [rehypeRaw, [rehypeSanitize, githubSanitizeSchema]];

function GitHubSimulatorComponent({
  markdown,
  username,
}: GitHubSimulatorProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const lineCount = markdown.split('\n').length;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl overflow-hidden">
      {/* GitHub Repository Desktop Simulation Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        {/* Repo breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-200">
            {username || 'user'}
          </span>
          <span className="text-slate-500">/</span>
          <span className="font-bold text-slate-100">{username || 'user'}</span>
          <span className="text-slate-500">/</span>
          <span className="font-mono text-cyan-400 text-xs bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
            README.md
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Preview vs Code switch */}
          <div className="flex items-center rounded-lg bg-[#0d1117] p-0.5 border border-[#30363d]">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-[#21262d] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'code'
                  ? 'bg-[#21262d] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 min-h-[600px] max-h-[calc(100vh-170px)]">
        {viewMode === 'preview' ? (
          <div className="github-readme-body max-w-4xl mx-auto">
            <ReactMarkdown
              remarkPlugins={remarkPlugins}
              rehypePlugins={rehypePlugins}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="font-mono text-xs sm:text-sm text-slate-200 bg-[#0d1117] rounded-xl overflow-x-auto">
            <div className="flex text-slate-600 border-b border-[#30363d] pb-2 mb-3 text-[11px] justify-between">
              <span>
                Markdown Source ({lineCount} {lineCount === 1 ? 'line' : 'lines'})
              </span>
              <span>UTF-8</span>
            </div>
            <pre className="p-3 m-0 bg-[#161b22] rounded-lg border border-[#30363d] overflow-x-auto whitespace-pre-wrap break-all leading-relaxed text-cyan-300">
              {markdown}
            </pre>
          </div>
        )}
      </div>

      {/* Simulator Footer Status */}
      <div className="flex items-center justify-end px-4 py-2 bg-[#161b22] border-t border-[#30363d] text-[11px] text-slate-500">
        <span>
          Target: github.com/{username || 'username'}/{username || 'username'}
        </span>
      </div>
    </div>
  );
}

const GitHubSimulator = React.memo(GitHubSimulatorComponent);
export default GitHubSimulator;
