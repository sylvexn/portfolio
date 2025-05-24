# portfolio

A modern portfolio website built with React, TypeScript, and Tailwind CSS featuring a black/white/gold theme.

## tech stack

- **runtime**: bun
- **framework**: react 19.1.0  
- **language**: typescript
- **build tool**: vite
- **styling**: tailwind css v4
- **ui library**: shadcn/ui

## setup

1. install dependencies:
```bash
bun install
```

2. add shadcn/ui components:
```bash
bunx shadcn@latest add dialog button badge card form label input textarea select switch
```

3. start development server:
```bash
bun dev
```

## project structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── backgrounds/     # background components  
│   ├── text-animations/ # text animation components
│   └── animations/      # general animation components
└── lib/
    └── utils.ts         # utility functions
```

## features

- dark/light mode toggle
- responsive design
- gold accent theme
- modal-based navigation
- smooth animations
- modern ui components

## development

the project uses a single-page application architecture with modal overlays. all sections open as centered modals with backdrop blur using shadcn dialog component.

run `bun dev` to start development server and view at `http://localhost:5173` 