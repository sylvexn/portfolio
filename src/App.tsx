import { useEffect, useState } from 'react'
import { Background } from '@/components/background'
import { HeroSection } from '@/components/hero-section'
import { Dock } from '@/components/dock'
import { WhoamiModal } from '@/components/whoami-modal'
import { WorkHistoryModal } from '@/components/work-history-modal'
import { SkillsModal } from '@/components/skills-modal'
import { ProjectsModal } from '@/components/projects-modal'
import { ContactModal } from '@/components/contact-modal'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { seo } from '@/data/content'

function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleCloseModal = () => setActiveModal(null)

  useEffect(() => {
    document.title = seo.title
    const updateMeta = (selector: string, content: string) => {
      const element = document.querySelector(selector)
      if (element) {
        element.setAttribute("content", content)
      }
    }
    updateMeta('meta[name="description"]', seo.description)
    updateMeta('meta[name="theme-color"]', seo.themeColor)
    updateMeta('meta[property="og:title"]', seo.ogTitle)
    updateMeta('meta[property="og:description"]', seo.ogDescription)
    updateMeta('meta[property="og:url"]', seo.ogUrl)
  }, [])

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden">
        <Background />

        <main className="relative z-10 h-screen">
          <HeroSection />
        </main>

        <Dock onItemClick={setActiveModal} />

        <WhoamiModal isOpen={activeModal === 'whoami'} onClose={handleCloseModal} />
        <WorkHistoryModal isOpen={activeModal === 'resume'} onClose={handleCloseModal} />
        <SkillsModal isOpen={activeModal === 'skills'} onClose={handleCloseModal} />
        <ProjectsModal isOpen={activeModal === 'projects'} onClose={handleCloseModal} />
        <ContactModal isOpen={activeModal === 'contact'} onClose={handleCloseModal} />

        <Toaster />
      </div>
    </TooltipProvider>
  )
}

export default App
