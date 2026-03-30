import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
      staggerChildren: 0.03,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.06, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/70 border border-border/40 hover:border-primary/30 hover:bg-card transition-colors duration-200 cursor-default"
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full shrink-0 bg-gradient-to-br",
          skill.color
        )}
      />
      <span className="text-sm font-medium text-foreground/85">
        {skill.name}
      </span>
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
    <div className="space-y-3">
      <h3
        className={cn(
          "text-sm font-medium uppercase tracking-wider bg-gradient-to-r bg-clip-text text-transparent",
          gradient
        )}
      >
        {title}
      </h3>
      <motion.div
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skills.map((skill) => (
          <SkillPill key={skill.name} skill={skill} />
        ))}
      </motion.div>
    </div>
  )
}

export function SkillsModal({ isOpen, onClose }: SkillsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] lg:max-w-3xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/70">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            skills
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 px-1 md:px-2 space-y-6">
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
