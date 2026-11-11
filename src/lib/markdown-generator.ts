import {
  ReadmeBlockConfig,
  GitHubUserProfile,
  DeveloperArchetype,
} from '@/types';
import {
  generateMainReadmeLayout,
} from '@/designs/readme-layout';

/**
 * Generates the single Main Layout defined in src/designs/readme-layout.ts.
 * All other legacy layouts have been removed so only the main layout is used.
 */
export function generateMarkdown(
  blocks: ReadmeBlockConfig[],
  profile: GitHubUserProfile | null,
  _archetype?: DeveloperArchetype | null,
  cardTheme = 'default',
  fallbackUsername = 'ElXprogramming',
  cardFont?: string
): string {
  return generateMainReadmeLayout(
    blocks,
    profile,
    cardTheme,
    fallbackUsername,
    cardFont
  );
}
