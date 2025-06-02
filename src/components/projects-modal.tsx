import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ProjectsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TechItem {
  name: string
  category: string
}

interface Project {
  id: string
  title: string
  description: string
  status: string
  techStack: TechItem[]
  repoUrl?: string
  siteUrl?: string
  statusUrl?: string
  icon: string
}

const PROJECTS: Project[] = [
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
      { name: "shadcn ui", category: "frontend" }
    ],
    repoUrl: "https://github.com/sylvexn/keepsake",
    icon: "🖼️"
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
      { name: "shadcn ui", category: "frontend" }
    ],
    repoUrl: "https://github.com/sylvexn/portfolio",
    siteUrl: "https://syl.rest",
    icon: "🌐"
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
      { name: "nginx", category: "devops" }
    ],
    siteUrl: "https://map.syl.rest",
    statusUrl: "https://panel.syl.rest/status",
    icon: "🎮"
  },
  {
    id: "4",
    title: "dexchat",
    description: "an agentic chatbot that can search a large knowledgebase of pokemon data and answer user queries",
    status: "in development",
    techStack: [
      { name: "react", category: "frontend" },
      { name: "python", category: "backend" },
      { name: "postgres", category: "database" },
      { name: "openrouter", category: "devops" },
      { name: "agentic ai", category: "devops" }
    ],
    repoUrl: "https://github.com/sylvexn/dexchat",
    siteUrl: "https://dex.syl.rest",
    icon: "🐉"
  }
];

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [projectTransition, setProjectTransition] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(false)
      setTimeout(() => setShouldAnimate(true), 10)
    } else {
      setShouldAnimate(false)
    }
  }, [isOpen])

  // Provide a fallback empty project if the array is empty
  const hasProjects = PROJECTS.length > 0
  const safeIndex = hasProjects ? Math.min(Math.max(currentProjectIndex, 0), PROJECTS.length - 1) : 0
  const currentProject = hasProjects ? PROJECTS[safeIndex] : null
  
  const navigateProjects = (direction: 'next' | 'prev') => {
    if (!hasProjects) return
    
    setProjectTransition(true)
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentProjectIndex((prev) => (prev + 1) % PROJECTS.length)
      } else {
        setCurrentProjectIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length)
      }
      setProjectTransition(false)
    }, 300)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in production':
        return 'bg-green-600 hover:bg-green-700'
      case 'public':
        return 'bg-blue-600 hover:bg-blue-700'
      case 'private':
        return 'bg-purple-600 hover:bg-purple-700'
      case 'in development':
        return 'bg-orange-600 hover:bg-orange-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return 'bg-blue-600 hover:bg-blue-700'
      case 'backend':
        return 'bg-green-600 hover:bg-green-700'
      case 'database':
        return 'bg-yellow-600 hover:bg-yellow-700'
      case 'devops':
        return 'bg-purple-600 hover:bg-purple-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-[95%] lg:max-w-7xl max-h-[85vh] overflow-y-auto",
          "bg-background/95 backdrop-blur-md border-border/50"
        )}
        style={{
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          transition: 'opacity 400ms ease-out, transform 400ms ease-out'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            projects
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 px-4 md:px-6">
          {!hasProjects ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">no projects available</p>
            </div>
          ) : currentProject ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-sm text-foreground/60">
                    {currentProjectIndex + 1} / {PROJECTS.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateProjects('prev')}
                    className="h-9 w-9 p-0 rounded-full"
                  >
                    ←
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateProjects('next')}
                    className="h-9 w-9 p-0 rounded-full"
                  >
                    →
                  </Button>
                </div>
              </div>
              
              <Card 
                className={cn(
                  "overflow-hidden border-border/30 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 transition-all",
                  projectTransition ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
                )}
                style={{
                  transition: "opacity 300ms ease-out, transform 300ms ease-out"
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{currentProject.icon}</span>
                    <CardTitle className="text-2xl font-bold text-primary">
                      {currentProject.title}
                    </CardTitle>
                    <Badge 
                      className={cn(
                        "px-3 py-1.5 text-sm text-white font-medium transition-all duration-300",
                        getStatusColor(currentProject.status)
                      )}
                    >
                      {currentProject.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-3 text-foreground/70 text-base leading-relaxed">
                    {currentProject.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-primary/80 mb-3">tech stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.techStack.map((tech) => (
                        <Badge 
                          key={`${currentProject.id}-${tech.name}`}
                          className={cn(
                            "px-3 py-1.5 text-sm text-white font-medium transition-all duration-300",
                            "hover:shadow-md hover:scale-105",
                            getCategoryColor(tech.category)
                          )}
                        >
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-wrap gap-3">
                  {currentProject.repoUrl && (
                    <Button 
                      variant="outline"
                      className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                      disabled={currentProject.status.toLowerCase() === 'in development'}
                      onClick={() => currentProject.status.toLowerCase() !== 'in development' && window.open(currentProject.repoUrl, '_blank')}
                    >
                      <span className="mr-1">📂</span> repository
                    </Button>
                  )}
                  {currentProject.siteUrl && (
                    <Button 
                      variant="outline"
                      className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                      disabled={currentProject.status.toLowerCase() === 'in development'}
                      onClick={() => currentProject.status.toLowerCase() !== 'in development' && window.open(currentProject.siteUrl, '_blank')}
                    >
                      <span className="mr-1">🌐</span> visit site
                    </Button>
                  )}
                  {currentProject.statusUrl && (
                    <Button 
                      variant="outline"
                      className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                      onClick={() => window.open(currentProject.statusUrl, '_blank')}
                    >
                      <span className="mr-1">📊</span> status
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
} 