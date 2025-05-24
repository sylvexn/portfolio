import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface WhoamiModalProps {
  isOpen: boolean
  onClose: () => void
}

// Define interests with custom colors
const interests = [
  { name: "fullstack dev", color: "bg-indigo-600 hover:bg-indigo-700" },
  { name: "networking", color: "bg-emerald-600 hover:bg-emerald-700" },
  { name: "sysadmin", color: "bg-blue-600 hover:bg-blue-700" },
  { name: "devops", color: "bg-purple-600 hover:bg-purple-700" },
  { name: "database", color: "bg-rose-600 hover:bg-rose-700" },
  { name: "tech support", color: "bg-teal-600 hover:bg-teal-700" }
]

export function WhoamiModal({ isOpen, onClose }: WhoamiModalProps) {
  const [imageError, setImageError] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(false)
      // Small delay to ensure opacity is set to 0 before animating
      setTimeout(() => setShouldAnimate(true), 10)
    } else {
      setShouldAnimate(false)
    }
  }, [isOpen])

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
            whoami
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-60 h-60 rounded-full overflow-hidden border-2 border-primary/50 shadow-lg transition-all hover:scale-105 duration-300">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-primary">
                  <span className="text-6xl">👤</span>
                </div>
              ) : (
                <img 
                  src="/images/profile-picture.jpg" 
                  alt="profile picture" 
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="mt-5 text-xs text-center text-foreground/60">
              <p>place your profile image at:</p>
              <p className="font-mono bg-background/50 px-2 py-1 rounded mt-1">public/images/profile-picture.jpg</p>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-6 px-4">
            <h3 className="text-2xl font-medium text-primary">hi, i'm blake!</h3>
            
            <p className="text-foreground/80 leading-relaxed text-lg">
              i'm a versatile technology professional with 6 years of technical support experience and a passion for fullstack development, networking, and system administration. 
              my background in solving complex technical issues has given me a unique perspective on building robust, user-focused solutions.
            </p>            
            <div className="pt-4">
              <h4 className="text-xl font-medium text-primary/80 mb-4">expertise & interests</h4>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest) => (
                  <Badge 
                    key={interest.name}
                    className={cn(
                      "px-3 py-1.5 text-sm text-white font-medium capitalize transition-all duration-300",
                      "hover:shadow-md hover:scale-105 border-none",
                      interest.color
                    )}
                  >
                    {interest.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 