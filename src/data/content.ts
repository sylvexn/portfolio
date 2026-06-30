// Resume PDF URL from Cloudflare R2
export const RESUME_URL = "https://cdn.syl.rest/bbresume_2025-1.pdf"

// Bio / About
export const bio = {
  name: "Blake B.",
  location: "Florida, USA",
  tagline: "versatile technology professional with 6 years of technical support experience and a passion for fullstack development, networking, and system administration.",
  description: "my background in solving complex technical issues has given me a unique perspective on building robust, user-focused solutions.",
}

export const heroIdentity = {
  greeting: "hello world",
  intro: "my name is",
  name: bio.name.toLowerCase(),
  location: `based in ${bio.location.toLowerCase()}`,
  titles: [
    "fullstack developer",
    "devops practitioner",
    "tech support specialist",
    "networking and sysadmin enthusiast",
    "automation-focused builder",
  ],
}

export const seo = {
  title: "blake b. | portfolio",
  description:
    "blake b. - fullstack developer and technical support specialist building reliable, user-focused systems in florida, usa",
  ogTitle: "blake b. | portfolio",
  ogDescription:
    "fullstack developer and technical support specialist building reliable systems in florida, usa",
  ogUrl: "https://syl.rest",
  themeColor: "#d9ff3f",
}

export const interests = [
  { name: "fullstack dev", color: "bg-indigo-600 hover:bg-indigo-700" },
  { name: "networking", color: "bg-emerald-600 hover:bg-emerald-700" },
  { name: "sysadmin", color: "bg-blue-600 hover:bg-blue-700" },
  { name: "devops", color: "bg-purple-600 hover:bg-purple-700" },
  { name: "agentic AI", color: "bg-rose-600 hover:bg-rose-700" },
  { name: "tech support", color: "bg-teal-600 hover:bg-teal-700" },
]

// Work Experience
export interface ExperienceItem {
  title: string
  company: string
  duration: string
  responsibilities: string[]
}

export const experience: ExperienceItem[] = [
  {
    title: "tier 1 technical support agent",
    company: "Navigate360",
    duration: "feb 2024 - present",
    responsibilities: [
      "provide technical support to customers by troubleshooting and resolving software, hardware, and network related issues.",
      "provide remote support for more specific hardware and software issues.",
    ],
  },
  {
    title: "tier 1 technical support agent",
    company: "Affinitiv",
    duration: "jan 2023 - dec 2023",
    responsibilities: [
      "handled customer complaints and escalated issues according to procedures.",
      "facilitated communication between car dealerships and the autoloop product support teams.",
    ],
  },
  {
    title: "tier 1 technical support agent",
    company: "Logicom USA",
    duration: "jan 2021 - jan 2023",
    responsibilities: [
      "answered inbound calls to fix and maintain member's home internet.",
      "worked alongside on-site team members to fix fiber line technical issues.",
      "mentored new hires, facilitating their onboarding and training processes.",
    ],
  },
  {
    title: "tier 1 technical support agent",
    company: "unisys (contract)",
    duration: "mar 2020 - jan 2021",
    responsibilities: [
      "answer user inquiries regarding computer software or hardware operation to resolve problems.",
      "read technical manuals and confer with users to provide technical assistance and support.",
    ],
  },
]

// Skills
export interface Skill {
  name: string
  icon: string // key into skillIcons map
}

export const frontendSkills: Skill[] = [
  { name: "react", icon: "react" },
  { name: "javascript", icon: "javascript" },
  { name: "typescript", icon: "typescript" },
  { name: "html", icon: "html" },
  { name: "css", icon: "css" },
  { name: "next.js", icon: "nextjs" },
  { name: "vite", icon: "vite" },
  { name: "tailwind", icon: "tailwind" },
]

export const backendSkills: Skill[] = [
  { name: "python", icon: "python" },
  { name: "node.js", icon: "nodejs" },
  { name: "sqlite", icon: "sqlite" },
  { name: "postgresql", icon: "postgresql" },
]

export const devopsSkills: Skill[] = [
  { name: "jira", icon: "jira" },
  { name: "salesforce", icon: "salesforce" },
  { name: "zendesk", icon: "zendesk" },
  { name: "git", icon: "git" },
  { name: "bash", icon: "bash" },
  { name: "docker", icon: "docker" },
  { name: "linux", icon: "linux" },
  { name: "nginx", icon: "nginx" },
]

export const miscSkills: Skill[] = [
  { name: "unity", icon: "unity" },
  { name: "vscode", icon: "vscode" },
  { name: "unreal", icon: "unreal" },
  { name: "obs", icon: "obs" },
  { name: "gen ai", icon: "genai" },
  { name: "mcp", icon: "mcp" },
]

// Projects
export interface TechItem {
  name: string
  category: "frontend" | "backend" | "database" | "devops"
}

