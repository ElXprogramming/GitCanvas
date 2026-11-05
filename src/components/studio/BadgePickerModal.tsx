'use client';

import React, { useState } from 'react';
import { TechBadgeItem } from '@/types';
import { TECH_CATALOG, BADGE_CATEGORIES, buildBadgeUrl } from '@/lib/tech-catalog';
import { Search, X, Check, Plus } from 'lucide-react';

interface BadgePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBadges: TechBadgeItem[];
  onToggleBadge: (badge: TechBadgeItem) => void;
  onAddCustomBadge: (custom: TechBadgeItem) => void;
  badgeStyle: string;
}

export default function BadgePickerModal({
  isOpen,
  onClose,
  selectedBadges,
  onToggleBadge,
  onAddCustomBadge,
  badgeStyle,
}: BadgePickerModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customColor, setCustomColor] = useState('06B6D4');

  if (!isOpen) return null;

  const selectedIds = new Set(selectedBadges.map((b) => b.id));

  const filteredBadges = TECH_CATALOG.filter((b) => {
    const matchesCategory =
      activeCategory === 'all' || b.category === activeCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newBadge: TechBadgeItem = {
      id: customName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      name: customName.trim(),
      category: 'tools',
      logo: '',
      bgColor: customColor.replace('#', '') || '06B6D4',
    };
    onAddCustomBadge(newBadge);
    setCustomName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h3 className="text-base font-bold text-slate-100">Tech Badge Catalog</h3>
            <p className="text-xs text-slate-400">
              Select or search from 100+ technologies with official brand icons
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Category Tabs */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technologies (e.g. React, Docker, Rust)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BADGE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredBadges.map((badge) => {
            const isSelected = selectedIds.has(badge.id);
            return (
              <button
                key={badge.id}
                onClick={() => onToggleBadge(badge)}
                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={buildBadgeUrl(badge, badgeStyle)}
                    alt={badge.name}
                    className="max-h-5 object-contain"
                  />
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1 transition-colors ${
                    isSelected ? 'bg-cyan-500 text-white' : 'border border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Badge Creator & Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleCreateCustom} className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">Add Custom:</span>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Bun or Solodity"
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="color"
              value={`#${customColor}`}
              onChange={(e) => setCustomColor(e.target.value.replace('#', ''))}
              className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
              title="Pick badge color"
            />
            <button
              type="submit"
              disabled={!customName.trim()}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition-colors"
          >
            Done ({selectedBadges.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
}
