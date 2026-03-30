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
  color: string
}

export const frontendSkills: Skill[] = [
  { name: "react", color: "from-blue-400 to-cyan-500" },
  { name: "javascript", color: "from-yellow-400 to-yellow-600" },
  { name: "typescript", color: "from-blue-500 to-blue-700" },
  { name: "html", color: "from-orange-500 to-red-600" },
  { name: "css", color: "from-blue-400 to-blue-600" },
  { name: "next.js", color: "from-gray-700 to-gray-900" },
  { name: "vite", color: "from-purple-500 to-purple-700" },
  { name: "tailwind", color: "from-cyan-400 to-blue-500" },
]

export const backendSkills: Skill[] = [
  { name: "python", color: "from-blue-500 to-green-500" },
  { name: "node.js", color: "from-green-500 to-green-700" },
  { name: "sqlite", color: "from-blue-400 to-indigo-600" },
  { name: "postgresql", color: "from-blue-600 to-indigo-800" },
]

export const devopsSkills: Skill[] = [
  { name: "jira", color: "from-blue-400 to-blue-700" },
  { name: "salesforce", color: "from-blue-500 to-indigo-600" },
  { name: "zendesk", color: "from-green-400 to-teal-600" },
  { name: "git", color: "from-orange-500 to-red-600" },
  { name: "bash", color: "from-gray-600 to-gray-800" },
  { name: "docker", color: "from-blue-500 to-blue-700" },
  { name: "linux", color: "from-gray-700 to-gray-900" },
  { name: "nginx", color: "from-green-500 to-green-700" },
]

export const miscSkills: Skill[] = [
  { name: "unity", color: "from-gray-700 to-gray-900" },
  { name: "vscode", color: "from-blue-500 to-blue-700" },
  { name: "unreal", color: "from-purple-500 to-purple-700" },
  { name: "obs", color: "from-gray-600 to-gray-800" },
  { name: "gen ai", color: "from-blue-500 to-indigo-700" },
  { name: "mcp", color: "from-cyan-500 to-blue-600" },
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
    id: "3",
    title: "caravancraft",
    description: "personal smp server for my friend group, visualize via site. includes custom server management, dynmap integration, and player statistics.",
    status: "private",
    techStack: [
      { name: "minecraft", category: "backend" },
      { name: "java", category: "backend" },
      { name: "javascript", category: "frontend" },
      { name: "docker", category: "devops" },
      { name: "nginx", category: "devops" },
    ],
    siteUrl: "https://map.syl.rest",
    statusUrl: "https://panel.syl.rest/status",
    icon: "🎮",
  },
  {
    id: "4",
    title: "dexchat",
    description: "an agentic chatbot that can search a large knowledgebase of pokemon data and answer user queries.",
    status: "in development",
    techStack: [
      { name: "react", category: "frontend" },
      { name: "python", category: "backend" },
      { name: "postgres", category: "database" },
      { name: "openrouter", category: "devops" },
      { name: "agentic ai", category: "devops" },
    ],
    repoUrl: "https://github.com/sylvexn/dexchat",
    siteUrl: "https://dex.syl.rest",
    icon: "🐉",
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
]

// Contact
export interface ContactOption {
  id: string
  label: string
  description: string
  href?: string
  copyValue?: string
  icon: "github" | "twitter" | "linkedin" | "signal" | "email" | "mailto"
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
    id: "mailto",
    icon: "mailto",
    label: "send email",
    description: "open in your mail client",
    href: "mailto:hello@syl.rest",
  },
]
