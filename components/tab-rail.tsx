"use client";

import { Terminal, Activity, Code2, Settings, GitBranch, ScrollText } from "lucide-react";
import type { TabId } from "@/app/page";

interface TabRailProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "terminal", label: "Terminal", icon: <Terminal className="w-5 h-5" /> },
  { id: "pulse", label: "Pulse", icon: <Activity className="w-5 h-5" /> },
  { id: "snippets", label: "Snippets", icon: <Code2 className="w-5 h-5" /> },
  { id: "repos", label: "Repos", icon: <GitBranch className="w-5 h-5" /> },
  { id: "logs", label: "Logs", icon: <ScrollText className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export function TabRail({ activeTab, onTabChange }: TabRailProps) {
  return (
    <nav className="h-14 flex items-center justify-around bg-card border-t border-border shrink-0 px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
