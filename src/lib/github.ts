import { Octokit } from '@octokit/rest';
import {
  GitHubUserProfile,
  Repository,
  LanguageDistribution,
  DeveloperArchetype,
  ArchetypeId,
} from '@/types';

// GitHub language colors map (standard GitHub linguist palette)
export const GITHUB_LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  HCL: '#844fba',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  Julia: '#a270ba',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Elixir: '#6e4a7e',
  Zig: '#ec915c',
};

export function getOctokit(token?: string): Octokit {
  const authToken = token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return new Octokit({
    auth: authToken || undefined,
  });
}

export async function fetchUserProfile(
  username: string,
  token?: string
): Promise<GitHubUserProfile> {
  const octokit = getOctokit(token);
  const response = await octokit.rest.users.getByUsername({ username });
  const data = response.data;

  return {
    login: data.login,
    name: data.name ?? null,
    avatar_url: data.avatar_url,
    bio: data.bio ?? null,
    company: data.company ?? null,
    location: data.location ?? null,
    blog: data.blog ?? null,
    twitter_username: data.twitter_username ?? null,
    public_repos: data.public_repos,
    public_gists: data.public_gists,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at,
    html_url: data.html_url,
  };
}

export async function fetchUserRepos(
  username: string,
  token?: string
): Promise<Repository[]> {
  const octokit = getOctokit(token);
  // Fetch up to 100 repositories sorted by updated/pushed
  const response = await octokit.rest.repos.listForUser({
    username,
    per_page: 100,
    sort: 'pushed',
    type: 'owner',
  });

  return response.data.map((repo) => ({
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description ?? null,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count ?? 0,
    forks_count: repo.forks_count ?? 0,
    language: repo.language ?? null,
    topics: repo.topics ?? [],
    homepage: repo.homepage ?? null,
    fork: repo.fork,
    updated_at: repo.updated_at ?? '',
  }));
}

export async function fetchUserLanguages(
  username: string,
  repos: Repository[],
  token?: string
): Promise<LanguageDistribution[]> {
  const octokit = getOctokit(token);
  const languageBytes: Record<string, number> = {};

  // Query top 15 non-fork repos for exact language byte breakdowns
  const targetRepos = repos
    .filter((r) => !r.fork)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 15);

  if (targetRepos.length === 0 && repos.length > 0) {
    // Fallback to whatever repos are available
    targetRepos.push(...repos.slice(0, 10));
  }

  // Fetch languages concurrently with batching
  await Promise.all(
    targetRepos.map(async (repo) => {
      try {
        const { data } = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name,
        });
        for (const [lang, bytes] of Object.entries(data)) {
          languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
        }
      } catch (err) {
        // Fallback to repo's primary language if language API fails or hits secondary limit
        if (repo.language) {
          languageBytes[repo.language] = (languageBytes[repo.language] || 0) + 10000;
        }
      }
    })
  );

  // If languageBytes is empty (e.g. rate limit), count primary languages from repos
  if (Object.keys(languageBytes).length === 0) {
    for (const repo of repos) {
      if (repo.language) {
        languageBytes[repo.language] = (languageBytes[repo.language] || 0) + 10000;
      }
    }
  }

  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
  if (totalBytes === 0) return [];

  const sortedLangs = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
      color: GITHUB_LANG_COLORS[name] || '#8b949e',
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return sortedLangs;
}

