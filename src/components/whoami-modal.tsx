import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { bio, interests } from '@/data/content'

interface WhoamiModalProps {
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function WhoamiModal({ isOpen, onClose }: WhoamiModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] lg:max-w-3xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/70">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            whoami
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="py-4 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
            variants={itemVariants}
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-primary/40 shadow-lg shrink-0 bg-muted">
              <img
                src="https://i.syl.rest/b235e9.png"
                alt={bio.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-medium text-primary">
                hi, i'm {bio.name.split(' ')[0].toLowerCase()}!
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                i'm a {bio.tagline}
              </p>
              <p className="text-foreground/60 leading-relaxed text-sm">
                {bio.description}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              expertise & interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Badge
                    className={cn(
                      "px-3 py-1.5 text-sm text-white font-medium transition-all duration-300",
                      "hover:shadow-md hover:scale-105 border-none cursor-default",
                      interest.color
                    )}
                  >
                    {interest.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
