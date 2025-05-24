import { useState } from "react"
import { cn } from "@/lib/utils"

interface DockItem {
  id: string
  emoji: string
  label: string
  onClick?: () => void
}

const dockItems: DockItem[] = [
  { id: "projects", emoji: "🚀", label: "projects" },
  { id: "resume", emoji: "📄", label: "resume" },
  { id: "skills", emoji: "⚡", label: "skills" },
  { id: "uses", emoji: "💡", label: "uses" },
  { id: "contact", emoji: "📬", label: "contact" }
]

export function Dock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getItemScale = (index: number) => {
    if (hoveredIndex === null) return 1
    
    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) return 1.5
    if (distance === 1) return 1.2
    if (distance === 2) return 1.1
    return 1
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-3 shadow-2xl">
        <div className="flex items-end gap-2">
          {dockItems.map((item, index) => {
            const scale = getItemScale(index)
            
            return (
              <button
                key={item.id}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-16 h-16 rounded-xl transition-all duration-200 ease-out",
                  "hover:bg-accent/10 cursor-pointer group"
                )}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom"
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={item.onClick}
              >
                <span className="text-3xl select-none">{item.emoji}</span>
                
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded border border-border/50 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 