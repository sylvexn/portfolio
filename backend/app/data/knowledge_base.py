from typing import List, Dict, Any
from dataclasses import dataclass

@dataclass
class KnowledgeChunk:
    id: str
    category: str
    content: str
    keywords: List[str]
    relevance: float = 0.0

KNOWLEDGE_BASE = [
    KnowledgeChunk(
        id='personal-intro',
        category='personal',
        content='blake bowling (also known as blake b., syl, or sylvexn) is a versatile technology professional with 6 years of technical support experience and a passion for fullstack development. currently working as a tier 1 tech support agent at navigate360, he\'s located in green cove springs, florida. blake has a unique perspective from his technical support background that helps him build robust, user-focused solutions.',
        keywords=['blake', 'bowling', 'syl', 'sylvexn', 'blake b', 'who', 'background', 'bio', 'introduction', 'about', 'personal', 'location', 'florida', 'navigate360']
    ),
    KnowledgeChunk(
        id='personal-interests',
        category='personal',
        content='blake\'s expertise and interests include fullstack development, networking, system administration, devops, agentic ai, and tech support. he\'s exceptional at learning new skills rapidly and adapting to any environment. personal interests include gaming. his career goals are focused on software development as a fullstack developer working with agentic ai.',
        keywords=['interests', 'expertise', 'fullstack', 'networking', 'sysadmin', 'devops', 'agentic', 'ai', 'tech support', 'gaming', 'goals', 'career', 'rapid learner']
    ),
    KnowledgeChunk(
        id='work-navigate360',
        category='work',
        content='currently working as tier 1 technical support agent at navigate360 since february 2024. provides technical support to customers by troubleshooting and resolving software, hardware, and network related issues. also provides remote support for more specific hardware and software issues.',
        keywords=['navigate360', 'current', 'job', 'work', 'tier 1', 'technical support', 'troubleshooting', 'remote support', '2024']
    ),
    KnowledgeChunk(
        id='work-affinitiv',
        category='work',
        content='worked as tier 1 technical support agent at affinitiv from january 2023 to december 2023. handled customer complaints and escalated issues according to procedures. facilitated communication between car dealerships and the autoloop product support teams.',
        keywords=['affinitiv', 'autoloop', 'car dealerships', 'customer complaints', 'escalation', '2023', 'communication']
    ),
    KnowledgeChunk(
        id='work-logicom',
        category='work',
        content='worked as tier 1 technical support agent at logicom usa from january 2021 to january 2023. answered inbound calls to fix and maintain member\'s home internet. worked alongside on-site team members to fix fiber line technical issues. mentored new hires, facilitating their onboarding and training processes.',
        keywords=['logicom', 'home internet', 'fiber line', 'mentoring', 'training', 'onboarding', '2021', '2022', '2023']
    ),
    KnowledgeChunk(
        id='work-unisys',
        category='work',
        content='worked as tier 1 technical support agent at unisys (contract position) from march 2020 to january 2021. answered user inquiries regarding computer software or hardware operation to resolve problems. read technical manuals and conferred with users to provide technical assistance and support.',
        keywords=['unisys', 'contract', 'software', 'hardware', 'technical manuals', 'user assistance', '2020', '2021']
    ),
    KnowledgeChunk(
        id='project-keepsake',
        category='projects',
        content='keepsake is a personal image hosting solution with sharex integration. it features a clean dashboard for managing uploads and provides reliable image hosting with custom urls. currently in production. built using typescript, react, python, flask, sqlite, and shadcn ui. available on github at https://github.com/sylvexn/keepsake',
        keywords=['keepsake', 'image hosting', 'sharex', 'dashboard', 'uploads', 'production', 'typescript', 'react', 'python', 'flask', 'sqlite', 'shadcn']
    ),
    KnowledgeChunk(
        id='project-portfolio',
        category='projects',
        content='portfolio site is the current site you\'re viewing. built with modern animations, interactive components, and responsive design. this is blake\'s personal resume and portfolio site that\'s publicly available. built using react, typescript, tailwind, and shadcn ui. available on github at https://github.com/sylvexn/portfolio and live at https://syl.rest',
        keywords=['portfolio', 'site', 'current site', 'animations', 'interactive', 'responsive', 'resume', 'react', 'typescript', 'tailwind', 'shadcn', 'syl.rest']
    ),
    KnowledgeChunk(
        id='project-caravancraft',
        category='projects',
        content='caravancraft is a personal smp server for blake\'s friend group with visualization via website. includes custom server management, dynmap integration, and player statistics. this is a private project. built using minecraft, java, javascript, docker, and nginx. the map is available at https://map.syl.rest and status at https://panel.syl.rest/status',
        keywords=['caravancraft', 'smp', 'minecraft', 'server', 'friends', 'dynmap', 'statistics', 'private', 'java', 'javascript', 'docker', 'nginx', 'map.syl.rest']
    ),
    KnowledgeChunk(
        id='project-dexchat',
        category='projects',
        content='dexchat is an agentic chatbot that can search a large knowledgebase of pokemon data and answer user queries. currently in development. built using react, python, postgres, openrouter, and agentic ai technologies. available on github at https://github.com/sylvexn/dexchat and live at https://dex.syl.rest',
        keywords=['dexchat', 'agentic', 'chatbot', 'pokemon', 'knowledgebase', 'queries', 'in development', 'react', 'python', 'postgres', 'openrouter', 'agentic ai', 'dex.syl.rest']
    ),
    KnowledgeChunk(
        id='skills-frontend',
        category='skills',
        content='frontend technologies: react, javascript, typescript, html, css, next.js, vite, tailwind css. blake is proficient in modern frontend development with particular expertise in react and typescript for building interactive user interfaces.',
        keywords=['frontend', 'react', 'javascript', 'typescript', 'html', 'css', 'nextjs', 'vite', 'tailwind', 'ui', 'interfaces']
    ),
    KnowledgeChunk(
        id='skills-backend',
        category='skills',
        content='backend technologies: python, node.js, sqlite, postgresql. blake has experience building backend services and managing databases for web applications.',
        keywords=['backend', 'python', 'nodejs', 'node', 'sqlite', 'postgresql', 'databases', 'services']
    ),
    KnowledgeChunk(
        id='skills-devops',
        category='skills',
        content='devops & tools: jira, salesforce, zendesk, git, bash, docker, linux, nginx. blake has experience with various tools for project management, customer support systems, version control, containerization, and server administration.',
        keywords=['devops', 'tools', 'jira', 'salesforce', 'zendesk', 'git', 'bash', 'docker', 'linux', 'nginx', 'containerization', 'servers']
    ),
    KnowledgeChunk(
        id='skills-misc',
        category='skills',
        content='miscellaneous skills: unity, visual studio code, unreal engine, obs, generative ai, mcp (model context protocol). blake also has experience with game development, streaming tools, and ai technologies.',
        keywords=['unity', 'vsc', 'visual studio code', 'unreal', 'obs', 'generative ai', 'mcp', 'model context protocol', 'game development', 'streaming']
    ),
    KnowledgeChunk(
        id='navigation-whoami',
        category='navigation',
        content='the whoami section contains blake\'s personal introduction and background information. it includes details about his experience, personality, and interests. this section helps visitors understand who blake is as a person and professional.',
        keywords=['whoami', 'introduction', 'background', 'personality', 'section', 'navigation']
    ),
    KnowledgeChunk(
        id='navigation-resume',
        category='navigation',
        content='the resume section (also called work history) contains blake\'s professional experience and work history. it includes his roles at navigate360, affinitiv, logicom usa, and unisys. visitors can also download his resume pdf from this section.',
        keywords=['resume', 'work history', 'experience', 'professional', 'download', 'pdf', 'section', 'navigation']
    ),
    KnowledgeChunk(
        id='navigation-skills',
        category='navigation',
        content='the skills section showcases blake\'s technical expertise organized by categories including frontend, backend, devops & tools, and miscellaneous skills. each skill is displayed with its corresponding icon and technology stack information.',
        keywords=['skills', 'technical', 'expertise', 'categories', 'frontend', 'backend', 'devops', 'section', 'navigation']
    ),
    KnowledgeChunk(
        id='navigation-projects',
        category='navigation',
        content='the projects section showcases blake\'s development work including keepsake, portfolio site, caravancraft, and dexchat. each project includes descriptions, tech stack information, status, and links to demos or repositories where available.',
        keywords=['projects', 'development', 'showcase', 'keepsake', 'portfolio', 'caravancraft', 'dexchat', 'section', 'navigation']
    ),
    KnowledgeChunk(
        id='navigation-contact',
        category='navigation',
        content='the contact section provides various ways to get in touch with blake including github, twitter, linkedin, signal (sylvexn.17), email (blakeb12341@gmail.com), and a direct message form. visitors can choose their preferred communication method.',
        keywords=['contact', 'github', 'twitter', 'linkedin', 'signal', 'email', 'message', 'communication', 'section', 'navigation']
    ),
    KnowledgeChunk(
        id='contact-details',
        category='contact',
        content='contact information: github: https://github.com/sylvexn, twitter: https://twitter.com/sylvexn_, linkedin: https://linkedin.com/in/blakeb17, signal: sylvexn.17, email: blakeb12341@gmail.com. for any inquiries, visitors should use the contact modal on this site to reach out directly.',
        keywords=['contact', 'github', 'twitter', 'linkedin', 'signal', 'email', 'sylvexn', 'blakeb17', 'inquiries']
    )
]

def search_knowledge(query: str) -> List[KnowledgeChunk]:
    import re
    query_words = re.sub(r'[^\w\s]', ' ', query.lower()).split()
    query_words = [word for word in query_words if len(word) > 1]
    
    scored_chunks = []
    
    for chunk in KNOWLEDGE_BASE:
        score = 0
        chunk_text = chunk.content.lower()
        chunk_keywords = [k.lower() for k in chunk.keywords]
        
        for word in query_words:
            if any(word in keyword for keyword in chunk_keywords):
                score += 3
            if word in chunk_text:
                score += 2
            if word in chunk.category:
                score += 5
        
        category_boosts = {
            'projects': ['project', 'projects'],
            'skills': ['skill', 'skills', 'technical', 'tech'],
            'contact': ['contact', 'reach', 'touch'],
            'work': ['resume', 'work', 'job', 'experience'],
            'personal': ['who', 'about', 'background', 'personal']
        }
        
        for category, boost_words in category_boosts.items():
            if any(word in query_words for word in boost_words):
                if chunk.category == category:
                    score += 10
        
        if score > 0:
            chunk.relevance = score
            scored_chunks.append(chunk)
    
    return sorted(scored_chunks, key=lambda x: x.relevance, reverse=True)[:5] 