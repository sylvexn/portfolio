import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ModalPlaceholderProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: React.ReactNode
}

export function ModalPlaceholder({ isOpen, onClose, title, children }: ModalPlaceholderProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {children || (
            <div className="text-center text-muted-foreground py-12">
              <p>this section is coming soon...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 