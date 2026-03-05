import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          className="inline-block"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