export interface Project {
  id: string
  title: string
  description: string
  status: "in production" | "public" | "private" | "in development"
  techStack: TechItem[]
  repoUrl?: string
  siteUrl?: string
  statusUrl?: string
  icon: string
}

export const projects: Project[] = [
  {
    id: "6",
    title: "cannoli",
    description: "pokemon draft tournament league platform — replaces a google sheets + discord workflow with a unified app for drafting, team building, matchup analysis, trading, and stats. real-time websocket drafts, a multi-tab matchup center, trade block, and full admin tooling. the linked site is an interactive demo running on sample season data.",
    status: "in production",
    techStack: [
      { name: "react", category: "frontend" },
      { name: "typescript", category: "frontend" },
      { name: "tailwind", category: "frontend" },
      { name: "shadcn ui", category: "frontend" },
      { name: "bun", category: "backend" },
      { name: "elysia", category: "backend" },
      { name: "websockets", category: "backend" },
      { name: "sqlite", category: "database" },
      { name: "docker", category: "devops" },
    ],
    siteUrl: "https://mock.cannoli.live",
    icon: "🏆",
  },
  {
    id: "1",
    title: "keepsake",
    description: "personal image hosting solution with sharex integration. features a clean dashboard for managing uploads and provides reliable image hosting with custom urls.",
    status: "in production",
    techStack: [
      { name: "typescript", category: "frontend" },
      { name: "react", category: "frontend" },
      { name: "python", category: "backend" },
      { name: "flask", category: "backend" },
      { name: "sqlite", category: "database" },
      { name: "shadcn ui", category: "frontend" },
    ],
    repoUrl: "https://github.com/sylvexn/keepsake",
    icon: "🖼️",
  },
  {
    id: "2",
    title: "portfolio site",
    description: "personal resume and portfolio site. the site you're on. built with modern animations, interactive components, and responsive design.",
    status: "public",
    techStack: [
      { name: "react", category: "frontend" },
      { name: "typescript", category: "frontend" },
      { name: "tailwind", category: "frontend" },
      { name: "shadcn ui", category: "frontend" },
    ],
    repoUrl: "https://github.com/sylvexn/portfolio",
    siteUrl: "https://syl.rest",
    icon: "🌐",
  },
  {
    id: "5",
    title: "waterh",
    description: "live hydration dashboard — reverse-engineered smart water bottle BLE protocol, custom collector + API + visualization.",
    status: "in production",
    techStack: [
      { name: "javascript", category: "frontend" },
      { name: "chart.js", category: "frontend" },
      { name: "python", category: "backend" },
      { name: "sqlite", category: "database" },
      { name: "docker", category: "devops" },
    ],
    repoUrl: "https://github.com/sylvexn/water",
    siteUrl: "https://water.syl.rest",
    icon: "💧",
  },
  {
    id: "7",
    title: "escape u",
    description: "commercial site for a st. augustine escape room venue — three cinematic, story-driven rooms with difficulty ratings, online booking, and group/event packages. features an animated review waterfall and astro view transitions for snappy, app-like page navigation.",
    status: "in production",
    techStack: [
      { name: "astro", category: "frontend" },
      { name: "typescript", category: "frontend" },
      { name: "tailwind", category: "frontend" },
    ],
    siteUrl: "https://escapeuflorida.com",
    icon: "🔓",
  },
  {
    id: "8",
    title: "holtsinger construction",
    description: "marketing and lead-generation site for a family-owned florida commercial construction company operating since 1982. showcases services from tenant buildouts to custom millwork, with a project inquiry contact form.",
    status: "in production",
    techStack: [
      { name: "react", category: "frontend" },
      { name: "typescript", category: "frontend" },
      { name: "vite", category: "frontend" },
      { name: "tailwind", category: "frontend" },
    ],
    siteUrl: "https://holtcon.com",
    icon: "🏗️",
  },
]

// Contact
export interface ContactOption {
  id: string
  label: string
  description: string
  href?: string
  copyValue?: string
  icon: "github" | "twitter" | "linkedin" | "signal" | "email" | "message"
}

export const contactOptions: ContactOption[] = [
  {
    id: "github",
    icon: "github",
    label: "github",
    description: "check out my code repositories",
    href: "https://github.com/sylvexn",
  },
  {
    id: "twitter",
    icon: "twitter",
    label: "twitter",
    description: "follow me for updates",
    href: "https://twitter.com/sylvexn_",
  },
  {
    id: "linkedin",
    icon: "linkedin",
    label: "linkedin",
    description: "connect with me professionally",
    href: "https://linkedin.com/in/blakeb17",
  },
  {
    id: "signal",
    icon: "signal",
    label: "signal",
    description: "sylvexn.17 — click to copy",
    copyValue: "sylvexn.17",
  },
  {
    id: "email",
    icon: "email",
    label: "email",
    description: "hello@syl.rest — click to copy",
    copyValue: "hello@syl.rest",
  },
  {
    id: "message",
    icon: "message",
    label: "message me",
    description: "send me a direct message",
  },
]
