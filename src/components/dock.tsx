import { useRef } from 'react'
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DockProps {
  onItemClick: (modalId: string) => void
}

interface DockItem {
  id: string
  emoji: string
  label: string
}

const dockItems: DockItem[] = [
  { id: "whoami", emoji: "🧠", label: "whoami" },
  { id: "resume", emoji: "📄", label: "work history" },
  { id: "skills", emoji: "⚡", label: "skills" },
  { id: "projects", emoji: "🚀", label: "projects" },
  { id: "contact", emoji: "📬", label: "contact" }
]

function DockIcon({
  item,
  mouseX,
  onClick,
  reduceMotion,
}: {
  item: DockItem
  mouseX: MotionValue<number>
  onClick: () => void
  reduceMotion: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [62, 78, 62])
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      className={cn(
        "relative flex items-center justify-center",
        "rounded-md transition-colors duration-200",
        "hover:bg-accent/45 cursor-pointer group border border-transparent",
        "hover:border-primary/35",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
      onClick={onClick}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      aria-label={item.label}
      title={item.label}
    >
      <motion.span
        className="text-3xl select-none"
        style={{
          fontSize: useTransform(width, (w) => `${(w as number) * 0.5}px`),
        }}
      >
        {item.emoji}
      </motion.span>

      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs px-3 py-1.5 rounded-lg border border-border/50 whitespace-nowrap shadow-lg">
          {item.label}
        </div>
      </div>
    </motion.button>
  )
}

export function Dock({ onItemClick }: DockProps) {
  const prefersReducedMotion = useReducedMotion()
  const mouseXSpring = useSpring(0, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-50"
      initial={prefersReducedMotion ? { x: "-50%", opacity: 0 } : { y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0.2 } : { type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
    >
      <motion.div
        className="glass-effect rounded-xl p-2.5 shadow-2xl"
        onMouseMove={(e) => mouseXSpring.set(e.pageX)}
        onMouseLeave={() => mouseXSpring.set(0)}
      >
        <div className="flex items-end gap-1">
          {dockItems.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseXSpring}
              onClick={() => onItemClick(item.id)}
              reduceMotion={Boolean(prefersReducedMotion)}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
