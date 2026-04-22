"use client";

import { useState } from "react";
import { Send, Sparkles, ChevronDown, ChevronRight, Loader2, Wrench, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCall[];
  isThinking?: boolean;
}

interface ToolCall {
  id: string;
  name: string;
  status: "running" | "complete" | "error";
  result?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Can you help me deploy the latest changes to production?",
  },
  {
    id: "2",
    role: "assistant",
    content: "I'll help you deploy to production. Let me check the current status and run the deployment.",
    toolCalls: [
      {
        id: "t1",
        name: "check_deployment_status",
        status: "complete",
        result: '{"status": "ready", "branch": "main", "commit": "a1b2c3d"}',
      },
      {
        id: "t2",
        name: "trigger_deployment",
        status: "complete",
        result: '{"deployment_id": "dpl_xyz123", "status": "success", "url": "https://app.example.com"}',
      },
    ],
  },
];

const models = ["gpt-4o", "claude-3.5-sonnet", "gemini-pro", "llama-3.1-70b"];

export function TerminalTab() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [forceMode, setForceMode] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [isThinking, setIsThinking] = useState(false);

  const toggleToolExpand = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsThinking(true);
    
    // Simulate response
    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've processed your request. The operation completed successfully.",
        },
      ]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Tool Calls */}
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="ml-11 space-y-2">
                {message.toolCalls.map((tool) => (
                  <div key={tool.id} className="bg-secondary/50 rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => toggleToolExpand(tool.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary transition-colors"
                    >
                      {expandedTools.has(tool.id) ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Wrench className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium text-foreground">{tool.name}</span>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                          tool.status === "complete"
                            ? "bg-cyan-400/20 text-cyan-400"
                            : tool.status === "error"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-amber-400/20 text-amber-400"
                        }`}
                      >
                        {tool.status}
                      </span>
                    </button>
                    {expandedTools.has(tool.id) && tool.result && (
                      <div className="px-3 pb-3">
                        <pre className="text-xs text-muted-foreground bg-background rounded-md p-2 overflow-x-auto">
                          {JSON.stringify(JSON.parse(tool.result), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card space-y-3">
        {/* Model Picker & Force Mode */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              <span className="text-muted-foreground">Model:</span>
              <span className="text-foreground">{selectedModel}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            {showModelPicker && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-10">
                {models.map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelPicker(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary transition-colors ${
                      model === selectedModel ? "text-primary bg-primary/10" : "text-foreground"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => setForceMode(!forceMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              forceMode
                ? "bg-cyan-400/20 text-cyan-400"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Force
          </button>
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
