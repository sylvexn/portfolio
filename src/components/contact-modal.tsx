import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Twitter,
  Copy,
  MessageSquare,
} from 'lucide-react'
import { toast } from 'sonner'
import { contactOptions, type ContactOption } from '@/data/content'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const iconMap = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  signal: MessageSquare,
  email: Mail,
  mailto: Copy,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function ContactCard({ option }: { option: ContactOption }) {
  const Icon = iconMap[option.icon]
  const isExternalLink = Boolean(option.href)

  const handleCopy = async () => {
    if (!option.copyValue) return
    await navigator.clipboard.writeText(option.copyValue)
    toast(`${option.label} copied to clipboard`, {
      icon: <Copy className="h-4 w-4" />,
      position: "bottom-center",
    })
  }

  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
      <Card className="bg-card/50 hover:border-primary/30 transition-all duration-200 group">
        {isExternalLink ? (
          <Button
            variant="ghost"
            asChild
            className="h-auto w-full rounded-lg p-6"
          >
            <a href={option.href} target="_blank" rel="noopener noreferrer">
              <div className="flex flex-col items-center text-center space-y-4 w-full">
                <div className="p-3 rounded-full bg-background/90 border border-border/50 group-hover:border-primary/50 group-hover:text-primary transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium group-hover:text-primary transition-colors flex items-center justify-center gap-1">
                    {option.label}
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </a>
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={handleCopy}
            className="h-auto w-full rounded-lg p-6"
          >
            <div className="flex flex-col items-center text-center space-y-4 w-full">
              <div className="p-3 rounded-full bg-background/90 border border-border/50 group-hover:border-primary/50 group-hover:text-primary transition-all">
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors flex items-center justify-center gap-1">
                  {option.label}
                </h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/70">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            contact
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="py-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactOptions.map((option) => (
              <ContactCard key={option.id} option={option} />
            ))}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
