import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { Dock } from '@/components/dock'
import { Background } from '@/components/background'

function App() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Background />
      
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      
      <main className="relative z-10">
        <HeroSection />
      </main>
      
      <Dock />
    </div>
  )
}

export default App 