import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
      <DialogContent className="max-w-[95%] lg:max-w-5xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            whoami
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="py-6 grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="md:col-span-1 flex flex-col items-center"
            variants={itemVariants}
          >
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg transition-transform hover:scale-105 duration-300 bg-muted flex items-center justify-center">
              <span className="text-6xl md:text-7xl">👨‍💻</span>
            </div>
          </motion.div>

          <motion.div className="md:col-span-3" variants={itemVariants}>
            <Card className="bg-card/50 border-border/30 h-full">
              <CardContent className="pt-6 space-y-6">
                <h3 className="text-2xl font-medium text-primary">
                  hi, i'm {bio.name.split(' ')[0].toLowerCase()}!
                </h3>

                <p className="text-foreground/80 leading-relaxed text-lg">
                  i'm a {bio.tagline}
                </p>

                <p className="text-foreground/70 leading-relaxed">
                  {bio.description}
                </p>

                <div>
                  <h4 className="text-xl font-medium text-primary/80 mb-4">
                    expertise & interests
                  </h4>
                  <div className="flex flex-wrap gap-3">
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
