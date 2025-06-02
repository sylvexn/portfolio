import { RotatingText } from "@/components/textanimations/RotatingText"
import GradientText from "@/components/textanimations/GradientText/GradientText"

export function HeroSection() {
  const developerTitles = [
    "fullstack developer",
    "devops wizard",
    "tech support guru", 
    "network sysadmin",
    "database manager",
    "pokemon trainer"
  ]

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 px-4">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-sans">
          <span className="wave-animation inline-block">👋</span>{" "}
          <span className="text-muted-foreground">hello world</span>
        </h1>
        <h2 className="text-5xl md:text-7xl font-sans flex items-baseline">
          <span className="text-muted-foreground text-4xl md:text-6xl mr-4 font-light">my name is</span>
          <GradientText 
            colors={["#fbbf24", "#f59e0b", "#d97706", "#fbbf24"]}
            animationSpeed={6}
            className="text-5xl md:text-7xl font-bold font-sans cursor-default"
          >
            blake b.
          </GradientText>
        </h2>
        <div className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-sans">
          i am a{" "}
          <RotatingText
            texts={developerTitles}
            className="inline-flex items-center bg-white text-black px-2 py-1 rounded border border-gray-300 font-medium"
            rotationInterval={2500}
            splitBy="words"
            mainClassName="inline-flex"
          />{" "}
          based in florida, usa
        </div>
      </div>
    </section>
  )
} 