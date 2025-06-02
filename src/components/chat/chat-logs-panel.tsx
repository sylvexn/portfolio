import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Clock, MessageSquare, Wrench, Zap, RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import type { DetailedChatLog } from '@/lib/api-client'
import { ChatLogDetailModal } from './chat-log-detail-modal'

interface ChatLogsPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ChatLogsPanel({ isOpen, onClose, className }: ChatLogsPanelProps) {
  const [logs, setLogs] = useState<DetailedChatLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<DetailedChatLog | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const fetchLogs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getChatLogs()
      
      if (response.success && response.data) {
        setLogs(response.data.logs)
      } else {
        setError(response.error || 'unable to fetch chat logs')
      }
    } catch (err: any) {
      console.error('failed to fetch logs:', err)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('unable to connect to backend service. please check if the server is running.')
      } else {
        setError(err.message || 'network error occurred while fetching logs')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearLogs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.clearChatLogs()
      
      if (response.success) {
        setLogs([])
      } else {
        setError(response.error || 'failed to clear logs')
      }
    } catch (err: any) {
      setError(err.message || 'failed to clear logs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
    }
  }, [isOpen])

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString()
  }

  const formatResponseTime = (ms: number | undefined) => {
    if (ms === null || ms === undefined) return 'n/a'
    if (ms < 1) return `${Math.round(ms * 1000)}ms`
    return `${ms.toFixed(2)}s`
  }

  const handleLogClick = (log: DetailedChatLog) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false)
    setSelectedLog(null)
  }

  const getToolIcon = (toolName: string) => {
    switch (toolName.toLowerCase()) {
      case 'knowledge_search':
      case 'search':
      case 'codebase_search':
        return <Zap className="w-3 h-3" />
      case 'knowledge_validation':
      case 'validation_guard':
        return <MessageSquare className="w-3 h-3 text-green-500" />
      case 'read_file':
      case 'file_search':
        return <MessageSquare className="w-3 h-3" />
      case 'project_details':
      case 'skill_assessment':
      case 'experience_lookup':
        return <Zap className="w-3 h-3 text-blue-500" />
      default:
        return <Wrench className="w-3 h-3" />
    }
  }

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <div className={cn("fixed left-0 top-0 z-[60] h-full", className)}>
        <div className="relative h-full flex">
          <div 
            className={cn(
              "bg-background/95 backdrop-blur-sm border-r border-border/50",
              "transition-all duration-500 ease-in-out overflow-hidden",
              "h-full shadow-xl",
              isOpen ? "w-[640px]" : "w-0"
            )}
          >
            <div className="h-full w-[640px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-foreground">chat logs</h3>
                    <Badge variant="secondary" className="text-xs">
                      {logs.length}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchLogs}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-foreground"
                      title="refresh logs"
                    >
                      <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearLogs}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-red-500"
                      title="clear all logs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-500 text-sm">
                    <div className="font-medium mb-1">backend connection failed</div>
                    <div className="text-xs mb-2">{error}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      start the backend server to view chat logs
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchLogs}
                      className="text-red-500 hover:text-red-600"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      retry connection
                    </Button>
                  </div>
                )}

                <div className="h-full overflow-y-auto p-4 space-y-3">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">
                      <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
                      <p>loading chat logs...</p>
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>no chat logs found</p>
                      <p className="text-xs">logs are automatically saved when you chat</p>
                    </div>
                  ) : (
                    logs.map((log) => (
                      <Card
                        key={log.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleLogClick(log)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium text-yellow-500">
                              #{log.id}
                            </CardTitle>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatResponseTime(log.responseTime)}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(log.timestamp)}
                            </div>
                            <div className="text-sm line-clamp-2">
                              {log.userQuery}
                            </div>
                            {(log.toolsUsed?.length ?? 0) > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {(log.toolsUsed || []).map((tool, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs h-5 px-1"
                                  >
                                    {getToolIcon(tool.tool_name)}
                                    <span className="ml-1">{tool.tool_name}</span>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ChatLogDetailModal
        log={selectedLog}
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
      />
    </>
  )
} 