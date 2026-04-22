"use client";

import { useState } from "react";
import { Search, GitBranch, Star, Circle, Plus } from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  branch: string;
  hasActiveSession: boolean;
  lastUpdated: string;
}

const mockRepos: Repository[] = [
  {
    id: "1",
    name: "nexus-dashboard",
    description: "AI-powered developer dashboard",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 128,
    branch: "main",
    hasActiveSession: true,
    lastUpdated: "2h ago",
  },
  {
    id: "2",
    name: "vector-db-client",
    description: "Universal vector database client library",
    language: "Python",
    languageColor: "#3572A5",
    stars: 89,
    branch: "develop",
    hasActiveSession: false,
    lastUpdated: "1d ago",
  },
  {
    id: "3",
    name: "llm-gateway",
    description: "Multi-provider LLM gateway service",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 256,
    branch: "main",
    hasActiveSession: true,
    lastUpdated: "3h ago",
  },
  {
    id: "4",
    name: "prompt-templates",
    description: "Collection of optimized prompt templates",
    language: "Markdown",
    languageColor: "#083fa1",
    stars: 412,
    branch: "main",
    hasActiveSession: false,
    lastUpdated: "5d ago",
  },
  {
    id: "5",
    name: "deploy-cli",
    description: "Command-line deployment tool",
    language: "Rust",
    languageColor: "#dea584",
    stars: 67,
    branch: "v2",
    hasActiveSession: false,
    lastUpdated: "2w ago",
  },
];

export function ReposTab() {
  const [search, setSearch] = useState("");
  const [repos] = useState<Repository[]>(mockRepos);

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()) ||
      repo.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Repositories</h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Repository List */}
      <div className="space-y-2">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className={`bg-card border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer ${
              repo.hasActiveSession ? "border-cyan-400/50" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {repo.name}
                  </h3>
                  {repo.hasActiveSession && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-400/20 rounded text-[10px] text-cyan-400 font-medium">
                      <Circle className="w-1.5 h-1.5 fill-current" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {repo.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Circle
                      className="w-2.5 h-2.5"
                      style={{ fill: repo.languageColor, color: repo.languageColor }}
                    />
                    {repo.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {repo.branch}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {repo.lastUpdated}
              </span>
            </div>
          </div>
        ))}

        {filteredRepos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No repositories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
