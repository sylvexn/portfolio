import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import { experience, RESUME_URL } from '@/data/content'

interface WorkHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export function WorkHistoryModal({ isOpen, onClose }: WorkHistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] lg:max-w-4xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            work history
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center my-4">
          <Button
            asChild
            className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-medium"
          >
            <a
              href={RESUME_URL}
              download="blakeb_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4 mr-2" />
              download resume
            </a>
          </Button>
        </div>

        <motion.div
          className="py-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-card/50 border-border/30">
            <CardContent className="space-y-6 pt-6">
              {experience.map((job, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {job.company}
                      </h3>
                      <p className="text-foreground font-medium">{job.title}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 self-start sm:self-center">
                      {job.duration}
                    </Badge>
                  </div>

                  <ul className="space-y-2 mt-3">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {index < experience.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
