import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MessageSquare, Wrench, Zap, User, Bot, Globe, Monitor } from 'lucide-react'
import type { DetailedChatLog } from '@/lib/api-client'

interface ChatLogDetailModalProps {
  log: DetailedChatLog | null
  isOpen: boolean
  onClose: () => void
}

export function ChatLogDetailModal({ log, isOpen, onClose }: ChatLogDetailModalProps) {
  if (!log) return null

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1) return `${Math.round(ms * 1000)}ms`
    return `${ms.toFixed(2)}s`
  }

  const getToolIcon = (toolName: string) => {
    switch (toolName.toLowerCase()) {
      case 'knowledge_search':
      case 'search':
      case 'codebase_search':
        return <Zap className="w-4 h-4" />
      case 'knowledge_validation':
      case 'validation_guard':
        return <MessageSquare className="w-4 h-4 text-green-500" />
      case 'read_file':
      case 'file_search':
        return <MessageSquare className="w-4 h-4" />
      case 'project_details':
      case 'skill_assessment':
      case 'experience_lookup':
        return <Zap className="w-4 h-4 text-blue-500" />
      default:
        return <Wrench className="w-4 h-4" />
    }
  }

  const getModalActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'open':
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'close':
        return <MessageSquare className="w-4 h-4 text-gray-500" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        style={{ 
          zIndex: 70,
          position: 'fixed'
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              chat log details
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                #{log.id}
              </Badge>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatResponseTime(log.responseTime)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  timestamp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatTimestamp(log.timestamp)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono text-muted-foreground">{log.sessionId}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                user query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{log.userQuery}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-yellow-500" />
                assistant response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{log.finalResponse}</p>
              </div>
            </CardContent>
          </Card>

          {log.toolsUsed && log.toolsUsed.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-purple-500" />
                  tools executed ({log.toolsUsed.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {log.toolsUsed.map((tool, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getToolIcon(tool.tool_name)}
                          <span className="font-medium text-sm">{tool.tool_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatResponseTime(tool.execution_time)}
                        </div>
                      </div>
                      {tool.result && (
                        <div className="bg-muted/30 rounded p-2 text-xs">
                          <pre className="whitespace-pre-wrap font-mono">
                            {typeof tool.result === 'string' 
                              ? tool.result.length > 200 
                                ? tool.result.substring(0, 200) + '...' 
                                : tool.result
                              : JSON.stringify(tool.result, null, 2).substring(0, 200) + '...'
                            }
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {log.modalActions && log.modalActions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-500" />
                  modal actions ({log.modalActions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {log.modalActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {getModalActionIcon(action.action)}
                      <span className="font-medium">{action.action}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-muted-foreground">{action.modal_id}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {log.suggestions && log.suggestions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  suggestions ({log.suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {log.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-muted/50 rounded p-2 text-sm">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(log.userIp || log.userAgent) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-500" />
                  client information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  {log.userIp && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      <span className="font-medium">ip address:</span>
                      <span className="text-muted-foreground">{log.userIp}</span>
                    </div>
                  )}
                  {log.userAgent && (
                    <div className="flex items-start gap-2">
                      <Monitor className="w-3 h-3 mt-0.5" />
                      <span className="font-medium">user agent:</span>
                      <span className="text-muted-foreground break-all">{log.userAgent}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 