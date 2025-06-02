import { useState, useEffect } from 'react'
import { HeroSection } from '@/components/hero-section'
import { Dock } from '@/components/dock'
import { Background } from '@/components/background'
import { SidePanel } from '@/components/side-panel'
import { ChatLogsPanel } from '@/components/chat/chat-logs-panel'
import { WhoamiModal } from '@/components/whoami-modal'
import { WorkHistoryModal } from '@/components/work-history-modal'
import { ContactModal } from '@/components/contact-modal'
import { SkillsModal } from '@/components/skills-modal'
import { ProjectsModal } from '@/components/projects-modal'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [isDark] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isLogsPanelOpen, setIsLogsPanelOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const { modalId } = event.detail
      setActiveModal(modalId)
    }

    const handleToggleLogsPanel = () => {
      setIsLogsPanelOpen(prev => !prev)
    }

    window.addEventListener('openModal', handleOpenModal as EventListener)
    window.addEventListener('toggleLogsPanel', handleToggleLogsPanel as EventListener)
    
    return () => {
      window.removeEventListener('openModal', handleOpenModal as EventListener)
      window.removeEventListener('toggleLogsPanel', handleToggleLogsPanel as EventListener)
    }
  }, [])

  const handleOpenModal = (modalId: string) => {
    setActiveModal(modalId)
  }

  const handleCloseModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Background />
      
      <main className="relative z-10 h-screen">
        <HeroSection />
      </main>
      
      <ChatLogsPanel
        isOpen={isLogsPanelOpen}
        onClose={() => setIsLogsPanelOpen(false)}
      />
      
      <SidePanel />
      
      <Dock onItemClick={handleOpenModal} />

      <WhoamiModal 
        isOpen={activeModal === 'whoami'} 
        onClose={handleCloseModal} 
      />

      <WorkHistoryModal
        isOpen={activeModal === 'resume'}
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