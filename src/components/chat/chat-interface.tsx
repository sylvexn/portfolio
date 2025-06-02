import { useState, useEffect, useRef, createContext } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, RotateCcw, User, Bot, Wifi, WifiOff, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import type { ChatMessage } from '@/lib/api-client'
import ReactMarkdown from 'react-markdown'
import { ModelSwitcher } from '@/components/model-switcher'
import { ExploreButton } from './explore-button'
import { PasswordVerificationPopover } from './password-verification-modal'

interface ChatInterfaceProps {
  className?: string
}

interface ModalContextType {
  openModal: (modalId: string) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

const ChatMessageContent = ({ content, onModalOpen }: { content: string, onModalOpen: (modalId: string) => void }) => {
  const cleanContent = content.replace(/\*\*explore:\w+\*\*/g, '').trim()
  
  return (
    <div className="space-y-2">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-lg font-bold text-yellow-500 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold text-yellow-400 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-medium text-yellow-300 mb-1">{children}</h3>,
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-yellow-500">{children}</strong>,
          em: ({ children }) => <em className="italic text-yellow-400">{children}</em>,
          code: ({ children }) => (
            <code className="bg-yellow-500/10 text-yellow-300 px-1 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
      
      <ExploreButton content={content} onModalOpen={onModalOpen} />
    </div>
  )
}

const PROMPT_SUGGESTIONS = [
  [
    "who is blake?",
    "what's blake's background?",
    "how long has blake been coding?"
  ],
  [
    "what projects has blake built?",
    "what tech does blake use?",
    "what's blake's recent work?"
  ],
  [
    "what are blake's skills?",
    "frontend or backend?",
    "what's blake's preferred stack?"
  ]
]

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLogAuthenticated, setIsLogAuthenticated] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const openModal = (modalId: string) => {
    const event = new CustomEvent('openModal', { detail: { modalId } })
    window.dispatchEvent(event)
  }

  const toggleLogsPanel = () => {
    const event = new CustomEvent('toggleLogsPanel')
    window.dispatchEvent(event)
  }

  const handlePasswordVerified = () => {
    setIsLogAuthenticated(true)
    const event = new CustomEvent('toggleLogsPanel')
    window.dispatchEvent(event)
  }

  const checkBackendConnection = async () => {
    const isHealthy = await apiClient.healthCheck()
    setIsConnected(isHealthy)
    return isHealthy
  }

  useEffect(() => {
    checkBackendConnection()
    
    const interval = setInterval(checkBackendConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const randomSuggestions = PROMPT_SUGGESTIONS.map(category => {
      const randomIndex = Math.floor(Math.random() * category.length)
      return category[randomIndex]!
    })
    setSuggestions(randomSuggestions)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend || isTyping) return

    if (!isConnected) {
      setError('backend service is not available. please try again later.')
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    setError(null)

    try {
      const response = await apiClient.chat(textToSend, messages)
      
      if (!response.success) {
        throw new Error(response.error || 'failed to get response')
      }

      if (response.data) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
        
        if (response.data.suggestions) {
          setSuggestions(response.data.suggestions)
        }

        if (response.data.modal_actions && response.data.modal_actions.length > 0) {
          const modalAction = response.data.modal_actions[0]
          if (modalAction && modalAction.action === 'open_modal' && modalAction.modal_id) {
            setTimeout(() => openModal(modalAction.modal_id), 500)
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'failed to send message')
      console.error('chat error:', err)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSendMessage(suggestion)
  }

  const clearChat = async () => {
    try {
      await apiClient.clearChat()
      setMessages([])
      setError(null)
      
      const randomSuggestions = PROMPT_SUGGESTIONS.map(category => {
        const randomIndex = Math.floor(Math.random() * category.length)
        return category[randomIndex]!
      })
      setSuggestions(randomSuggestions)
    } catch (err: any) {
      setError('failed to clear chat')
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <ModalContext.Provider value={{ openModal }}>
      <div className={cn(
        "relative flex flex-col h-full bg-background/95 backdrop-blur-sm",
        "border border-border/50 rounded-lg shadow-lg",
        className
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-foreground">chat with blake's ai</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <ModelSwitcher />
            
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs",
              isConnected 
                ? "bg-green-500/10 text-green-500" 
                : "bg-red-500/10 text-red-500"
            )}>
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'connected' : 'disconnected'}
            </div>

            {isLogAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLogsPanel}
                className="text-muted-foreground hover:text-foreground"
                title="view chat logs"
              >
                <FileText className="w-4 h-4" />
              </Button>
            ) : (
              <PasswordVerificationPopover onVerified={handlePasswordVerified}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  title="view chat logs"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </PasswordVerificationPopover>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground space-y-4">
              <p>ask me anything about blake!</p>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block mx-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex gap-3",
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            )}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-yellow-500" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 space-y-1",
                message.role === 'assistant' 
                  ? 'bg-muted text-foreground' 
                  : 'bg-yellow-500 text-black ml-auto'
              )}>
                <div className="text-sm">
                  {message.role === 'assistant' ? (
                    <ChatMessageContent content={message.content} onModalOpen={openModal} />
                  ) : (
                    message.content
                  )}
                </div>
                <div className={cn(
                  "text-xs opacity-60",
                  message.role === 'assistant' ? 'text-muted-foreground' : 'text-black/60'
                )}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border/50 p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isConnected ? "ask about blake's experience, projects, or skills..." : "backend service unavailable..."}
              disabled={!isConnected || isTyping}
              className="flex-1 min-h-0 max-h-32 resize-none"
              rows={1}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || !isConnected || isTyping}
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {suggestions.length > 0 && messages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

    </ModalContext.Provider>
  )
} 