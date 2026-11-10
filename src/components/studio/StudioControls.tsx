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
import {
  DESIGN_THEMES,
  NORMAL_THEMES,
  SHOWCASE_THEMES,
  ON_HOLD_THEMES,
} from '@/designs/themes';
import { ONE_PIECE_MASCOTS } from '@/designs/onepiece-stickers';
import { DESIGN_FONTS } from '@/designs/fonts';
import SortableBlockItem from './SortableBlockItem';
import {
  RotateCcw,
  Palette,
  Layers,
  Type,
  ChevronDown,
  Check,
  Sparkles,
  Clock,
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

  const [isNormalDropdownOpen, setIsNormalDropdownOpen] = React.useState(false);
  const [showOnHold, setShowOnHold] = React.useState(false);
  const normalDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        normalDropdownRef.current &&
        !normalDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNormalDropdownOpen(false);
      }
    };
    if (isNormalDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNormalDropdownOpen]);

  const currentThemeId = theme.cardTheme || 'onepiece_gatling';
  const activeNormalTheme = NORMAL_THEMES.find((t) => t.id === currentThemeId);
  const isNormalSelected = Boolean(activeNormalTheme);
  const isGatlingSelected =
    currentThemeId === 'onepiece_gatling' ||
    currentThemeId === 'gatling' ||
    currentThemeId === 'luffy_gatling';
  const fontList = Object.values(DESIGN_FONTS);

  return (
    <div className="flex flex-col gap-4">
      {/* Theme Selector */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
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

        {/* 1. Premier Showcase: Luffy Gatling (Animated) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300/90 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              One Piece Showcase
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
              Animated GIF &amp; SVG
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              handleSelectCardTheme('onepiece_gatling');
              setIsNormalDropdownOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
              isGatlingSelected
                ? 'border-amber-500/90 bg-gradient-to-r from-amber-950/40 via-red-950/30 to-slate-900 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-amber-500/50 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-slate-900/90 border border-amber-500/40 flex items-center justify-center p-1 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    ONE_PIECE_MASCOTS.luffy_gatling.gifBase64 ||
                    ONE_PIECE_MASCOTS.luffy_gatling.avatarBase64
                  }
                  alt="Luffy Gatling"
                  className="w-full h-full object-contain [image-rendering:pixelated]"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    Luffy Gatling
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    Animated
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">
                  Gomu Gomu no Gatling Punch (Animated)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {isGatlingSelected ? (
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/60">
                  Select
                </span>
              )}
            </div>
          </button>
        </div>

        {/* 2. Normal Colored Themes (Packed in a Dropdown Button) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Normal Colored Themes</span>
            <span className="text-[10px] text-slate-500 font-mono">
              8 Basic Themes in Dropdown
            </span>
          </div>

          <div className="relative" ref={normalDropdownRef}>
            <button
              type="button"
              onClick={() => setIsNormalDropdownOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isNormalSelected
                  ? 'border-cyan-500/80 bg-cyan-950/20 text-white shadow-sm shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isNormalSelected && activeNormalTheme ? (
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-white/25 shadow-sm"
                    style={{ backgroundColor: activeNormalTheme.cardBg }}
                  />
                ) : (
                  <div className="flex -space-x-1 shrink-0">
                    <span className="w-3 h-3 rounded-full border border-slate-900 bg-[#1e1e2e]" />
                    <span className="w-3 h-3 rounded-full border border-slate-900 bg-[#1a1b26]" />
                    <span className="w-3 h-3 rounded-full border border-slate-900 bg-[#282a36]" />
                  </div>
                )}
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-semibold truncate text-slate-200">
                    {isNormalSelected && activeNormalTheme
                      ? `Color Theme: ${activeNormalTheme.label}`
                      : 'Choose Normal Color Theme'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {isNormalSelected && activeNormalTheme
                      ? 'Basic Theme Active · Click to switch'
                      : '8 basic themes: Catppuccin, Tokyo Night, Dracula, Nord…'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {isNormalSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isNormalDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Menu Rack */}
            {isNormalDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 p-2 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 border-b border-slate-800 mb-1">
                  <span>Basic Color Themes</span>
                  <span>8 themes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {NORMAL_THEMES.map((t) => {
                    const isItemActive = currentThemeId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          handleSelectCardTheme(t.id);
                          setIsNormalDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                          isItemActive
                            ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-sm'
                            : 'border-slate-800/80 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                            style={{ backgroundColor: t.cardBg }}
                          />
                          <span className="text-xs font-medium truncate">
                            {t.label}
                          </span>
                        </div>
                        {isItemActive && (
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Themes On Hold (Pending Animation) */}
        <div className="pt-1.5 border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => setShowOnHold((prev) => !prev)}
            className="flex items-center justify-between w-full py-1 text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Other One Piece Themes (11 on hold — pending animation)</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                showOnHold ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showOnHold && (
            <div className="mt-2 space-y-1.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div className="text-[10px] text-amber-400/80 flex items-center gap-1 px-1">
                <span>
                  Static pixel art themes are placed on hold until animated
                  versions are ready.
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {ON_HOLD_THEMES.map((t) => {
                  const isSelected = currentThemeId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectCardTheme(t.id)}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-amber-500/80 bg-amber-950/20 text-white'
                          : 'border-slate-800/60 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {t.mascot && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={t.mascot.avatarBase64}
                          alt={t.mascot.name}
                          className="w-3.5 h-3.5 object-contain shrink-0 [image-rendering:pixelated] opacity-75"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-medium truncate">
                          {t.label}
                        </div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                          On Hold
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
