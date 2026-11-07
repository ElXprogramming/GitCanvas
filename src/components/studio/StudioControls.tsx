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
  LayoutTemplateId,
} from '@/types';
import SortableBlockItem from './SortableBlockItem';
import {
  RotateCcw,
  Palette,
  Layers,
  LayoutGrid,
  Terminal,
  Sparkles,
  FileCode2,
} from 'lucide-react';

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
    onUpdateBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)));
  };

  const accentColors = [
    { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
    { id: 'violet', label: 'Violet', bg: 'bg-violet-500' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'sunset', label: 'Sunset', bg: 'bg-amber-500' },
  ];

  const layoutBlueprints: {
    id: LayoutTemplateId;
    label: string;
    badge?: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'bento',
      label: 'Bento Grid',
      badge: 'Top Rated',
      desc: 'Apple-inspired 2×3 modular dashboard cards',
      icon: <LayoutGrid className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'terminal',
      label: 'Terminal CLI',
      desc: 'Neofetch telemetry + monospace repo table',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'editorial',
      label: 'Editorial Minimal',
      desc: 'Linear / Vercel style high-signal grid',
      icon: <Sparkles className="w-4 h-4 text-violet-400" />,
    },
    {
      id: 'classic',
      label: 'Classic Stack',
      desc: 'Traditional full-width vertical sections',
      icon: <FileCode2 className="w-4 h-4 text-amber-400" />,
    },
  ];

  const activeLayout = theme.layoutTemplate || 'bento';

  return (
    <div className="flex flex-col gap-4">
      {/* Layout Blueprint Selector */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
            README Layout Blueprint
          </span>
          <span className="text-[11px] text-cyan-400 font-medium">
            Instant Live Switch
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {layoutBlueprints.map((bp) => {
            const isSelected = activeLayout === bp.id;
            return (
              <button
                key={bp.id}
                onClick={() => onUpdateTheme({ layoutTemplate: bp.id })}
                className={`flex flex-col items-start text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-cyan-500/80 bg-cyan-950/30 shadow-sm shadow-cyan-950/50'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    {bp.icon}
                    <span className="text-xs font-semibold text-slate-100">
                      {bp.label}
                    </span>
                  </div>
                  {bp.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {bp.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 leading-tight">
                  {bp.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Studio Header & Quick Global Styling */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Color Accent:</span>
          <div className="flex items-center gap-1.5 ml-1">
            {accentColors.map((acc) => (
              <button
                key={acc.id}
                onClick={() => onUpdateTheme({ accentColor: acc.id })}
                className={`w-5 h-5 rounded-full ${acc.bg} transition-transform ${
                  theme.accentColor === acc.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={acc.label}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          title="Reset sections to default preset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>
      </div>

      {/* Reorderable Blocks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            README Sections (Drag to Reorder)
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
