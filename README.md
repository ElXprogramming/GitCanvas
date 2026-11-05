# GitCanvas — GitHub Profile README Studio & Deployer

<div align="center">

![GitCanvas Studio](https://capsule-render.vercel.app/api?type=wave&color=0:06b6d4,100:3b82f6&height=180&section=header&text=GitCanvas&fontSize=50&fontAlignY=38&desc=GitHub%20Profile%20README%20Studio%20%26%20Deployer&descAlignY=62&descSize=18)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

**GitCanvas** ingests your public GitHub portfolio, analyzes your developer archetype, synthesizes tailored bio copy with AI, provides a drag-and-drop visual studio, and deploys directly to your special `<username>/<username>` GitHub profile repository.

</div>

---

## 🚀 Key Features

### 1. Ingestion & Developer Archetype Analyzer
- Fetches public repositories, star counts, fork metrics, and exact language byte distributions via Octokit REST API.
- Automatically categorizes developer archetypes:
  - 🎨 **Frontend Architect** (React, Vue, Svelte, CSS, TypeScript)
  - ⚙️ **Backend / Systems Specialist** (Go, Rust, C++, C, Java, Python, Elixir)
  - 🧠 **AI & Data Specialist** (Jupyter, PyTorch, R, Julia, Python)
  - ☁️ **DevOps & Cloud Engineer** (Terraform, Dockerfile, Kubernetes, Shell)
  - 🚀 **Full-Stack Generalist** (Balanced end-to-end craft)

### 2. Composable Modular Block Engine
- **Hero / Header**: Capsule Render SVG gradients, animated Typing SVG, minimalist ASCII banners, dynamic greetings.
- **About Me / Bio**: Bullet points covering current projects, learning, topics, open collaborations, with **AI-assisted tone modifiers** (*Professional*, *Minimalist*, *Playful / Hacker*, *Storyteller*).
- **Tech Stack & Badges**: 100+ technologies catalog with official SimpleIcons, categorized by Languages, Frontend, Backend, Databases, Cloud & DevOps, and Tools.
- **GitHub Analytics Cards**: High-contrast themes (Catppuccin Mocha, TokyoNight, Nord, Dracula, Radical, OneDark, Gruvbox) for Stats cards, Top Languages, Streak Stats, and GitHub Trophies.
- **Featured Projects**: Responsive Markdown tables and project cards with live stars, forks, and repository links.
- **Social & Connect**: Brand badges for LinkedIn, X/Twitter, Discord, Portfolio, YouTube, Substack, and Email.

### 3. Real-Time GitHub Desktop Simulator
- Split-screen workspace with drag-and-drop block reordering (`@dnd-kit/core` & `@dnd-kit/sortable`).
- Exact GitHub desktop typography, table styling, and Markdown renderer (`react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize`).
- Instant toggle between rendered desktop preview and raw markdown source code.

### 4. Direct GitHub Deployment Engine
- Automatically checks if `github.com/<username>/<username>` repository exists.
- Auto-initializes the special repository if missing.
- Inspects existing `README.md` and generates a unified side-by-side **Diff Preview Modal** (green additions, red deletions) before committing.
- Commits directly to GitHub via `PUT /repos/{owner}/{repo}/contents/README.md`.
- One-click copy with clipboard feedback and download options.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Authentication**: NextAuth.js (Auth.js) with GitHub Provider (`repo`, `read:user` scopes)
- **GitHub Client**: Octokit (`@octokit/rest`)
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Markdown & HTML**: `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize`
- **AI Integration**: Google Generative AI / Gemini API + intelligent contextual fallback engine

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ElXprogramming/GitCanvas.git
cd GitCanvas
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials (or test in zero-friction demo mode):
```ini
# Optional GitHub OAuth
GITHUB_ID=""
GITHUB_SECRET=""

# Server Token for high rate limits on public queries
GITHUB_TOKEN="ghp_..."

# NextAuth Secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret"

# Optional Gemini API Key for LLM bio synthesis
GEMINI_API_KEY=""
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start customizing your GitHub profile.

---

## 📄 License
MIT © GitCanvas
