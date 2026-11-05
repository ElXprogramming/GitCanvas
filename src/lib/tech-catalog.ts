import { TechBadgeItem } from '@/types';

export const TECH_CATALOG: TechBadgeItem[] = [
  // --- Languages ---
  { id: 'typescript', name: 'TypeScript', category: 'languages', logo: 'typescript', bgColor: '3178C6' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', logo: 'javascript', bgColor: 'F7DF1E', logoColor: 'black', labelColor: 'black' },
  { id: 'python', name: 'Python', category: 'languages', logo: 'python', bgColor: '3776AB' },
  { id: 'rust', name: 'Rust', category: 'languages', logo: 'rust', bgColor: '000000' },
  { id: 'go', name: 'Go', category: 'languages', logo: 'go', bgColor: '00ADD8' },
  { id: 'cpp', name: 'C++', category: 'languages', logo: 'cplusplus', bgColor: '00599C' },
  { id: 'c', name: 'C', category: 'languages', logo: 'c', bgColor: 'A8B9CC' },
  { id: 'csharp', name: 'C#', category: 'languages', logo: 'csharp', bgColor: '239120' },
  { id: 'java', name: 'Java', category: 'languages', logo: 'openjdk', bgColor: 'ED8B00' },
  { id: 'swift', name: 'Swift', category: 'languages', logo: 'swift', bgColor: 'F05138' },
  { id: 'kotlin', name: 'Kotlin', category: 'languages', logo: 'kotlin', bgColor: '7F52FF' },
  { id: 'php', name: 'PHP', category: 'languages', logo: 'php', bgColor: '777BB4' },
  { id: 'ruby', name: 'Ruby', category: 'languages', logo: 'ruby', bgColor: 'CC342D' },
  { id: 'dart', name: 'Dart', category: 'languages', logo: 'dart', bgColor: '0175C2' },
  { id: 'lua', name: 'Lua', category: 'languages', logo: 'lua', bgColor: '2C2D72' },
  { id: 'shell', name: 'Bash / Shell', category: 'languages', logo: 'gnubash', bgColor: '4EAA25' },
  { id: 'r', name: 'R', category: 'languages', logo: 'r', bgColor: '276DC3' },
  { id: 'julia', name: 'Julia', category: 'languages', logo: 'julia', bgColor: '9558B2' },

  // --- Frontend ---
  { id: 'react', name: 'React', category: 'frontend', logo: 'react', bgColor: '20232A', logoColor: '61DAFB' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', logo: 'nextdotjs', bgColor: '000000' },
  { id: 'vuejs', name: 'Vue.js', category: 'frontend', logo: 'vuedotjs', bgColor: '4FC08D' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', logo: 'svelte', bgColor: 'FF3E00' },
  { id: 'angular', name: 'Angular', category: 'frontend', logo: 'angular', bgColor: 'DD0031' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frontend', logo: 'tailwindcss', bgColor: '06B6D4' },
  { id: 'html5', name: 'HTML5', category: 'frontend', logo: 'html5', bgColor: 'E34F26' },
  { id: 'css3', name: 'CSS3', category: 'frontend', logo: 'css3', bgColor: '1572B6' },
  { id: 'sass', name: 'Sass', category: 'frontend', logo: 'sass', bgColor: 'CC6699' },
  { id: 'vite', name: 'Vite', category: 'frontend', logo: 'vite', bgColor: '646CFF' },
  { id: 'astro', name: 'Astro', category: 'frontend', logo: 'astro', bgColor: 'BC52EE' },
  { id: 'remix', name: 'Remix', category: 'frontend', logo: 'remix', bgColor: '000000' },
  { id: 'redux', name: 'Redux', category: 'frontend', logo: 'redux', bgColor: '764ABC' },
  { id: 'threejs', name: 'Three.js', category: 'frontend', logo: 'threedotjs', bgColor: '000000' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend', logo: 'bootstrap', bgColor: '7952B3' },

  // --- Backend ---
  { id: 'nodejs', name: 'Node.js', category: 'backend', logo: 'nodedotjs', bgColor: '339933' },
  { id: 'express', name: 'Express.js', category: 'backend', logo: 'express', bgColor: '000000' },
  { id: 'nestjs', name: 'NestJS', category: 'backend', logo: 'nestjs', bgColor: 'E0234E' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', logo: 'fastapi', bgColor: '009688' },
  { id: 'django', name: 'Django', category: 'backend', logo: 'django', bgColor: '092E20' },
  { id: 'flask', name: 'Flask', category: 'backend', logo: 'flask', bgColor: '000000' },
  { id: 'spring', name: 'Spring Boot', category: 'backend', logo: 'springboot', bgColor: '6DB33F' },
  { id: 'laravel', name: 'Laravel', category: 'backend', logo: 'laravel', bgColor: 'FF2D20' },
  { id: 'rails', name: 'Ruby on Rails', category: 'backend', logo: 'rubyonrails', bgColor: 'CC0000' },
  { id: 'dotnet', name: '.NET', category: 'backend', logo: 'dotnet', bgColor: '512BD4' },
  { id: 'graphql', name: 'GraphQL', category: 'backend', logo: 'graphql', bgColor: 'E10098' },
  { id: 'apollo', name: 'Apollo GraphQL', category: 'backend', logo: 'apollographql', bgColor: '311C87' },
  { id: 'grpc', name: 'gRPC', category: 'backend', logo: 'grpc', bgColor: '244C5A' },
  { id: 'trpc', name: 'tRPC', category: 'backend', logo: 'trpc', bgColor: '2596BE' },

  // --- Database ---
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', logo: 'postgresql', bgColor: '4169E1' },
  { id: 'mysql', name: 'MySQL', category: 'database', logo: 'mysql', bgColor: '4479A1' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', logo: 'mongodb', bgColor: '47A248' },
  { id: 'redis', name: 'Redis', category: 'database', logo: 'redis', bgColor: 'DC382D' },
  { id: 'sqlite', name: 'SQLite', category: 'database', logo: 'sqlite', bgColor: '003B57' },
  { id: 'supabase', name: 'Supabase', category: 'database', logo: 'supabase', bgColor: '3ECF8E' },
  { id: 'firebase', name: 'Firebase', category: 'database', logo: 'firebase', bgColor: 'FFCA28', logoColor: 'black' },
  { id: 'prisma', name: 'Prisma', category: 'database', logo: 'prisma', bgColor: '2D3748' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'database', logo: 'elasticsearch', bgColor: '005571' },
  { id: 'mariadb', name: 'MariaDB', category: 'database', logo: 'mariadb', bgColor: '003545' },
  { id: 'neo4j', name: 'Neo4j', category: 'database', logo: 'neo4j', bgColor: '008CC1' },
  { id: 'cassandra', name: 'Apache Cassandra', category: 'database', logo: 'apachecassandra', bgColor: '1287B1' },

  // --- Cloud & DevOps ---
  { id: 'docker', name: 'Docker', category: 'devops', logo: 'docker', bgColor: '2496ED' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', logo: 'kubernetes', bgColor: '326CE5' },
  { id: 'aws', name: 'AWS', category: 'devops', logo: 'amazonwebservices', bgColor: '232F3E', logoColor: 'white' },
  { id: 'gcp', name: 'Google Cloud', category: 'devops', logo: 'googlecloud', bgColor: '4285F4' },
  { id: 'azure', name: 'Microsoft Azure', category: 'devops', logo: 'microsoftazure', bgColor: '0078D4' },
  { id: 'terraform', name: 'Terraform', category: 'devops', logo: 'terraform', bgColor: '7B42BC' },
  { id: 'githubactions', name: 'GitHub Actions', category: 'devops', logo: 'githubactions', bgColor: '2088FF' },
  { id: 'linux', name: 'Linux', category: 'devops', logo: 'linux', bgColor: 'FCC624', logoColor: 'black' },
  { id: 'ubuntu', name: 'Ubuntu', category: 'devops', logo: 'ubuntu', bgColor: 'E95420' },
  { id: 'vercel', name: 'Vercel', category: 'devops', logo: 'vercel', bgColor: '000000' },
  { id: 'netlify', name: 'Netlify', category: 'devops', logo: 'netlify', bgColor: '00C7B7' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'devops', logo: 'cloudflare', bgColor: 'F38020' },
  { id: 'nginx', name: 'NGINX', category: 'devops', logo: 'nginx', bgColor: '009639' },
  { id: 'ansible', name: 'Ansible', category: 'devops', logo: 'ansible', bgColor: 'EE0000' },
  { id: 'prometheus', name: 'Prometheus', category: 'devops', logo: 'prometheus', bgColor: 'E6522C' },
  { id: 'grafana', name: 'Grafana', category: 'devops', logo: 'grafana', bgColor: 'F46800' },

  // --- Tools & Frameworks ---
  { id: 'git', name: 'Git', category: 'tools', logo: 'git', bgColor: 'F05032' },
  { id: 'github', name: 'GitHub', category: 'tools', logo: 'github', bgColor: '181717' },
  { id: 'gitlab', name: 'GitLab', category: 'tools', logo: 'gitlab', bgColor: 'FC6D26' },
  { id: 'vscode', name: 'VS Code', category: 'tools', logo: 'visualstudiocode', bgColor: '007ACC' },
  { id: 'neovim', name: 'Neovim', category: 'tools', logo: 'neovim', bgColor: '57A143' },
  { id: 'postman', name: 'Postman', category: 'tools', logo: 'postman', bgColor: 'FF6C37' },
  { id: 'figma', name: 'Figma', category: 'tools', logo: 'figma', bgColor: 'F24E1E' },
  { id: 'jest', name: 'Jest', category: 'tools', logo: 'jest', bgColor: 'C21325' },
  { id: 'cypress', name: 'Cypress', category: 'tools', logo: 'cypress', bgColor: '69D3A7', logoColor: 'black' },
  { id: 'playwright', name: 'Playwright', category: 'tools', logo: 'playwright', bgColor: '2EAD33' },
  { id: 'pnpm', name: 'pnpm', category: 'tools', logo: 'pnpm', bgColor: 'F69220' },
  { id: 'yarn', name: 'Yarn', category: 'tools', logo: 'yarn', bgColor: '2C8EBB' },
  { id: 'npm', name: 'npm', category: 'tools', logo: 'npm', bgColor: 'CB3837' },
  { id: 'pytorch', name: 'PyTorch', category: 'tools', logo: 'pytorch', bgColor: 'EE4C2C' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'tools', logo: 'tensorflow', bgColor: 'FF6F00' },
  { id: 'pandas', name: 'Pandas', category: 'tools', logo: 'pandas', bgColor: '150458' },
  { id: 'numpy', name: 'NumPy', category: 'tools', logo: 'numpy', bgColor: '013243' },
  { id: 'jupyter', name: 'Jupyter', category: 'tools', logo: 'jupyter', bgColor: 'F37626' },
  { id: 'huggingface', name: 'Hugging Face', category: 'tools', logo: 'huggingface', bgColor: 'FFD21E', logoColor: 'black' },
  { id: 'opencv', name: 'OpenCV', category: 'tools', logo: 'opencv', bgColor: '5C3EE8' },
];

export const BADGE_CATEGORIES = [
  { id: 'all', label: 'All Badges' },
  { id: 'languages', label: 'Languages' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Databases' },
  { id: 'devops', label: 'Cloud & DevOps' },
  { id: 'tools', label: 'Tools & AI' },
] as const;

export function buildBadgeUrl(item: TechBadgeItem, style: string = 'for-the-badge'): string {
  const cleanName = encodeURIComponent(item.name.replace(/-/g, '--'));
  const logoParam = item.logo ? `&logo=${item.logo}` : '';
  const logoColorParam = item.logoColor ? `&logoColor=${item.logoColor}` : '&logoColor=white';
  const labelColorParam = item.labelColor ? `&labelColor=${item.labelColor}` : '';
  return `https://img.shields.io/badge/${cleanName}-${item.bgColor}?style=${style}${logoParam}${logoColorParam}${labelColorParam}`;
}
