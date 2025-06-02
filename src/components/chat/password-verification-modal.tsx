import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordVerificationModalProps {
  children: React.ReactNode
  onVerified: () => void
}

export function PasswordVerificationPopover({ 
  children,
  onVerified 
}: PasswordVerificationModalProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError('')

    const expectedPassword = import.meta.env.VITE_LOG_PASSWORD

    if (!expectedPassword) {
      setError('log password not configured')
      setIsVerifying(false)
      return
    }

    if (password === expectedPassword) {
      setPassword('')
      setError('')
      setShowPassword(false)
      setIsOpen(false)
      onVerified()
    } else {
      setError('incorrect password')
      setPassword('')
    }

    setIsVerifying(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setPassword('')
    setError('')
    setShowPassword(false)
  }

  const handleTriggerClick = () => {
    setIsOpen(true)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <>
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {children}
      </div>
      
      {isOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div 
            className={cn(
              "relative max-w-md w-full mx-4 p-6 rounded-lg",
              "bg-gradient-to-br from-red-950/95 to-red-900/90",
              "border border-red-500/30 shadow-2xl shadow-red-500/20",
              "text-red-50 animate-in fade-in-0 zoom-in-95 duration-200"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-red-800/30 text-red-300 hover:text-red-100"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xl font-semibold text-red-100">
                  <Lock className="w-6 h-6 text-red-400" />
                  log access verification
                </div>
                <p className="text-red-200/80 text-sm leading-relaxed">
                  enter the password to access chat logs and conversation history
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm text-red-200 font-medium">
                    password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="enter password"
                      className={cn(
                        "pr-12 h-11 text-base",
                        "bg-red-900/30 border-red-500/30 text-red-50",
                        "placeholder:text-red-300/50",
                        "focus:border-red-400 focus:ring-red-400/20"
                      )}
                      autoFocus
                      disabled={isVerifying}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-9 w-9 px-0 hover:bg-red-800/30"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isVerifying}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-red-300" />
                      ) : (
                        <Eye className="w-4 h-4 text-red-300" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-300 bg-red-900/20 px-3 py-2 rounded-md border border-red-500/20">
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isVerifying}
                    className={cn(
                      "h-10 px-6",
                      "border-red-500/30 text-red-200 hover:bg-red-800/20",
                      "hover:border-red-400/50 hover:text-red-100"
                    )}
                  >
                    cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!password.trim() || isVerifying}
                    className={cn(
                      "h-10 px-6 font-medium",
                      "bg-gradient-to-r from-red-600 to-red-700",
                      "hover:from-red-500 hover:to-red-600",
                      "disabled:from-red-800 disabled:to-red-900",
                      "shadow-lg shadow-red-500/20"
                    )}
                  >
                    {isVerifying ? 'verifying...' : 'access logs'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 