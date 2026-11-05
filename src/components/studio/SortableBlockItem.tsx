'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ReadmeBlockConfig,
  HeroSettings,
  BioSettings,
  TechStackSettings,
  GitHubStatsSettings,
  PinnedProjectsSettings,
  SocialLinksSettings,
  BioTone,
  CapsuleType,
  BadgeStyle,
  BannerStyle,
  Repository,
  DeveloperArchetype,
  TechBadgeItem,
} from '@/types';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Code2,
} from 'lucide-react';

interface SortableBlockItemProps {
  block: ReadmeBlockConfig;
  onUpdateBlock: (updated: ReadmeBlockConfig) => void;
  onOpenBadgePicker: () => void;
  onRegenerateAiBio: (tone: BioTone) => void;
  isAiGenerating: boolean;
  userRepos: Repository[];
  archetype: DeveloperArchetype | null;
}

export default function SortableBlockItem({
  block,
  onUpdateBlock,
  onOpenBadgePicker,
  onRegenerateAiBio,
  isAiGenerating,
  userRepos,
  archetype,
}: SortableBlockItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  const toggleEnabled = () => {
    onUpdateBlock({ ...block, enabled: !block.enabled });
  };

  const updateSettings = (partial: any) => {
    onUpdateBlock({
      ...block,
      settings: { ...block.settings, ...partial },
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border transition-all ${
        block.enabled
          ? 'bg-slate-900/90 border-slate-800 shadow-sm'
          : 'bg-slate-950/40 border-slate-900 opacity-60'
      }`}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between p-3 select-none">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <span className="font-semibold text-xs sm:text-sm text-slate-200">
            {block.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Enable / Disable toggle */}
          <button
            onClick={toggleEnabled}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              block.enabled
                ? 'text-cyan-400 hover:bg-cyan-500/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={block.enabled ? 'Disable block' : 'Enable block'}
          >
            {block.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Expand / Collapse toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Configure settings"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Block Settings Accordion */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-4 text-xs">
          {/* 1. HERO BLOCK EDITOR */}
          {block.id === 'hero' && (
            <HeroEditor
              settings={block.settings as HeroSettings}
              onChange={updateSettings}
              archetype={archetype}
            />
          )}

          {/* 2. BIO BLOCK EDITOR */}
          {block.id === 'bio' && (
            <BioEditor
              settings={block.settings as BioSettings}
              onChange={updateSettings}
              onRegenerateAiBio={onRegenerateAiBio}
              isAiGenerating={isAiGenerating}
            />
          )}

          {/* 3. TECH STACK BLOCK EDITOR */}
          {block.id === 'tech_stack' && (
            <TechStackEditor
              settings={block.settings as TechStackSettings}
              onChange={updateSettings}
              onOpenBadgePicker={onOpenBadgePicker}
            />
          )}

          {/* 4. GITHUB STATS BLOCK EDITOR */}
          {block.id === 'github_stats' && (
            <GitHubStatsEditor
              settings={block.settings as GitHubStatsSettings}
              onChange={updateSettings}
            />
          )}

          {/* 5. STREAK & TROPHIES BLOCK EDITOR */}
          {block.id === 'streak_trophies' && (
            <StreakTrophiesEditor
              settings={block.settings as GitHubStatsSettings}
              onChange={updateSettings}
            />
          )}

          {/* 6. PINNED PROJECTS BLOCK EDITOR */}
          {block.id === 'pinned_projects' && (
            <PinnedProjectsEditor
              settings={block.settings as PinnedProjectsSettings}
              onChange={updateSettings}
              userRepos={userRepos}
            />
          )}

          {/* 7. SOCIAL CONNECT BLOCK EDITOR */}
          {block.id === 'social_connect' && (
            <SocialConnectEditor
              settings={block.settings as SocialLinksSettings}
              onChange={updateSettings}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ----------------- SUB-EDITORS -----------------

function HeroEditor({
  settings,
  onChange,
  archetype,
}: {
  settings: HeroSettings;
  onChange: (s: Partial<HeroSettings>) => void;
  archetype: DeveloperArchetype | null;
}) {
  const bannerStyles: { id: BannerStyle; label: string }[] = [
    { id: 'capsule', label: 'Capsule Render (SVG)' },
    { id: 'typing', label: 'Typing SVG Effect' },
    { id: 'ascii', label: 'ASCII Banner' },
    { id: 'minimal', label: 'Minimalist Clean' },
  ];

  const capsuleTypes: CapsuleType[] = ['wave', 'slice', 'rect', 'soft', 'cylinder', 'rounded'];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-slate-400 font-medium mb-1">Banner Style</label>
        <div className="grid grid-cols-2 gap-1.5">
          {bannerStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => onChange({ style: style.id })}
              className={`p-2 rounded-lg border text-left transition-colors ${
                settings.style === style.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-slate-400 font-medium mb-1">Greeting Text</label>
        <input
          type="text"
          value={settings.greeting}
          onChange={(e) => onChange({ greeting: e.target.value })}
          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div>
        <label className="block text-slate-400 font-medium mb-1">Tagline</label>
        <input
          type="text"
          value={settings.tagline}
          onChange={(e) => onChange({ tagline: e.target.value })}
          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
        {archetype?.recommendedTaglines && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span className="text-[10px] text-slate-500">Suggestions:</span>
            {archetype.recommendedTaglines.map((rec, i) => (
              <button
                key={i}
                onClick={() => onChange({ tagline: rec })}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-cyan-300 truncate max-w-xs"
              >
                {rec}
              </button>
            ))}
          </div>
        )}
      </div>

      {settings.style === 'capsule' && (
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Capsule Shape</label>
            <select
              value={settings.capsuleType}
              onChange={(e) => onChange({ capsuleType: e.target.value as CapsuleType })}
              className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            >
              {capsuleTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Height (px)</label>
            <input
              type="number"
              min="100"
              max="300"
              value={settings.capsuleHeight}
              onChange={(e) => onChange({ capsuleHeight: parseInt(e.target.value) || 180 })}
              className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
            />
          </div>
        </div>
      )}

      {settings.style === 'typing' && (
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <label className="block text-slate-400 font-medium">
            Typing Lines (one per line)
          </label>
          <textarea
            rows={3}
            value={settings.typingLines.join('\n')}
            onChange={(e) =>
              onChange({
                typingLines: e.target.value.split('\n').filter((l) => l.trim() !== ''),
              })
            }
            placeholder="Line 1&#10;Line 2&#10;Line 3"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      )}
    </div>
  );
}

function BioEditor({
  settings,
  onChange,
  onRegenerateAiBio,
  isAiGenerating,
}: {
  settings: BioSettings;
  onChange: (s: Partial<BioSettings>) => void;
  onRegenerateAiBio: (tone: BioTone) => void;
  isAiGenerating: boolean;
}) {
  const tones: { id: BioTone; label: string }[] = [
    { id: 'professional', label: 'Professional / Executive' },
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'playful', label: 'Playful / Hacker' },
    { id: 'storyteller', label: 'Storyteller' },
  ];

  return (
    <div className="space-y-3">
      {/* AI Tone Bar */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-violet-950/40 border border-cyan-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-200 text-xs">AI Bio Tone Styling:</span>
          <select
            value={settings.tone}
            onChange={(e) => onChange({ tone: e.target.value as BioTone })}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
          >
            {tones.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onRegenerateAiBio(settings.tone)}
          disabled={isAiGenerating}
          className="px-3 py-1 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
        >
          {isAiGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Regenerate with AI</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-slate-400 font-medium mb-1">🔭 Working on</label>
          <input
            type="text"
            value={settings.workingOn}
            onChange={(e) => onChange({ workingOn: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-medium mb-1">🌱 Currently learning</label>
          <input
            type="text"
            value={settings.learning}
            onChange={(e) => onChange({ learning: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-medium mb-1">💬 Ask me about</label>
          <input
            type="text"
            value={settings.askMeAbout}
            onChange={(e) => onChange({ askMeAbout: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-medium mb-1">📫 How to reach me</label>
          <input
            type="text"
            value={settings.reachMe}
            onChange={(e) => onChange({ reachMe: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-medium mb-1">💼 Open for</label>
          <input
            type="text"
            value={settings.openFor}
            onChange={(e) => onChange({ openFor: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-medium mb-1">⚡ Fun fact</label>
          <input
            type="text"
            value={settings.funFact}
            onChange={(e) => onChange({ funFact: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}

function TechStackEditor({
  settings,
  onChange,
  onOpenBadgePicker,
}: {
  settings: TechStackSettings;
  onChange: (s: Partial<TechStackSettings>) => void;
  onOpenBadgePicker: () => void;
}) {
  const styles: BadgeStyle[] = ['for-the-badge', 'flat', 'flat-square', 'plastic'];

  const removeBadge = (id: string) => {
    onChange({
      selectedBadges: settings.selectedBadges.filter((b) => b.id !== id),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">Badge Style:</label>
          <select
            value={settings.badgeStyle}
            onChange={(e) => onChange({ badgeStyle: e.target.value as BadgeStyle })}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
          >
            {styles.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={settings.showCategoryHeaders}
            onChange={(e) => onChange({ showCategoryHeaders: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-cyan-500"
          />
          <span>Group by categories</span>
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-medium">
            Selected Technologies ({settings.selectedBadges.length})
          </span>
          <button
            onClick={onOpenBadgePicker}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add / Search Badges</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[50px]">
          {settings.selectedBadges.length === 0 ? (
            <span className="text-slate-500 italic p-1">No badges added yet.</span>
          ) : (
            settings.selectedBadges.map((badge) => (
              <span
                key={badge.id}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
              >
                <span>{badge.name}</span>
                <button
                  onClick={() => removeBadge(badge.id)}
                  className="text-slate-400 hover:text-rose-400 ml-0.5"
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function GitHubStatsEditor({
  settings,
  onChange,
}: {
  settings: GitHubStatsSettings;
  onChange: (s: Partial<GitHubStatsSettings>) => void;
}) {
  const themes = [
    { id: 'catppuccin_mocha', label: 'Catppuccin Mocha' },
    { id: 'tokyonight', label: 'Tokyo Night' },
    { id: 'nord', label: 'Nord' },
    { id: 'dracula', label: 'Dracula' },
    { id: 'radical', label: 'Radical' },
    { id: 'onedark', label: 'One Dark' },
    { id: 'gruvbox', label: 'Gruvbox' },
    { id: 'dark', label: 'GitHub Dark' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 font-medium mb-1">Theme</label>
          <select
            value={settings.cardTheme}
            onChange={(e) => onChange({ cardTheme: e.target.value })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1">Layout</label>
          <select
            value={settings.layout}
            onChange={(e) => onChange({ layout: e.target.value as any })}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
          >
            <option value="side-by-side">Side-by-Side Cards</option>
            <option value="stacked">Stacked Cards</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-1">
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={settings.showOverallStats}
            onChange={(e) => onChange({ showOverallStats: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-cyan-500"
          />
          <span>Show Stats Card</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={settings.showTopLangs}
            onChange={(e) => onChange({ showTopLangs: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-cyan-500"
          />
          <span>Show Top Languages Card</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={settings.hideBorder}
            onChange={(e) => onChange({ hideBorder: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-cyan-500"
          />
          <span>Borderless Cards</span>
        </label>
      </div>
    </div>
  );
}

function StreakTrophiesEditor({
  settings,
  onChange,
}: {
  settings: GitHubStatsSettings;
  onChange: (s: Partial<GitHubStatsSettings>) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">
        Highlight your continuous contribution streaks and earned GitHub milestones.
      </p>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={settings.showStreak}
            onChange={(e) => onChange({ showStreak: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-cyan-500"
          />
          <span>Contribution Streak Stats</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={settings.showTrophies}
            onChange={(e) => onChange({ showTrophies: e.target.checked })}
            className="rounded bg-slate-900 border-slate-800 text-cyan-500"
          />
          <span>GitHub Trophies Badge</span>
        </label>
      </div>
    </div>
  );
}

function PinnedProjectsEditor({
  settings,
  onChange,
  userRepos,
}: {
  settings: PinnedProjectsSettings;
  onChange: (s: Partial<PinnedProjectsSettings>) => void;
  userRepos: Repository[];
}) {
  const currentNames = new Set(settings.featuredProjects.map((p) => p.name));

  const addRepo = (repo: Repository) => {
    const newProj = {
      name: repo.name,
      description: repo.description || 'Open-source software repository.',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'Code',
      url: repo.html_url,
      demoUrl: repo.homepage || undefined,
    };
    onChange({
      featuredProjects: [...settings.featuredProjects, newProj],
    });
  };

  const removeProject = (index: number) => {
    const updated = [...settings.featuredProjects];
    updated.splice(index, 1);
    onChange({ featuredProjects: updated });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-slate-400 font-medium">Layout Style:</label>
        <div className="flex gap-1.5">
          <button
            onClick={() => onChange({ displayStyle: 'table' })}
            className={`px-2.5 py-1 rounded-lg border text-xs ${
              settings.displayStyle === 'table'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Markdown Table
          </button>
          <button
            onClick={() => onChange({ displayStyle: 'cards' })}
            className={`px-2.5 py-1 rounded-lg border text-xs ${
              settings.displayStyle === 'cards'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Project Cards
          </button>
        </div>
      </div>

      {/* Featured list */}
      <div className="space-y-2">
        <span className="text-slate-400 font-medium">
          Featured Projects ({settings.featuredProjects.length})
        </span>

        {settings.featuredProjects.map((p, i) => (
          <div
            key={p.name}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800"
          >
            <div className="overflow-hidden">
              <span className="font-semibold text-slate-200 block truncate">{p.name}</span>
              <span className="text-[11px] text-slate-400 block truncate">{p.description}</span>
            </div>
            <button
              onClick={() => removeProject(i)}
              className="text-slate-500 hover:text-rose-400 p-1 shrink-0 ml-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Available repos to add */}
      {userRepos.length > 0 && (
        <div className="pt-2 border-t border-slate-800">
          <span className="text-slate-400 text-[11px] block mb-1.5">
            Add from your top repositories:
          </span>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {userRepos
              .filter((r) => !currentNames.has(r.name))
              .slice(0, 10)
              .map((repo) => (
                <button
                  key={repo.name}
                  onClick={() => addRepo(repo)}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  <Plus className="w-3 h-3" />
                  <span>{repo.name}</span>
                  <span className="text-slate-500">⭐{repo.stargazers_count}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SocialConnectEditor({
  settings,
  onChange,
}: {
  settings: SocialLinksSettings;
  onChange: (s: Partial<SocialLinksSettings>) => void;
}) {
  const updateLink = (key: string, val: string) => {
    onChange({
      links: { ...settings.links, [key]: val },
    });
  };

  const fields = [
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'e.g. username or url' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'e.g. handle or url' },
    { key: 'discord', label: 'Discord Invite', placeholder: 'e.g. invite-code' },
    { key: 'portfolio', label: 'Website / Portfolio', placeholder: 'e.g. myportfolio.dev' },
    { key: 'youtube', label: 'YouTube', placeholder: 'e.g. @channel' },
    { key: 'substack', label: 'Substack', placeholder: 'e.g. newsletter' },
    { key: 'email', label: 'Email', placeholder: 'e.g. contact@domain.com' },
  ];

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-slate-400 font-medium mb-1">{f.label}</label>
            <input
              type="text"
              value={(settings.links as any)[f.key] || ''}
              onChange={(e) => updateLink(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