export function analyzeArchetype(
  languages: LanguageDistribution[],
  repos: Repository[],
  userBio?: string | null
): DeveloperArchetype {
  const langNames = languages.map((l) => l.name.toLowerCase());
  const bio = (userBio || '').toLowerCase();
  const repoDescriptions = repos
    .map((r) => `${r.name} ${r.description || ''} ${(r.topics || []).join(' ')}`)
    .join(' ')
    .toLowerCase();

  // Category weight scores
  let frontendScore = 0;
  let backendScore = 0;
  let aiDataScore = 0;
  let devopsScore = 0;

  for (const lang of languages) {
    const name = lang.name.toLowerCase();
    const pct = lang.percentage;

    // Frontend weights
    if (['typescript', 'javascript', 'html', 'css', 'scss', 'vue', 'svelte'].includes(name)) {
      frontendScore += pct * 1.0;
    }
    // Backend weights
    if (['go', 'rust', 'java', 'c++', 'c', 'c#', 'elixir', 'php', 'ruby'].includes(name)) {
      backendScore += pct * 1.2;
    }
    // Python can be AI, Backend, or General
    if (name === 'python') {
      if (
        repoDescriptions.includes('ai') ||
        repoDescriptions.includes('machine learning') ||
        repoDescriptions.includes('deep learning') ||
        repoDescriptions.includes('data') ||
        repoDescriptions.includes('torch') ||
        repoDescriptions.includes('llm')
      ) {
        aiDataScore += pct * 1.5;
      } else {
        backendScore += pct * 0.8;
        aiDataScore += pct * 0.4;
      }
    }
    // AI / Data
    if (['jupyter notebook', 'r', 'julia'].includes(name)) {
      aiDataScore += pct * 1.5;
    }
    // DevOps
    if (['dockerfile', 'hcl', 'shell'].includes(name)) {
      devopsScore += pct * 1.8;
    }
  }

  // Keywords in bio & repos
  if (bio.includes('frontend') || bio.includes('react') || bio.includes('ui/ux') || bio.includes('web')) {
    frontendScore += 20;
  }
  if (bio.includes('backend') || bio.includes('distributed') || bio.includes('api') || bio.includes('systems')) {
    backendScore += 20;
  }
  if (bio.includes('ai') || bio.includes('ml') || bio.includes('data scientist') || bio.includes('researcher')) {
    aiDataScore += 25;
  }
  if (bio.includes('devops') || bio.includes('sre') || bio.includes('cloud') || bio.includes('infrastructure')) {
    devopsScore += 25;
  }

  // Find dominant archetype
  const scores: { id: ArchetypeId; score: number }[] = [
    { id: 'frontend', score: frontendScore },
    { id: 'backend', score: backendScore },
    { id: 'ai_data', score: aiDataScore },
    { id: 'devops', score: devopsScore },
  ];

  scores.sort((a, b) => b.score - a.score);

  const highest = scores[0];
  const second = scores[1];

  // If top scores are close or both frontend & backend are strong, designate Full-Stack Generalist
  const isFullstack =
    (frontendScore > 20 && backendScore > 20) ||
    (highest.score - second.score < 15 && highest.score > 25);

  let finalId: ArchetypeId = highest.id;
  if (isFullstack && highest.id !== 'ai_data' && highest.id !== 'devops') {
    finalId = 'fullstack';
  }

  const topLanguages = languages.slice(0, 4).map((l) => l.name);

  switch (finalId) {
    case 'frontend':
      return {
        id: 'frontend',
        label: 'Frontend Architect',
        tagline: 'Designing intuitive, high-performance user interfaces and responsive web experiences.',
        description: 'Specializes in modern component architecture, fluid animations, typography, and interactive client-side systems.',
        score: Math.min(Math.round(frontendScore), 98),
        dominantLanguages: topLanguages,
        recommendedTaglines: [
          'Crafting pixel-perfect, accessible, and delightful digital experiences 🎨',
          'Bridging the intersection of design, engineering, and performance ⚡',
          'Building modern web applications with cutting-edge UI paradigms 🌐',
        ],
        color: '#06B6D4', // cyan-500
        iconName: 'Layout',
      };

    case 'backend':
      return {
        id: 'backend',
        label: 'Backend / Systems Specialist',
        tagline: 'Engineering scalable APIs, resilient distributed systems, and rock-solid databases.',
        description: 'Focuses on concurrency, systems-level efficiency, low-latency microservices, and database architecture.',
        score: Math.min(Math.round(backendScore), 98),
        dominantLanguages: topLanguages,
        recommendedTaglines: [
          'Architecting high-throughput distributed architectures & cloud APIs ⚙️',
          'Obsessed with latency, correctness, memory safety, and concurrency 🛡️',
          'Turning complex business domains into clean, reliable backend systems 🚀',
        ],
        color: '#8B5CF6', // violet-500
        iconName: 'Server',
      };

    case 'ai_data':
      return {
        id: 'ai_data',
        label: 'AI & Data Specialist',
        tagline: 'Building intelligent models, automated data pipelines, and machine learning solutions.',
        description: 'Explores neural networks, NLP, LLM agents, statistical modeling, and data-driven insights.',
        score: Math.min(Math.round(aiDataScore), 98),
        dominantLanguages: topLanguages,
        recommendedTaglines: [
          'Pushing the boundaries of generative AI, neural models, and ML ops 🧠',
          'Extracting signal from noise with data science and deep learning 📊',
          'Building agentic AI tools and cognitive software systems 🤖',
        ],
        color: '#F43F5E', // rose-500
        iconName: 'Brain',
      };

    case 'devops':
      return {
        id: 'devops',
        label: 'DevOps & Cloud Engineer',
        tagline: 'Automating infrastructure, streamlining CI/CD pipelines, and guaranteeing 99.99% uptime.',
        description: 'Masters containers, Kubernetes orchestration, Infrastructure as Code, observability, and security hardening.',
        score: Math.min(Math.round(devopsScore), 98),
        dominantLanguages: topLanguages,
        recommendedTaglines: [
          'Automating all the things: Terraform, Kubernetes, and seamless CI/CD 🚢',
          'Designing observable, self-healing cloud infrastructure at scale ☁️',
          'Empowering developer velocity through modern platform engineering 🛠️',
        ],
        color: '#10B981', // emerald-500
        iconName: 'Cloud',
      };

    case 'fullstack':
    default:
      return {
        id: 'fullstack',
        label: 'Full-Stack Generalist',
        tagline: 'Shipping end-to-end products from elegant frontends down to database schemas.',
        description: 'Versatile problem-solver operating across the entire web stack, balancing UX polish with robust infrastructure.',
        score: Math.min(Math.round((frontendScore + backendScore) / 2) + 20, 98),
        dominantLanguages: topLanguages,
        recommendedTaglines: [
          'Shipping complete web applications from idea to production deployment 🚀',
          'Full-stack craft: from fluid React components to distributed datastores 💡',
          'Bridging product vision, backend reliability, and frontend polish ✨',
        ],
        color: '#F59E0B', // amber-500
        iconName: 'Layers',
      };
  }
}
