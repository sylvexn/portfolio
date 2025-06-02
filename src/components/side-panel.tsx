import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatInterface } from '@/components/chat/chat-interface'

interface SidePanelProps {
  className?: string
}

export function SidePanel({ className }: SidePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePanel = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={cn("fixed right-0 top-0 z-40 h-full", className)}>
      <div className="relative h-full flex">
        <div 
          className={cn(
            "h-full bg-background/80 backdrop-blur-sm border-l border-border/50",
            "transition-all duration-500 ease-in-out",
            "flex items-center justify-center cursor-pointer hover:bg-background/90",
            "group",
            isExpanded ? "w-4" : "w-12"
          )}
          onClick={togglePanel}
        >
          <div className="transform transition-transform duration-300 group-hover:scale-110">
            {isExpanded ? (
              <ChevronRight className="h-5 w-5 text-yellow-500" />
            ) : (
              <ChevronLeft className="h-6 w-6 text-yellow-500" />
            )}
          </div>
        </div>

        <div 
          className={cn(
            "bg-background/95 backdrop-blur-sm border-l border-border/50",
            "transition-all duration-500 ease-in-out overflow-hidden",
            isExpanded ? "w-[640px]" : "w-0"
          )}
        >
          <div className="h-full w-[640px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  )
} 