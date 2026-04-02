import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Send,
  ArrowLeft,
  Loader2,
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
  message: Send,
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

function ContactCard({
  option,
  onMessageClick,
}: {
  option: ContactOption
  onMessageClick?: () => void
}) {
  const Icon = iconMap[option.icon]
  const isExternalLink = Boolean(option.href)
  const isMessageForm = option.id === 'message'

  const handleCopy = async () => {
    if (!option.copyValue) return
    await navigator.clipboard.writeText(option.copyValue)
    toast(`${option.label} copied to clipboard`, {
      icon: <Copy className="h-4 w-4" />,
      position: 'bottom-center',
    })
  }

  const handleClick = () => {
    if (isMessageForm) {
      onMessageClick?.()
    } else if (!isExternalLink) {
      handleCopy()
    }
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
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </a>
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={handleClick}
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
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          </Button>
        )}
      </Card>
    </motion.div>
  )
}

const RATE_LIMIT_KEY = 'contact_form_sends'
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function checkRateLimit(): boolean {
  const now = Date.now()
  const raw = localStorage.getItem(RATE_LIMIT_KEY)
  const timestamps: number[] = raw ? JSON.parse(raw) : []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  return recent.length < RATE_LIMIT_MAX
}

function recordSend() {
  const now = Date.now()
  const raw = localStorage.getItem(RATE_LIMIT_KEY)
  const timestamps: number[] = raw ? JSON.parse(raw) : []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent))
}

function ContactForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const canSubmit = name.trim() && email.trim() && message.trim() && !sending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    if (!checkRateLimit()) {
      toast.error('Too many messages — please try again later', {
        position: 'bottom-center',
      })
      return
    }

    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      toast.error('Contact form is not configured', {
        position: 'bottom-center',
      })
      return
    }

    setSending(true)
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: '📬 New Contact Message',
              color: 0x7c3aed,
              fields: [
                { name: 'Name', value: name.trim(), inline: true },
                { name: 'Email', value: email.trim(), inline: true },
                { name: 'Message', value: message.trim() },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })

      if (!res.ok) throw new Error('Failed to send')

      recordSend()
      toast.success('Message sent!', {
        position: 'bottom-center',
      })
      setName('')
      setEmail('')
      setMessage('')
      onBack()
    } catch {
      toast.error('Failed to send message, try again later', {
        position: 'bottom-center',
      })
    } finally {
      setSending(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all'

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 py-2"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        back
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <textarea
        placeholder="your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        className={`${inputClass} resize-none`}
        required
      />

      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full gap-2"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {sending ? 'sending...' : 'send message'}
      </Button>
    </motion.form>
  )
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [showForm, setShowForm] = useState(false)

  const handleClose = () => {
    setShowForm(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95%] sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/70">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            contact
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showForm ? (
            <ContactForm key="form" onBack={() => setShowForm(false)} />
          ) : (
            <motion.div
              key="grid"
              className="py-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contactOptions.map((option) => (
                  <ContactCard
                    key={option.id}
                    option={option}
                    onMessageClick={() => setShowForm(true)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
