import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Bot, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Model {
  id: string
  name: string
  provider: string
  status: 'active' | 'available' | 'unavailable'
}

interface ModelSwitcherProps {
  className?: string
}

export function ModelSwitcher({ className }: ModelSwitcherProps) {
  const [currentModel, setCurrentModel] = useState<Model>({
    id: 'anthropic/claude-3.5-sonnet',
    name: 'claude 3.5 sonnet',
    provider: 'anthropic',
    status: 'active'
  })
  
  const [availableModels] = useState<Model[]>([
    {
      id: 'anthropic/claude-3.5-sonnet',
      name: 'claude 3.5 sonnet',
      provider: 'anthropic',
      status: 'active'
    },
    {
      id: 'openai/gpt-4o',
      name: 'gpt-4o',
      provider: 'openai',
      status: 'available'
    },
    {
      id: 'anthropic/claude-3-haiku',
      name: 'claude 3 haiku',
      provider: 'anthropic',
      status: 'available'
    },
    {
      id: 'google/gemma-2-9b-it:free',
      name: 'gemma 2 9b',
      provider: 'google',
      status: 'available'
    }
  ])

  const getModelStatusColor = (status: Model['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'available':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'unavailable':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-muted'
    }
  }

  const handleModelSwitch = (model: Model) => {
    setCurrentModel(model)
    // here you would implement the actual model switching logic
    // this could be an API call to update the backend model preference
    console.log(`switching to model: ${model.id}`)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-medium",
              "border-border/50 hover:border-yellow-500/50",
              "hover:bg-yellow-500/5"
            )}
          >
            <Bot className="w-3 h-3 mr-1.5" />
            {currentModel.name}
            <ChevronDown className="w-3 h-3 ml-1.5" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-background/95 backdrop-blur-sm border-border/50"
        >
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 font-medium">
              available models
            </div>
            
            {availableModels.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleModelSwitch(model)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer",
                  "hover:bg-yellow-500/5 hover:text-foreground",
                  currentModel.id === model.id && "bg-yellow-500/10"
                )}
              >
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.provider}</div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs h-5 px-2",
                    getModelStatusColor(model.status)
                  )}
                >
                  {model.status}
                </Badge>
              </DropdownMenuItem>
            ))}
            
            <div className="mt-2 pt-2 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                models automatically fallback on rate limits
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 