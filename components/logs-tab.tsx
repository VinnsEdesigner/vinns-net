"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertCircle, AlertTriangle, Info, Bug } from "lucide-react";

type LogLevel = "all" | "error" | "warn" | "info" | "debug";

interface LogEntry {
  id: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  timestamp: string;
  source: string;
  details?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    level: "error",
    message: "Failed to connect to database",
    timestamp: "14:32:05",
    source: "db-service",
    details: "Connection timeout after 30000ms. Host: db.example.com:5432. Error: ETIMEDOUT",
  },
  {
    id: "2",
    level: "warn",
    message: "Rate limit approaching threshold",
    timestamp: "14:31:42",
    source: "api-gateway",
    details: "Current rate: 850/1000 requests per minute",
  },
  {
    id: "3",
    level: "info",
    message: "Deployment completed successfully",
    timestamp: "14:30:15",
    source: "deploy-service",
    details: "Deployed version v2.3.1 to production. Duration: 45s",
  },
  {
    id: "4",
    level: "debug",
    message: "Cache invalidated for user session",
    timestamp: "14:29:58",
    source: "cache-service",
    details: "Keys invalidated: session:user:12345, prefs:user:12345",
  },
  {
    id: "5",
    level: "error",
    message: "Unhandled promise rejection",
    timestamp: "14:28:33",
    source: "worker-process",
    details: "TypeError: Cannot read property 'id' of undefined\n  at processJob (/app/worker.js:45:12)",
  },
  {
    id: "6",
    level: "info",
    message: "New user registered",
    timestamp: "14:27:10",
    source: "auth-service",
  },
  {
    id: "7",
    level: "warn",
    message: "Slow query detected",
    timestamp: "14:26:45",
    source: "db-service",
    details: "Query took 2.5s. Consider adding an index on users.email",
  },
  {
    id: "8",
    level: "debug",
    message: "WebSocket connection established",
    timestamp: "14:25:30",
    source: "ws-server",
  },
];

export function LogsTab() {
  const [filter, setFilter] = useState<LogLevel>("all");
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const filters: { id: LogLevel; label: string; count: number }[] = [
    { id: "all", label: "All", count: mockLogs.length },
    { id: "error", label: "Error", count: mockLogs.filter((l) => l.level === "error").length },
    { id: "warn", label: "Warn", count: mockLogs.filter((l) => l.level === "warn").length },
    { id: "info", label: "Info", count: mockLogs.filter((l) => l.level === "info").length },
    { id: "debug", label: "Debug", count: mockLogs.filter((l) => l.level === "debug").length },
  ];

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
  };

  const getLevelIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "warn":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "info":
        return <Info className="w-4 h-4 text-cyan-400" />;
      case "debug":
        return <Bug className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-destructive";
      case "warn":
        return "text-amber-400";
      case "info":
        return "text-cyan-400";
      case "debug":
        return "text-muted-foreground";
    }
  };

  const filteredLogs = mockLogs.filter(
    (log) => filter === "all" || log.level === filter
  );

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                filter === f.id ? "bg-primary-foreground/20" : "bg-background"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Log Entries */}
      <div className="space-y-1">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => log.details && toggleExpand(log.id)}
              className={`w-full flex items-start gap-3 p-3 text-left ${
                log.details ? "hover:bg-secondary/50 cursor-pointer" : ""
              } transition-colors`}
            >
              <div className="flex items-center gap-2 shrink-0">
                {log.details ? (
                  expandedLogs.has(log.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )
                ) : (
                  <div className="w-4" />
                )}
                {getLevelIcon(log.level)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${getLevelColor(log.level)}`}>
                  {log.message}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span>{log.timestamp}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{log.source}</span>
                </div>
              </div>
            </button>
            
            {log.details && expandedLogs.has(log.id) && (
              <div className="px-3 pb-3 pl-12">
                <pre className="text-[10px] text-muted-foreground bg-background rounded-md p-2 overflow-x-auto whitespace-pre-wrap">
                  {log.details}
                </pre>
              </div>
            )}
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
