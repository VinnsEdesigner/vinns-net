"use client";

import { useState } from "react";
import { ChevronDown, GripVertical, Trash2, LogOut } from "lucide-react";

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
}

const availableModels: ModelConfig[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "Meta" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral" },
];

export function SettingsTab() {
  const [primaryModel, setPrimaryModel] = useState("gpt-4o");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [fallbackOrder, setFallbackOrder] = useState(["claude-3.5-sonnet", "gemini-pro", "llama-3.1-70b"]);
  
  const [settings, setSettings] = useState({
    autoSave: true,
    darkMode: true,
    notifications: true,
    analytics: false,
    streaming: true,
    codeHighlight: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeFallback = (modelId: string) => {
    setFallbackOrder((prev) => prev.filter((id) => id !== modelId));
  };

  const getModelName = (id: string) => {
    return availableModels.find((m) => m.id === id)?.name || id;
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Primary Model */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Primary Model</h2>
        <div className="relative">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-foreground text-left">{getModelName(primaryModel)}</p>
              <p className="text-xs text-muted-foreground text-left">
                {availableModels.find((m) => m.id === primaryModel)?.provider}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showModelDropdown ? "rotate-180" : ""}`} />
          </button>
          
          {showModelDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-10">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setPrimaryModel(model.id);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-secondary transition-colors ${
                    model.id === primaryModel ? "bg-primary/10" : ""
                  }`}
                >
                  <p className={`text-sm font-medium ${model.id === primaryModel ? "text-primary" : "text-foreground"}`}>
                    {model.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{model.provider}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fallback Order */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Fallback Order</h2>
        <div className="space-y-2">
          {fallbackOrder.map((modelId, index) => (
            <div
              key={modelId}
              className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
              <span className="flex-1 text-sm text-foreground">{getModelName(modelId)}</span>
              <button
                onClick={() => removeFallback(modelId)}
                className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Behavior Toggles */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Behavior</h2>
        <div className="space-y-2">
          {[
            { key: "autoSave", label: "Auto-save conversations" },
            { key: "darkMode", label: "Dark mode" },
            { key: "notifications", label: "Push notifications" },
            { key: "analytics", label: "Usage analytics" },
            { key: "streaming", label: "Streaming responses" },
            { key: "codeHighlight", label: "Code highlighting" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSetting(key as keyof typeof settings)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                settings[key as keyof typeof settings]
                  ? "bg-cyan-400/10 border-cyan-400/30"
                  : "bg-card border-border"
              }`}
            >
              <span className="text-sm text-foreground">{label}</span>
              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors ${
                  settings[key as keyof typeof settings] ? "bg-cyan-400" : "bg-secondary"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-foreground transition-transform ${
                    settings[key as keyof typeof settings] ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Session Management */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Session</h2>
        <div className="space-y-2">
          <button className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors text-left">
            Clear conversation history
          </button>
          <button className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors text-left">
            Export data
          </button>
          <button className="w-full bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
