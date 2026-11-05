'use client';

import React from 'react';
import {
  GitHubUserProfile,
  DeveloperArchetype,
  LanguageDistribution,
} from '@/types';
import {
  Layout,
  Server,
  Brain,
  Cloud,
  Layers,
  MapPin,
  Building,
  Users,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';

interface ArchetypeBannerProps {
  profile: GitHubUserProfile | null;
  archetype: DeveloperArchetype | null;
  languages: LanguageDistribution[];
}

export default function ArchetypeBanner({
  profile,
  archetype,
  languages,
}: ArchetypeBannerProps) {
  if (!profile) return null;

  const getArchetypeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'Brain':
        return <Brain className="w-4 h-4" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4" />;
      case 'Layers':
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
      {/* Subtle background glow based on archetype color */}
      <div
        className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: archetype?.color || '#06B6D4' }}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3.5">
          <img
            src={profile.avatar_url}
            alt={profile.login}
            className="w-14 h-14 rounded-full border-2 border-slate-700/80 shadow-md object-cover"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-slate-100">
                {profile.name || profile.login}
              </h2>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-0.5"
              >
                @{profile.login}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {profile.bio && (
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 max-w-md">
                {profile.bio}
              </p>
            )}

            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 flex-wrap">
              {profile.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {profile.company}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FolderGit2 className="w-3 h-3" />
                {profile.public_repos} repos
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {profile.followers} followers
              </span>
            </div>
          </div>
        </div>

        {/* Archetype Badge & Score */}
        {archetype && (
          <div className="flex flex-col items-start sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border"
              style={{
                backgroundColor: `${archetype.color}15`,
                borderColor: `${archetype.color}40`,
                color: archetype.color,
              }}
            >
              {getArchetypeIcon(archetype.iconName)}
              <span>{archetype.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
                {archetype.score}%
              </span>
            </div>

            {/* Language Breakdown Bar */}
            {languages.length > 0 && (
              <div className="mt-2.5 w-full sm:w-48">
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  {languages.slice(0, 5).map((lang) => (
                    <div
                      key={lang.name}
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1 overflow-x-auto text-[10px] text-slate-400">
                  {languages.slice(0, 3).map((lang) => (
                    <span key={lang.name} className="flex items-center gap-1 whitespace-nowrap">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      {lang.name} {lang.percentage}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
