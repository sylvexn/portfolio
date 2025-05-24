import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { CloudDownload } from "lucide-react"

interface WorkHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ExperienceItem {
  title: string
  company: string
  location: string
  duration: string
  responsibilities: string[]
}

const experience: ExperienceItem[] = [
  {
    title: "tier 1 technical support agent",
    company: "Navigate360",
    location: "remote",
    duration: "feb 2024 - present",
    responsibilities: [
      "provide technical support to customers by troubleshooting and resolving software, hardware, and network related issues.",
      "provide remote support for more specific hardware and software issues."
    ]
  },
  {
    title: "tier 1 technical support agent", 
    company: "Affinitiv",
    location: "remote",
    duration: "jan 2023 - dec 2023",
    responsibilities: [
      "handled customer complaints and escalated issues according to procedures.",
      "facilitated communication between car dealerships and the autoloop product support teams."
    ]
  },
  {
    title: "tier 1 technical support agent",
    company: "Logicom USA",
    location: "remote",
    duration: "jan 2021 - jan 2023", 
    responsibilities: [
      "answered inbound calls to fix and maintain member's home internet.",
      "worked alongside on-site team members to fix fiber line technical issues.",
      "mentored new hires, facilitating their onboarding and training processes."
    ]
  },
  {
    title: "tier 1 technical support agent",
    company: "unisys (contract)",
    location: "remote", 
    duration: "mar 2020 - jan 2021",
    responsibilities: [
      "answer user inquiries regarding computer software or hardware operation to resolve problems.",
      "read technical manuals and confer with users to provide technical assistance and support."
    ]
  }
]

export function WorkHistoryModal({ isOpen, onClose }: WorkHistoryModalProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(false)
      setTimeout(() => setShouldAnimate(true), 10)
    } else {
      setShouldAnimate(false)
    }
  }, [isOpen])

  const handleDownload = () => {
    console.log("download resume functionality not implemented yet")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-[95%] lg:max-w-6xl max-h-[85vh] overflow-y-auto",
          "bg-background/95 backdrop-blur-md border-border/50"
        )}
        style={{
          opacity: shouldAnimate ? 1 : 0,
          transform: shouldAnimate ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          transition: 'opacity 400ms ease-out, transform 400ms ease-out'
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              work history
            </DialogTitle>
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
            >
              <CloudDownload className="h-4 w-4 mr-2" />
              download
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-6 space-y-8">
          <Card className="bg-background/70 backdrop-blur-sm border-border/30">
            <CardHeader>
              <CardTitle className="text-xl text-primary">experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((job, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <p className="text-primary font-medium">{job.company}</p>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 self-start sm:self-center">
                      {job.duration}
                    </Badge>
                  </div>
                  
                  <ul className="space-y-2 mt-3">
                    {job.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm leading-relaxed">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {index < experience.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 