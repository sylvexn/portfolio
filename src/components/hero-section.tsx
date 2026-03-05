import { motion } from 'framer-motion'
import { RotatingText } from '@/components/textanimations/rotating-text'
import { GradientText } from '@/components/textanimations/gradient-text'

const developerTitles = [
  "fullstack developer",
  "devops wizard",
  "tech support guru",
  "network sysadmin",
  "database manager",
  "pokemon trainer"
]

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 px-4">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="wave-animation inline-block">👋</span>{" "}
          <span className="text-muted-foreground">hello world</span>
        </motion.h1>
        
        <motion.h2
          className="text-5xl md:text-7xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-muted-foreground text-3xl md:text-5xl font-light">my name is</span>
          <GradientText className="text-5xl md:text-7xl font-bold cursor-default">
            blake b.
          </GradientText>
        </motion.h2>
        
        <motion.div
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          i am a{" "}
          <RotatingText
            texts={developerTitles}
            className="bg-foreground text-background px-2 py-0.5 rounded font-medium"
            rotationInterval={2500}
          />{" "}
          <br className="sm:hidden" />
          based in florida, usa
        </motion.div>
      </motion.div>
    </section>
  )
}
