import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// SVG icon imports
const iconBasePath = "/images/icons/"

interface SkillsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Skill {
  name: string
  icon: string
  color?: string
}

const frontendSkills: Skill[] = [
  { name: "react", icon: `${iconBasePath}react.svg`, color: "from-blue-400 to-cyan-500" },
  { name: "javascript", icon: `${iconBasePath}js.svg`, color: "from-yellow-400 to-yellow-600" },
  { name: "typescript", icon: `${iconBasePath}ts.svg`, color: "from-blue-500 to-blue-700" },
  { name: "html", icon: `${iconBasePath}html.svg`, color: "from-orange-500 to-red-600" },
  { name: "css", icon: `${iconBasePath}css.svg`, color: "from-blue-400 to-blue-600" },
  { name: "next.js", icon: `${iconBasePath}nextjs.svg`, color: "from-gray-700 to-gray-900" },
  { name: "vite", icon: `${iconBasePath}vite.svg`, color: "from-purple-500 to-purple-700" },
  { name: "tailwind", icon: `${iconBasePath}tailwind.svg`, color: "from-cyan-400 to-blue-500" }
]

const backendSkills: Skill[] = [
  { name: "python", icon: `${iconBasePath}python.svg`, color: "from-blue-500 to-green-500" },
  { name: "node.js", icon: `${iconBasePath}node.svg`, color: "from-green-500 to-green-700" },
  { name: "sqlite", icon: `${iconBasePath}sqlite.svg`, color: "from-blue-400 to-indigo-600" },
  { name: "postgresql", icon: `${iconBasePath}postgresql.svg`, color: "from-blue-600 to-indigo-800" }
]

const devopsSkills: Skill[] = [
  { name: "jira", icon: `${iconBasePath}jira.svg`, color: "from-blue-400 to-blue-700" },
  { name: "salesforce", icon: `${iconBasePath}salesforce.svg`, color: "from-blue-500 to-indigo-600" },
  { name: "zendesk", icon: `${iconBasePath}zendesk.svg`, color: "from-green-400 to-teal-600" },
  { name: "git", icon: `${iconBasePath}git.svg`, color: "from-orange-500 to-red-600" },
  { name: "bash", icon: `${iconBasePath}bash.svg`, color: "from-gray-600 to-gray-800" },
  { name: "docker", icon: `${iconBasePath}docker.svg`, color: "from-blue-500 to-blue-700" },
  { name: "linux", icon: `${iconBasePath}linux.svg`, color: "from-gray-700 to-gray-900" },
  { name: "nginx", icon: `${iconBasePath}nginx.svg`, color: "from-green-500 to-green-700" }
]

const miscSkills: Skill[] = [
  { name: "unity", icon: `${iconBasePath}unity.svg`, color: "from-gray-700 to-gray-900" },
  { name: "vsc", icon: `${iconBasePath}vsc.svg`, color: "from-blue-500 to-blue-700" },
  { name: "unreal", icon: `${iconBasePath}unreal.svg`, color: "from-purple-500 to-purple-700" },
  { name: "obs", icon: `${iconBasePath}obs.svg`, color: "from-gray-600 to-gray-800" },
  { name: "gen ai", icon: `${iconBasePath}openai.svg`, color: "from-blue-500 to-indigo-700" },
  { name: "mcp", icon: `${iconBasePath}mcp.svg`, color: "from-cyan-500 to-blue-600" }
]

export function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(false)
      setTimeout(() => setShouldAnimate(true), 10)
    } else {
      setShouldAnimate(false)
    }
  }, [isOpen])

  const renderSkill = (skill: Skill) => (
    <div 
      key={skill.name} 
      className="flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:scale-105 bg-background/50 border border-border/30 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10"
    >
      <div 
        className={cn(
          "w-14 h-14 flex items-center justify-center rounded-lg mb-2 shadow-sm overflow-hidden",
          skill.color ? `bg-gradient-to-br ${skill.color}` : "bg-gradient-to-br from-yellow-400 to-yellow-600"
        )}
      >
        {skill.icon.endsWith('.svg') ? (
          <img 
            src={skill.icon} 
            alt={`${skill.name} icon`} 
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span className="text-2xl">{skill.icon}</span>
        )}
      </div>
      <span className="text-sm font-medium text-foreground/90">{skill.name}</span>
    </div>
  )

  const renderSkillCategory = (title: string, skills: Skill[], gradient: string) => (
    <div className="mb-10">
      <h3 className={`text-xl font-medium mb-5 bg-gradient-to-r ${gradient} bg-clip-text text-transparent inline-block`}>
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {skills.map(renderSkill)}
      </div>
    </div>
  )

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
            skills
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 px-2 md:px-6 space-y-6">
          {renderSkillCategory("frontend", frontendSkills, "from-blue-400 via-cyan-500 to-blue-600")}
          {renderSkillCategory("backend", backendSkills, "from-green-500 via-green-600 to-emerald-700")}
          {renderSkillCategory("devops & tools", devopsSkills, "from-indigo-500 via-purple-500 to-indigo-600")}
          {renderSkillCategory("misc", miscSkills, "from-orange-400 via-red-500 to-orange-600")}
        </div>
      </DialogContent>
    </Dialog>
  )
} 