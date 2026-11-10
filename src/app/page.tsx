'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  GitHubUserProfile,
  DeveloperArchetype,
  LanguageDistribution,
  Repository,
  ReadmeBlockConfig,
  ThemeConfig,
  BioTone,
  TechBadgeItem,
  PinnedProjectItem,
} from '@/types';
import { createDefaultBlocks } from '@/lib/default-state';
import { generateMarkdown } from '@/lib/markdown-generator';
import Navbar from '@/components/layout/Navbar';
import ArchetypeBanner from '@/components/studio/ArchetypeBanner';
import StudioControls from '@/components/studio/StudioControls';
import GitHubSimulator from '@/components/studio/GitHubSimulator';
import BadgePickerModal from '@/components/studio/BadgePickerModal';
import DiffDeployModal from '@/components/studio/DiffDeployModal';
import PersonalTokenModal from '@/components/studio/PersonalTokenModal';
import { useToast } from '@/components/common/Toast';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function GitCanvasPage() {
  const { data: session, status: authStatus } = useSession();
  const { showToast } = useToast();

  const [username, setUsername] = useState('ElXprogramming');
  const [profile, setProfile] = useState<GitHubUserProfile | null>(null);
  const [archetype, setArchetype] = useState<DeveloperArchetype | null>(null);
  const [languages, setLanguages] = useState<LanguageDistribution[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [pinnedProjects, setPinnedProjects] = useState<PinnedProjectItem[]>([]);
  const [blocks, setBlocks] = useState<ReadmeBlockConfig[]>(() =>
    createDefaultBlocks(null, null, [], [])
  );

  const [theme, setTheme] = useState<ThemeConfig>({
    accentColor: 'cyan',
    cardTheme: 'default',
    badgeStyle: 'for-the-badge',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [personalToken, setPersonalToken] = useState<string>('');

  // Modals state
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isBadgePickerOpen, setIsBadgePickerOpen] = useState(false);

  // Load saved token from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('gitcanvas_personal_token');
      if (savedToken) {
        setPersonalToken(savedToken);
      }
    } catch (_) {}
  }, []);

  const handleSaveToken = (token: string) => {
    setPersonalToken(token);
    try {
      if (token) {
        localStorage.setItem('gitcanvas_personal_token', token);
      } else {
        localStorage.removeItem('gitcanvas_personal_token');
      }
    } catch (_) {}
  };

  // Fetch GitHub User Data
  const loadUserData = useCallback(
    async (userToLoad: string, forceRefresh = false) => {
      if (!userToLoad) return;
      setIsLoading(true);

      try {
        const headers: Record<string, string> = {};
        if (personalToken) {
          headers['Authorization'] = `Bearer ${personalToken}`;
        }

        const url = `/api/github/profile?username=${encodeURIComponent(userToLoad)}${
          forceRefresh ? '&refresh=true' : ''
        }`;
        const res = await fetch(url, { headers });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load GitHub user data');
        }

        setUsername(data.profile.login);
        setProfile(data.profile);
        setArchetype(data.archetype);
        setLanguages(data.languages || []);
        setRepositories(data.repos || []);
        setPinnedProjects(data.pinnedProjects || []);

        // Create default blocks configured to this user's archetype & tech
        const initialBlocks = createDefaultBlocks(
          data.profile,
          data.archetype,
          data.languages || [],
          data.repos || [],
          data.pinnedProjects || []
        );
        setBlocks(initialBlocks);

        showToast(
          'success',
          forceRefresh ? `Refreshed @${data.profile.login}` : `Loaded @${data.profile.login}`,
          `Archetype detected: ${data.archetype?.label || 'Developer'}`
        );
      } catch (err: any) {
        showToast('error', 'Profile Load Error', err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [personalToken, showToast]
  );

  // Auto-load session user if authenticated, or load default demo profile
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user) {
      const sessionUser =
        (session as any).user?.login ||
        (session.user.name ? session.user.name.split(' ')[0] : 'ElXprogramming');
      loadUserData(sessionUser);
    } else if (authStatus === 'unauthenticated' && !profile) {
      loadUserData('ElXprogramming');
    }
  }, [authStatus, session, loadUserData, profile]);

  // Generate markdown from blocks & selected theme
  const generatedMarkdown = useMemo(() => {
    return generateMarkdown(
      blocks,
      profile,
      archetype,
      theme.cardTheme || 'default',
      username
    );
  }, [blocks, profile, archetype, theme.cardTheme, username]);

  // AI Bio Regeneration
  const handleRegenerateAiBio = async (tone: BioTone) => {
    if (!profile) return;
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.login,
          name: profile.name || profile.login,
          archetypeId: archetype?.id || 'fullstack',
          archetypeLabel: archetype?.label || 'Software Engineer',
          dominantLanguages: languages.slice(0, 4).map((l) => l.name),
          tone,
          company: profile.company || undefined,
          location: profile.location || undefined,
          existingBio: profile.bio || undefined,
          topRepoNames: repositories.slice(0, 4).map((r) => r.name),
        }),
      });

      const aiData = await res.json();
      if (!res.ok) {
        throw new Error(aiData.error || 'Failed to synthesize AI bio');
      }

      // Update Bio block settings and enable it so user sees the synthesized bio
      setBlocks((prev) =>
        prev.map((block) => {
          if (block.id === 'bio') {
            return {
              ...block,
              enabled: true,
              settings: {
                ...block.settings,
                tone,
                workingOn: aiData.workingOn || block.settings.workingOn,
                learning: aiData.learning || block.settings.learning,
                askMeAbout: aiData.askMeAbout || block.settings.askMeAbout,
                reachMe: aiData.reachMe || block.settings.reachMe,
                openFor: aiData.openFor || block.settings.openFor,
                funFact: aiData.funFact || block.settings.funFact,
              },
            };
          }
          if (block.id === 'hero' && aiData.tagline) {
            return {
              ...block,
              settings: {
                ...block.settings,
                tagline: aiData.tagline,
              },
            };
          }
          return block;
        })
      );

      showToast(
        'success',
        'AI Bio Synthesized!',
        `Custom copy generated with "${tone}" tone.`
      );
    } catch (err: any) {
      showToast('error', 'AI Generation Failed', err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    showToast('success', 'Copied to Clipboard!', 'Markdown is ready to paste.');
  };

  // Toggle Badge in Tech Stack
  const handleToggleBadge = (badge: TechBadgeItem) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === 'tech_stack') {
          const current: TechBadgeItem[] = block.settings.selectedBadges || [];
          const exists = current.some((b) => b.id === badge.id);
          const updated = exists
            ? current.filter((b) => b.id !== badge.id)
            : [...current, badge];
          return {
            ...block,
            settings: {
              ...block.settings,
              showCategoryHeaders: true,
              selectedBadges: updated,
            },
          };
        }
        return block;
      })
    );
  };

  // Add Custom Badge
  const handleAddCustomBadge = (badge: TechBadgeItem) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === 'tech_stack') {
          const current: TechBadgeItem[] = block.settings.selectedBadges || [];
          return {
            ...block,
            settings: {
              ...block.settings,
              showCategoryHeaders: true,
              selectedBadges: [...current, badge],
            },
          };
        }
        return block;
      })
    );
    showToast('info', 'Badge Added', `Added ${badge.name} to tech stack.`);
  };

  // Reset to default presets
  const handleResetDefaults = () => {
    if (profile) {
      const resetBlocks = createDefaultBlocks(
        profile,
        archetype,
        languages,
        repositories,
        pinnedProjects
      );
      setBlocks(resetBlocks);
      showToast('info', 'Reset Sections', 'Restored default block configurations.');
    }
  };

  const techStackBlock = blocks.find((b) => b.id === 'tech_stack');
  const selectedBadges = techStackBlock?.settings?.selectedBadges || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      {/* Top Navigation */}
      <Navbar
        currentUsername={username}
        onSearchUser={loadUserData}
        isLoading={isLoading}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onCopyMarkdown={handleCopyMarkdown}
        hasPersonalToken={!!personalToken}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 lg:p-6">
        {(isLoading || authStatus === 'loading') && !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Ingesting GitHub Portfolio Data & Synthesizing Archetype...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Studio Customizer Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Profile & Archetype Banner */}
              <ArchetypeBanner
                profile={profile}
                archetype={archetype}
                languages={languages}
              />

              {/* Modular Block Controls */}
              <StudioControls
                blocks={blocks}
                onUpdateBlocks={setBlocks}
                theme={theme}
                onUpdateTheme={(partial) => setTheme((t) => ({ ...t, ...partial }))}
                onOpenBadgePicker={() => setIsBadgePickerOpen(true)}
                onRegenerateAiBio={handleRegenerateAiBio}
                isAiGenerating={isAiGenerating}
                userRepos={repositories}
                archetype={archetype}
                onResetDefaults={handleResetDefaults}
              />
            </div>

            {/* Right Panel: Live GitHub README Simulator (7 cols) */}
            <div className="lg:col-span-7 sticky top-20">
              <GitHubSimulator
                markdown={generatedMarkdown}
                username={username}
                onCopyMarkdown={handleCopyMarkdown}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <BadgePickerModal
        isOpen={isBadgePickerOpen}
        onClose={() => setIsBadgePickerOpen(false)}
        selectedBadges={selectedBadges}
        onToggleBadge={handleToggleBadge}
        onAddCustomBadge={handleAddCustomBadge}
        badgeStyle={techStackBlock?.settings?.badgeStyle || 'for-the-badge'}
      />

      <DiffDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        markdown={generatedMarkdown}
        username={username}
        personalToken={personalToken}
        isOAuthAuthenticated={authStatus === 'authenticated'}
        onOpenTokenModal={() => {
          setIsDeployModalOpen(false);
          setIsTokenModalOpen(true);
        }}
      />

      <PersonalTokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        token={personalToken}
        onSaveToken={handleSaveToken}
      />
    </div>
  );
}
