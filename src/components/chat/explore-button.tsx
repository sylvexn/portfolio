import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExploreButtonProps {
  content: string
  onModalOpen: (modalId: string) => void
}

const MODAL_LABELS = {
  whoami: 'personal story',
  resume: 'work experience', 
  skills: 'technical skills',
  projects: 'project showcase',
  contact: 'get in touch'
}

export function ExploreButton({ content, onModalOpen }: ExploreButtonProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  const parseExploreAction = (content: string): string | null => {
    const exploreRegex = /\*\*explore:(\w+)\*\*/g
    const match = exploreRegex.exec(content)
    return match?.[1] || null
  }

  const modalId = parseExploreAction(content)
  
  useEffect(() => {
    if (modalId) {
      const timer = setTimeout(() => setShouldAnimate(true), 500)
      return () => clearTimeout(timer)
    }
  }, [modalId])

  if (!modalId || !(modalId in MODAL_LABELS)) {
    return null
  }

  const label = MODAL_LABELS[modalId as keyof typeof MODAL_LABELS]

  const handleClick = () => {
    onModalOpen(modalId)
  }

  return (
    <div className="flex justify-center mt-4">
      <Button
        onClick={handleClick}
        className={cn(
          "group relative overflow-hidden",
          "bg-gradient-to-r from-yellow-400/90 via-yellow-500/90 to-yellow-600/90",
          "hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500",
          "text-black font-medium px-6 py-2.5 rounded-lg",
          "transform transition-all duration-300 ease-out",
          "hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/25",
          "border border-yellow-300/20",
          shouldAnimate && "animate-in slide-in-from-bottom-4 duration-700"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <div className="relative flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-800/80" />
          <span className="text-sm">explore {label}</span>
          <ChevronRight className="w-4 h-4 text-yellow-800/80 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </Button>
    </div>
  )
} 