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
import SortableBlockItem from './SortableBlockItem';
import { RotateCcw, Palette, Layers } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-4">
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
