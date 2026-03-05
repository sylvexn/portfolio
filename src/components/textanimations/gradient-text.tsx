import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
}

export function GradientText({
  children,
  className = "",
  colors = ["#fbbf24", "#f59e0b", "#d97706", "#fbbf24"],
  animationSpeed = 6,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
    backgroundSize: "300% 100%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }

  return (
    <span
      className={cn("animate-gradient inline-block", className)}
      style={gradientStyle}
    >
      {children}
    </span>
  )
}
