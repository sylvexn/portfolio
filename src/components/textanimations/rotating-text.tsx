import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RotatingTextProps {
  texts: string[]
  className?: string
  rotationInterval?: number
}

export function RotatingText({
  texts,
  className = "",
  rotationInterval = 2500,
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }, rotationInterval)
    return () => clearInterval(interval)
  }, [texts.length, rotationInterval])

  const currentText = useMemo(() => texts[currentIndex] || "", [texts, currentIndex])

  return (
    <span className={cn("inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{
            ...(prefersReducedMotion ? { duration: 0.15 } : { type: "spring", damping: 25, stiffness: 300 }),
          }}
          className="inline-block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
