import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { projects } from '@/data/content'
import { ChevronLeft, ChevronRight, ExternalLink, FolderGit2, Activity } from 'lucide-react'

interface ProjectsModalProps {
  isOpen: boolean
  onClose: () => void
}

const statusColors: Record<string, string> = {
  "in production": "bg-green-600 hover:bg-green-700",
  "public": "bg-blue-600 hover:bg-blue-700",
  "private": "bg-purple-600 hover:bg-purple-700",
  "in development": "bg-orange-600 hover:bg-orange-700",
}

const categoryColors: Record<string, string> = {
  "frontend": "bg-blue-600 hover:bg-blue-700",
  "backend": "bg-green-600 hover:bg-green-700",
  "database": "bg-yellow-600 hover:bg-yellow-700",
  "devops": "bg-purple-600 hover:bg-purple-700",
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const prefersReducedMotion = useReducedMotion()
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0])

  const project = projects[currentIndex]!
  const isInDev = project.status === "in development"

  const navigate = (newDirection: number) => {
    const newIndex =
      newDirection > 0
        ? (currentIndex + 1) % projects.length
        : (currentIndex - 1 + projects.length) % projects.length
    setCurrentIndex([newIndex, newDirection])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] lg:max-w-4xl max-h-[85dvh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/60">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            projects
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 px-2 md:px-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {projects.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-9 w-9 rounded-sm"
                aria-label="previous project"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(1)}
                className="h-9 w-9 rounded-sm"
                aria-label="next project"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden min-h-[300px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  prefersReducedMotion
                    ? { duration: 0.18 }
                    : {
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }
                }
              >
                <Card className="overflow-hidden border-border/40 bg-card/60">
                  <CardHeader>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-4xl">{project.icon}</span>
                      <CardTitle className="text-2xl font-bold text-primary">
                        {project.title}
                      </CardTitle>
                      <Badge
                        className={cn(
                          "px-3 py-1.5 text-sm text-white font-medium",
                          statusColors[project.status] ?? "bg-gray-600"
                        )}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-3 text-foreground/70 text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <h3 className="text-lg font-medium text-primary/80 mb-3">
                      tech stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <Badge
                          key={tech.name}
                          className={cn(
                            "px-3 py-1.5 text-sm text-white font-medium transition-transform hover:scale-105",
                            categoryColors[tech.category] ?? "bg-gray-600"
                          )}
                        >
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-wrap gap-3">
                    {project.repoUrl && (
                      <Button
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                        disabled={isInDev}
                        asChild={!isInDev}
                      >
                        {isInDev ? (
                          <span>
                            <FolderGit2 className="h-4 w-4 mr-2" />
                            repository
                          </span>
                        ) : (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FolderGit2 className="h-4 w-4 mr-2" />
                            repository
                          </a>
                        )}
                      </Button>
                    )}
                    {project.siteUrl && (
                      <Button
                        variant="outline"
                        className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                        disabled={isInDev}
                        asChild={!isInDev}
                      >
                        {isInDev ? (
                          <span>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            visit site
                          </span>
                        ) : (
                          <a
                            href={project.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            visit site
                          </a>
                        )}
                      </Button>
                    )}
                    {project.statusUrl && (
                      <Button
                        variant="outline"
                        className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                        asChild
                      >
                        <a
                          href={project.statusUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          status
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
