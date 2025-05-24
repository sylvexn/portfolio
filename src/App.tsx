import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { Dock } from '@/components/dock'
import { Background } from '@/components/background'
import { WhoamiModal } from '@/components/whoami-modal'
import { ContactModal } from '@/components/contact-modal'
import { SkillsModal } from '@/components/skills-modal'
import { ProjectsModal } from '@/components/projects-modal'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [isDark, setIsDark] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Background />
      
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      
      <main className="relative z-10">
        <HeroSection />
      </main>
      
      <Dock onItemClick={handleOpenModal} />

      <WhoamiModal 
        isOpen={activeModal === 'whoami'} 
        onClose={handleCloseModal} 
      />

      <SkillsModal
        isOpen={activeModal === 'skills'}
        onClose={handleCloseModal}
      />

      <ProjectsModal
        isOpen={activeModal === 'projects'}
        onClose={handleCloseModal}
      />

      <ContactModal
        isOpen={activeModal === 'contact'}
        onClose={handleCloseModal}
      />

      <Toaster />
    </div>
  )
}

export default App 