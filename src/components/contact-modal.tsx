import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Github, Linkedin, Mail, Send, ExternalLink, ArrowLeft, Twitter, Copy, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ContactOption {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  action?: () => void
  link?: string
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(false)
      setShowContactForm(false)
      setTimeout(() => setShouldAnimate(true), 10)
    } else {
      setShouldAnimate(false)
    }
  }, [isOpen])

  const handleOpenContactForm = () => {
    setShowContactForm(true)
  }

  const handleBackToOptions = () => {
    setShowContactForm(false)
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send the form data
    alert("Message sent! (This is just a placeholder)")
    setShowContactForm(false)
  }

  const copyEmailToClipboard = () => {
    const email = "blakeb12341@gmail.com"
    navigator.clipboard.writeText(email)
    toast("email copied to clipboard", {
      icon: <Copy className="h-4 w-4" />,
      position: "bottom-center"
    })
  }

  const copySignalUsername = () => {
    const signalUsername = "sylvexn.17"
    navigator.clipboard.writeText(signalUsername)
    toast("signal username copied to clipboard", {
      icon: <Copy className="h-4 w-4" />,
      position: "bottom-center"
    })
  }

  const contactOptions: ContactOption[] = [
    {
      id: "github",
      icon: <Github className="h-6 w-6" />,
      label: "github",
      description: "check out my code repositories",
      link: "https://github.com/sylvexn"
    },
    {
      id: "twitter",
      icon: <Twitter className="h-6 w-6" />,
      label: "twitter",
      description: "follow me for updates",
      link: "https://twitter.com/sylvexn_"
    },
    {
      id: "linkedin",
      icon: <Linkedin className="h-6 w-6" />,
      label: "linkedin",
      description: "connect with me professionally",
      link: "https://linkedin.com/in/blakeb17"
    },
    {
      id: "signal",
      icon: <MessageSquare className="h-6 w-6" />,
      label: "signal",
      description: "contact me via signal: sylvexn.17",
      action: copySignalUsername
    },
    {
      id: "email",
      icon: <Copy className="h-6 w-6" />,
      label: "email",
      description: "copy my email address",
      action: copyEmailToClipboard
    },
    {
      id: "message",
      icon: <Mail className="h-6 w-6" />,
      label: "message",
      description: "send me a direct message",
      action: handleOpenContactForm
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-[95%] sm:max-w-3xl max-h-[85vh] overflow-y-auto",
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
            {showContactForm ? "send message" : "contact"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {showContactForm ? (
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={handleBackToOptions}
              >
                <ArrowLeft className="h-4 w-4" />
                back to options
              </Button>
              
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">name</label>
                  <Input 
                    id="name"
                    placeholder="your name"
                    className="bg-background/50 border-border/50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">email</label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-background/50 border-border/50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">message</label>
                  <Textarea 
                    id="message"
                    placeholder="your message here..."
                    className="bg-background/50 border-border/50 min-h-[120px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                >
                  <Send className="h-4 w-4 mr-2" />
                  send message
                </Button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactOptions.map((option) => (
                <Card 
                  key={option.id}
                  className="p-6 hover:border-yellow-500/30 transition-colors bg-background/70 backdrop-blur-sm cursor-pointer group"
                  onClick={option.action || (() => window.open(option.link, "_blank"))}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-background/90 border border-border/50 group-hover:border-yellow-500/50 group-hover:text-yellow-500 transition-all">
                      {option.icon}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium group-hover:text-yellow-500 transition-colors flex items-center justify-center gap-1">
                        {option.label}
                        {option.link && <ExternalLink className="h-3 w-3 opacity-70" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 