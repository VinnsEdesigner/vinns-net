"use client";

import { Bell, Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="h-14 flex items-center justify-between px-4 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-foreground">Nexus</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-dot" />
          <span className="text-xs text-cyan-400">Live</span>
        </div>
        <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
      </div>
    </nav>
  );
}
