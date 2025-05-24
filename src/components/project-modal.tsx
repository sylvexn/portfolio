import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Status badge variants
type ProjectStatus = "production" | "private" | "public" | "archived";

const statusVariants: Record<ProjectStatus, { label: string, className: string }> = {
  production: {
    label: "in production",
    className: "bg-green-600 text-white border-green-700"
  },
  private: {
    label: "private",
    className: "bg-purple-600 text-white border-purple-700"
  },
  public: {
    label: "public",
    className: "bg-blue-600 text-white border-blue-700"
  },
  archived: {
    label: "archived",
    className: "bg-gray-600 text-white border-gray-700"
  }
};

// Tech stack categories
type TechCategory = "frontend" | "backend" | "database" | "devops" | "mobile" | "design" | "ai" | "blockchain";

const techCategoryColors: Record<TechCategory, string> = {
  frontend: "bg-yellow-500/80 text-black",
  backend: "bg-blue-500/80 text-white",
  database: "bg-green-500/80 text-black",
  devops: "bg-red-500/80 text-white",
  mobile: "bg-purple-500/80 text-white",
  design: "bg-pink-500/80 text-white",
  ai: "bg-indigo-500/80 text-white",
  blockchain: "bg-orange-500/80 text-black"
};

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  techStack: Array<{
    name: string;
    category: TechCategory;
  }>;
  repoUrl?: string;
  siteUrl?: string;
  imageUrl?: string;
  icon?: string; // Emoji icon for the project
  statusUrl?: string; // URL for status page
}

// Placeholder projects
const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: "1",
    title: "keepsake",
    description: "imgur bothered me, made my own image host. a personal image uploader application that handles sharex uploads and provides a dashboard to view and manage uploaded images.",
    status: "production",
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
    repoUrl: "https://github.com/username/portfolio",
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
  }
];

export function ProjectsSection({ isOpen, onClose }: ProjectsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-3xl lg:max-w-4xl bg-background/95 backdrop-blur-md border-border/50 p-4 overflow-hidden">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl">projects</DialogTitle>
        </DialogHeader>
        
        <div className="px-1 overflow-hidden">
          <Carousel
            opts={{
              align: "center",
              loop: true,
              containScroll: "trimSnaps"
            }}
            className="w-full"
          >
            <CarouselContent>
              {PLACEHOLDER_PROJECTS.map((project) => (
                <CarouselItem key={project.id} className="basis-full">
                  <div className="p-1">
                    <ProjectCard project={project} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center w-full gap-2 mt-4">
              <CarouselPrevious className="relative inset-0 translate-y-0 hover:border-yellow-500 hover:text-yellow-500 transition-colors" />
              <CarouselNext className="relative inset-0 translate-y-0 hover:border-yellow-500 hover:text-yellow-500 transition-colors" />
            </div>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { title, description, status, techStack, repoUrl, siteUrl, statusUrl, icon = "💻" } = project;
  const statusConfig = statusVariants[status];
  
  // Get a gradient based on status
  const gradientClasses = {
    production: "from-green-950 to-green-900",
    public: "from-blue-950 to-blue-900",
    private: "from-purple-950 to-purple-900",
    archived: "from-gray-950 to-gray-900"
  };

  return (
    <Card className="overflow-hidden hover:border-yellow-500/20 transition-colors duration-200 max-w-2xl mx-auto">
      <div 
        className={`h-48 bg-gradient-to-br ${gradientClasses[status]} relative flex items-center justify-center`}
      >
        <div className="absolute inset-0 backdrop-blur-[1px]"></div>
        <div className="absolute top-3 right-3">
          <Badge 
            className={cn(statusConfig.className, "text-sm px-3 py-1")}
          >
            {statusConfig.label}
          </Badge>
        </div>
        <span className="text-6xl opacity-40">{icon}</span>
      </div>
      
      <div className="bg-black/40 backdrop-blur-[1px]">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription className="text-sm mt-2 text-white/90">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech, index) => (
              <Badge 
                key={index}
                className={cn(techCategoryColors[tech.category], "text-sm")}
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-4 justify-between">
          {(!repoUrl && !siteUrl && !statusUrl) && (
            <span className="text-sm text-white/70">private project</span>
          )}
          
          <div className="flex gap-4">
            {repoUrl && (
              <a 
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline transition-all"
              >
                view code
              </a>
            )}
            
            {statusUrl && (
              <a 
                href={statusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline transition-all"
              >
                status
              </a>
            )}
          </div>
          
          {siteUrl && (
            <a 
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline transition-all"
            >
              visit site
            </a>
          )}
        </CardFooter>
      </div>
    </Card>
  );
} 