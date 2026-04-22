"use client";

import { useState } from "react";
import { Search, Pin, Trash2, Eye, Code, FileText, Image, File } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  type: "code" | "research" | "image" | "file";
  content: string;
  pinned: boolean;
  createdAt: string;
}

const mockSnippets: Snippet[] = [
  {
    id: "1",
    title: "API Authentication Hook",
    type: "code",
    content: "useAuth hook implementation with JWT refresh",
    pinned: true,
    createdAt: "2h ago",
  },
  {
    id: "2",
    title: "Vector DB Comparison",
    type: "research",
    content: "Pinecone vs Weaviate vs Milvus analysis",
    pinned: true,
    createdAt: "1d ago",
  },
  {
    id: "3",
    title: "Dashboard Mockup",
    type: "image",
    content: "UI design for analytics dashboard",
    pinned: false,
    createdAt: "2d ago",
  },
  {
    id: "4",
    title: "Database Schema",
    type: "code",
    content: "PostgreSQL schema for user management",
    pinned: false,
    createdAt: "3d ago",
  },
  {
    id: "5",
    title: "API Documentation",
    type: "file",
    content: "OpenAPI spec for REST endpoints",
    pinned: false,
    createdAt: "5d ago",
  },
  {
    id: "6",
    title: "LLM Prompting Guide",
    type: "research",
    content: "Best practices for prompt engineering",
    pinned: false,
    createdAt: "1w ago",
  },
];

type FilterType = "all" | "code" | "research" | "image" | "file";

export function SnippetsTab() {
  const [snippets, setSnippets] = useState<Snippet[]>(mockSnippets);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "code", label: "Code" },
    { id: "research", label: "Research" },
    { id: "image", label: "Image" },
    { id: "file", label: "File" },
  ];

  const getTypeIcon = (type: Snippet["type"]) => {
    switch (type) {
      case "code":
        return <Code className="w-4 h-4" />;
      case "research":
        return <FileText className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "file":
        return <File className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: Snippet["type"]) => {
    switch (type) {
      case "code":
        return "bg-cyan-400/20 text-cyan-400";
      case "research":
        return "bg-amber-400/20 text-amber-400";
      case "image":
        return "bg-purple-400/20 text-purple-400";
      case "file":
        return "bg-blue-400/20 text-blue-400";
    }
  };

  const togglePin = (id: string) => {
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  };

  const deleteSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredSnippets = snippets
    .filter((s) => filter === "all" || s.type === filter)
    .filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets..."
          className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Snippets List */}
      <div className="space-y-2">
        {filteredSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className={`bg-card border rounded-lg p-4 ${
              snippet.pinned ? "border-primary/50" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeBadgeColor(snippet.type)}`}>
                    {getTypeIcon(snippet.type)}
                    {snippet.type}
                  </span>
                  {snippet.pinned && (
                    <Pin className="w-3 h-3 text-primary fill-primary" />
                  )}
                </div>
                <h3 className="text-sm font-medium text-foreground truncate">
                  {snippet.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {snippet.content}
                </p>
                <span className="text-[10px] text-muted-foreground mt-2 block">
                  {snippet.createdAt}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => togglePin(snippet.id)}
                  className={`p-2 hover:bg-secondary rounded-lg transition-colors ${
                    snippet.pinned ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Pin className={`w-4 h-4 ${snippet.pinned ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => deleteSnippet(snippet.id)}
                  className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSnippets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No snippets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
