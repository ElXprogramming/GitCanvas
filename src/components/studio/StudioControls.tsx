'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ReadmeBlockConfig,
  ThemeConfig,
  BioTone,
  Repository,
  DeveloperArchetype,
} from '@/types';
import { DESIGN_THEMES } from '@/designs/themes';
import { DESIGN_FONTS } from '@/designs/fonts';
import SortableBlockItem from './SortableBlockItem';
import { RotateCcw, Palette, Layers, Type } from 'lucide-react';

interface StudioControlsProps {
  blocks: ReadmeBlockConfig[];
  onUpdateBlocks: (blocks: ReadmeBlockConfig[]) => void;
  theme: ThemeConfig;
  onUpdateTheme: (theme: Partial<ThemeConfig>) => void;
  onOpenBadgePicker: () => void;
  onRegenerateAiBio: (tone: BioTone) => void;
  isAiGenerating: boolean;
  userRepos: Repository[];
  archetype: DeveloperArchetype | null;
  onResetDefaults: () => void;
}

export default function StudioControls({
  blocks,
  onUpdateBlocks,
  theme,
  onUpdateTheme,
  onOpenBadgePicker,
  onRegenerateAiBio,
  isAiGenerating,
  userRepos,
  archetype,
  onResetDefaults,
}: StudioControlsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onUpdateBlocks(arrayMove(blocks, oldIndex, newIndex));
      }
    }
  };

  const updateSingleBlock = (updated: ReadmeBlockConfig) => {
    if (
      updated.id === 'github_stats' &&
      updated.settings?.cardTheme &&
      updated.settings.cardTheme !== theme.cardTheme
    ) {
      onUpdateTheme({ cardTheme: updated.settings.cardTheme });
    }
    onUpdateBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleSelectCardTheme = (themeId: string) => {
    onUpdateTheme({ cardTheme: themeId });
    onUpdateBlocks(
      blocks.map((b) =>
        b.id === 'github_stats' || b.id === 'streak_trophies'
          ? { ...b, settings: { ...b.settings, cardTheme: themeId } }
          : b
      )
    );
  };

  const handleSelectCardFont = (fontId: string) => {
    onUpdateTheme({ cardFont: fontId });
    onUpdateBlocks(
      blocks.map((b) =>
        b.id === 'github_stats' || b.id === 'streak_trophies'
          ? { ...b, settings: { ...b.settings, cardFont: fontId } }
          : b
      )
    );
  };

  const themeList = Object.values(DESIGN_THEMES);
  const fontList = Object.values(DESIGN_FONTS);

  return (
    <div className="flex flex-col gap-4">
      {/* Theme Selector */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            Card Theme
          </span>
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset sections to default preset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {themeList.map((t) => {
            const isSelected = (theme.cardTheme || 'default') === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectCardTheme(t.id)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500/80 bg-cyan-950/30 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                  style={{ backgroundColor: t.cardBg }}
                />
                <span className="text-xs font-medium truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Easy-on-the-Eyes Typography Selector */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            Easy-on-the-Eyes Typography
          </span>
          <span className="text-[11px] text-cyan-400 font-medium px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40">
            Top 10 Web Fonts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {fontList.map((f) => {
            const isSelected = (theme.cardFont || 'josefin_slab') === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleSelectCardFont(f.id)}
                className={`flex flex-col p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-cyan-500/80 bg-cyan-950/40 text-white shadow-sm shadow-cyan-900/20 ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{ fontFamily: f.fontFamily }}
                  >
                    {f.label}
                  </span>
                  <span
                    className={`text-[9.5px] px-1.5 py-0.5 rounded font-medium tracking-wide ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {f.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {f.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reorderable Blocks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Layout Sections
          </span>
          <span className="text-[11px] text-slate-500">
            {blocks.filter((b) => b.enabled).length} of {blocks.length} active
          </span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2.5">
              {blocks.map((block) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  onUpdateBlock={updateSingleBlock}
                  onOpenBadgePicker={onOpenBadgePicker}
                  onRegenerateAiBio={onRegenerateAiBio}
                  isAiGenerating={isAiGenerating}
                  userRepos={userRepos}
                  archetype={archetype}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
