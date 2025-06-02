interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface DetailedChatLog {
  id: string
  sessionId: string
  userQuery: string
  finalResponse: string
  toolsUsed: ToolResult[]
  modalActions?: ModalAction[]
  suggestions?: string[]
  timestamp: Date
  responseTime: number
  userIp?: string
  userAgent?: string
}

interface ChatAnalytics {
  totalQueries: number
  avgResponseTime: number
  uniqueSessions: number
  firstQuery?: string
  lastQuery?: string
  popularQueries: Array<{query: string, count: number}>
}

interface ChatRequest {
  message: string
  session_id: string
  context?: ChatMessage[]
  preferences?: Record<string, any>
}

interface ToolResult {
  tool_name: string
  result: any
  execution_time: number
}

interface ModalAction {
  action: 'open_modal'
  modal_id: string
}

interface ChatResponse {
  message: string
  tool_results?: ToolResult[]
  modal_actions?: ModalAction[]
  suggestions?: string[]
  context?: ChatMessage[]
  session_id: string
}

interface ApiClientResponse {
  success: boolean
  data?: any
  error?: string
}

class ApiClient {
  private baseUrl: string
  private sessionId: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3501'
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async chat(message: string, context?: ChatMessage[]): Promise<ApiClientResponse> {
    try {
      const request: ChatRequest = {
        message,
        session_id: this.sessionId,
        context: context?.slice(-6)
      }

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()
      
      return {
        success: true,
        data
      }
    } catch (error: any) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error.message || 'failed to communicate with backend service'
      }
    }
  }

  async getChatLogs(sessionId?: string, limit: number = 100): Promise<ApiClientResponse> {
    try {
      const params = new URLSearchParams()
      if (sessionId) params.append('session_id', sessionId)
      if (limit !== 100) params.append('limit', limit.toString())
      
      const queryString = params.toString()
      const url = `${this.baseUrl}/chat/logs${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const logs: DetailedChatLog[] = data.logs.map((log: any) => ({
        id: log.id,
        sessionId: log.session_id,
        userQuery: log.user_query,
        finalResponse: log.final_response,
        toolsUsed: log.tools_used || [],
        modalActions: log.modal_actions || undefined,
        suggestions: log.suggestions || undefined,
        responseTime: log.response_time,
        timestamp: new Date(log.timestamp),
        userIp: log.user_ip || undefined,
        userAgent: log.user_agent || undefined
      }))
      
      return {
        success: true,
        data: {
          logs,
          totalCount: data.total_count,
          sessionId: data.session_id
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'failed to fetch chat logs'
      }
    }
  }

  async getChatAnalytics(days: number = 30): Promise<ApiClientResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/analytics?days=${days}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatAnalytics = await response.json()
      
      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'failed to fetch chat analytics'
      }
    }
  }

  async clearChatLogs(sessionId?: string): Promise<ApiClientResponse> {
    try {
      const params = sessionId ? `?session_id=${sessionId}` : ''
      const response = await fetch(`${this.baseUrl}/chat/logs${params}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'failed to clear chat logs'
      }
    }
  }

  async getChatHistory(): Promise<ApiClientResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/history/${this.sessionId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'failed to fetch chat history'
      }
    }
  }

  async clearChat(): Promise<ApiClientResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/clear/${this.sessionId}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      this.sessionId = this.generateSessionId()
      
      return {
        success: true
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'failed to clear chat'
      }
    }
  }

  async getAvailableTools(): Promise<ApiClientResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tools`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'failed to fetch available tools'
      }
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  getSessionId(): string {
    return this.sessionId
  }

  resetSession(): void {
    this.sessionId = this.generateSessionId()
  }
}

export const apiClient = new ApiClient()
export type { ChatMessage, ChatResponse, ApiClientResponse, ToolResult, ModalAction, DetailedChatLog, ChatAnalytics } 