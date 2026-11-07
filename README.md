<div align="center">

![GitCanvas Studio](https://capsule-render.vercel.app/api?type=wave&color=0:06b6d4,50:3b82f6,100:6366f1&height=190&section=header&text=GitCanvas%20Studio&fontSize=46&fontColor=ffffff&fontAlignY=38&desc=Apple-Inspired%20Bento%20Grid%20%26%20Modular%20GitHub%20Profile%20README%20Deployer&descAlignY=63&descSize=17)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Octokit](https://img.shields.io/badge/GitHub_API-Octokit-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/octokit)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)](LICENSE)

<br />

**GitCanvas** ingests your public GitHub portfolio, detects your developer archetype, synthesizes tailored bio copy with AI, and renders **Apple-inspired Bento Grid**, **Neofetch Terminal CLI**, and **Editorial Minimalist** READMEs with 1-click deployment to `<username>/<username>`.

<p align="center">
  <a href="#-bento-architecture--core-capabilities"><strong>🍱 Bento Features</strong></a> ·
  <a href="#-layout-blueprints"><strong>🎨 Layout Blueprints</strong></a> ·
  <a href="#-quick-start"><strong>🚀 Quick Start</strong></a> ·
  <a href="#-tech-stack"><strong>🛠️ Tech Stack</strong></a>
</p>

<img src="public/assets/bento-grid-preview.jpg" alt="GitCanvas Bento Grid README Preview" width="100%" />

</div>

---

## 🍱 Bento Architecture & Core Capabilities

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🧬 1. Portfolio Ingestion & Archetype Engine</h3>
      <p>Fetches public repositories, star velocity, fork metrics, and byte-level language distributions via the Octokit REST API to classify your engineering profile:</p>
      <ul>
        <li>🎨 <b>Frontend Architect</b> — React, Next.js, TypeScript, CSS</li>
        <li>⚙️ <b>Backend & Systems</b> — Rust, Go, C++, Java, Python</li>
        <li>🧠 <b>AI & Data Specialist</b> — PyTorch, Jupyter, Python, R</li>
        <li>☁️ <b>DevOps & Cloud</b> — Kubernetes, Terraform, Docker, Shell</li>
      </ul>
      <p>
        <img src="https://img.shields.io/badge/Analyzer-Octokit_REST-0ea5e9?style=flat-square" alt="Octokit" />
        <img src="https://img.shields.io/badge/Scoring-Byte_Weighted-10b981?style=flat-square" alt="Scoring" />
      </p>
    </td>
    <td width="50%" valign="top">
      <h3>🍱 2. Multi-Blueprint Markdown Generator</h3>
      <p>Switch seamlessly between top-rated GitHub README architectural styles with zero manual HTML/Markdown wrangling:</p>
      <ul>
        <li>🍱 <b>Bento Grid Dashboard</b> — 2×3 modular HTML table cards</li>
        <li>💻 <b>Neofetch Terminal CLI</b> — ASCII art + system telemetry pane</li>
        <li>✨ <b>Editorial Minimalist</b> — Linear/Vercel high-signal layout</li>
        <li>🧱 <b>Classic Modular Stack</b> — Full-width vertical sections</li>
      </ul>
      <p>
        <img src="https://img.shields.io/badge/Default-Bento_Grid-06b6d4?style=flat-square" alt="Bento Grid" />
        <img src="https://img.shields.io/badge/Themes-Catppuccin_%7C_TokyoNight-8b5cf6?style=flat-square" alt="Themes" />
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🖥️ 3. Real-Time GitHub Desktop Simulator</h3>
      <p>Split-screen visual studio with drag-and-drop block reordering and pixel-accurate GitHub dark mode (<code>#0d1117</code> / <code>#161b22</code>) preview:</p>
      <ul>
        <li>🔄 Drag-and-drop section sorting via <code>@dnd-kit/sortable</code></li>
        <li>👁️ Instant toggle between rendered Bento preview & raw Markdown</li>
        <li>🤖 AI Bio Synthesizer with 4 tones (<i>Professional, Minimalist, Playful, Storyteller</i>)</li>
      </ul>
      <p>
        <img src="https://img.shields.io/badge/Preview-GitHub_GFM-22c55e?style=flat-square" alt="GFM" />
        <img src="https://img.shields.io/badge/AI-Gemini_Bio_Engine-f59e0b?style=flat-square" alt="AI" />
      </p>
    </td>
    <td width="50%" valign="top">
      <h3>🚀 4. Direct GitHub Repository Deployer</h3>
      <p>Commit your generated <code>README.md</code> directly to your special <code>&lt;username&gt;/&lt;username&gt;</code> profile repository without leaving the browser:</p>
      <ul>
        <li>🔍 Auto-verifies & initializes <code>&lt;username&gt;/&lt;username&gt;</code> if missing</li>
        <li>📊 Unified side-by-side <b>Diff Preview Modal</b> before committing</li>
        <li>🔐 Supports GitHub OAuth (NextAuth) or Personal Access Tokens</li>
      </ul>
      <p>
        <img src="https://img.shields.io/badge/Deploy-1_Click_Commit-ec4899?style=flat-square" alt="Deploy" />
        <img src="https://img.shields.io/badge/Safety-Diff_Verification-6366f1?style=flat-square" alt="Diff" />
      </p>
    </td>
  </tr>
</table>

---

## 🎨 Layout Blueprints

| Blueprint | Aesthetic | Key Components | Best For |
|:----------|:----------|:---------------|:---------|
| **🍱 Bento Grid** *(Default)* | Apple-style modular dark cards | Wave header, 2×3 HTML card matrix, S+ rank gauge, compact language bars, 2-col repo cards | Full-Stack, Product & AI Engineers |
| **💻 Terminal CLI** | `neofetch` / Tokyo Night hacker | Monospace `user@gitcanvas` telemetry block, side-by-side stats & streak, CLI repo table | Systems, Rust/Go & DevOps Engineers |
| **✨ Editorial Minimal** | Linear / Vercel / Shadcn | Centered flat-square badges, 2×2 focus matrix, restrained typography | Staff Engineers & Open-Source Maintainers |
| **🧱 Classic Stack** | Traditional GitHub Profile | Full-width stacked sections separated by horizontal dividers | General Developer Portfolios |

---

## 🛠️ Tech Stack

<table width="100%">
  <tr>
    <td width="33%" valign="top">
      <h4>⚡ Core & Frontend</h4>
      <p>
        <img src="https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
        <img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
        <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
      </p>
    </td>
    <td width="33%" valign="top">
      <h4>🧩 Studio & Markdown</h4>
      <p>
        <img src="https://img.shields.io/badge/dnd--kit-6366f1?style=flat-square" alt="dnd-kit" />
        <img src="https://img.shields.io/badge/react--markdown-10b981?style=flat-square" alt="react-markdown" />
        <img src="https://img.shields.io/badge/remark--gfm-0ea5e9?style=flat-square" alt="remark-gfm" />
        <img src="https://img.shields.io/badge/Lucide_Icons-f43f5e?style=flat-square" alt="Lucide" />
      </p>
    </td>
    <td width="34%" valign="top">
      <h4>☁️ APIs & Authentication</h4>
      <p>
        <img src="https://img.shields.io/badge/Octokit_REST-181717?style=flat-square&logo=github&logoColor=white" alt="Octokit" />
        <img src="https://img.shields.io/badge/NextAuth.js-8b5cf6?style=flat-square" alt="NextAuth" />
        <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini" />
      </p>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h4>1. Clone & Install</h4>
      <pre lang="bash"><code>git clone https://github.com/ElXprogramming/GitCanvas.git
cd GitCanvas
npm install</code></pre>
      <h4>2. Launch Development Studio</h4>
      <pre lang="bash"><code>npm run dev</code></pre>
      <p>Open <a href="http://localhost:3000">http://localhost:3000</a> to preview and customize your Bento Grid README live.</p>
    </td>
    <td width="50%" valign="top">
      <h4>3. Optional Environment Variables (<code>.env.local</code>)</h4>
      <pre lang="ini"><code># Optional GitHub OAuth for 1-click session login
GITHUB_ID=""
GITHUB_SECRET=""

# Server token for higher public API rate limits
GITHUB_TOKEN="ghp_..."

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret"

# Optional Gemini API key for AI bio synthesis
GEMINI_API_KEY=""</code></pre>
    </td>
  </tr>
</table>

---

<div align="center">
  <sub>Built with precision for developers • MIT License © <a href="https://github.com/ElXprogramming/GitCanvas">GitCanvas</a></sub>
</div>
