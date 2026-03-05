import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  frontendSkills,
  backendSkills,
  devopsSkills,
  miscSkills,
  type Skill,
} from '@/data/content'

interface SkillsModalProps {
  isOpen: boolean
  onClose: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="group hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 bg-card/50 border-border/30">
        <CardContent className="p-3 flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg shadow-sm",
              "bg-gradient-to-br",
              skill.color
            )}
          >
            <span className="text-white font-bold text-xs uppercase">
              {skill.name.slice(0, 2)}
            </span>
          </div>
          <span className="text-xs font-medium text-foreground/90 text-center">
            {skill.name}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SkillCategory({
  title,
  skills,
  gradient,
}: {
  title: string
  skills: Skill[]
  gradient: string
}) {
  return (
    <div className="space-y-4">
      <h3
        className={cn(
          "text-lg font-medium bg-gradient-to-r bg-clip-text text-transparent inline-block",
          gradient
        )}
      >
        {title}
      </h3>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </motion.div>
    </div>
  )
}

export function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] lg:max-w-6xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            skills
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 px-2 md:px-4 space-y-8">
          <SkillCategory
            title="frontend"
            skills={frontendSkills}
            gradient="from-blue-400 via-cyan-500 to-blue-600"
          />
          <SkillCategory
            title="backend"
            skills={backendSkills}
            gradient="from-green-500 via-green-600 to-emerald-700"
          />
          <SkillCategory
            title="devops & tools"
            skills={devopsSkills}
            gradient="from-indigo-500 via-purple-500 to-indigo-600"
          />
          <SkillCategory
            title="misc"
            skills={miscSkills}
            gradient="from-orange-400 via-red-500 to-orange-600"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
