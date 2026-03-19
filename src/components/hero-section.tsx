import { motion, useReducedMotion } from 'framer-motion'
import { RotatingText } from '@/components/textanimations/rotating-text'
import { GradientText } from '@/components/textanimations/gradient-text'
import { heroIdentity } from '@/data/content'

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const fadeInUp = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" } }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-4">
      <motion.div
        className="space-y-5 max-w-4xl"
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-semibold tracking-tight"
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.08 }}
        >
          <span className="wave-animation inline-block">👋</span>{" "}
          <span className="text-muted-foreground">{heroIdentity.greeting}</span>
        </motion.h1>

        <motion.h2
          className="text-5xl md:text-7xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.15 }}
        >
          <span className="text-muted-foreground text-3xl md:text-5xl font-light">{heroIdentity.intro}</span>
          <GradientText className="text-5xl md:text-7xl font-bold cursor-default uppercase tracking-[0.04em]">
            {heroIdentity.name}
          </GradientText>
        </motion.h2>

        <motion.div
          className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          initial={fadeInUp.initial}
          animate={fadeInUp.animate}
          transition={{ ...fadeInUp.transition, delay: 0.24 }}
        >
          i am a{" "}
          <RotatingText
            texts={heroIdentity.titles}
            className="bg-primary text-primary-foreground px-2.5 py-1 rounded-sm font-medium tracking-wide"
            rotationInterval={2500}
          />{" "}
          <br className="sm:hidden" />
          {heroIdentity.location}
        </motion.div>
      </motion.div>
    </section>
  )
}
