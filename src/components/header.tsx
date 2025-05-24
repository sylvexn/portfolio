import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleTheme}
        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </header>
  )
} 