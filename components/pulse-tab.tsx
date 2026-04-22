"use client";

import { useState, useEffect } from "react";
import { Activity, Zap, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
}

interface TokenQuota {
  provider: string;
  used: number;
  total: number;
}

interface Deployment {
  id: string;
  name: string;
  status: "success" | "failed" | "building";
  time: string;
  commit: string;
}

interface ActivityEvent {
  id: string;
  type: "deploy" | "api" | "error";
  message: string;
  time: string;
}

const mockServices: ServiceStatus[] = [
  { name: "API Gateway", status: "healthy", latency: 45 },
  { name: "Database", status: "healthy", latency: 12 },
  { name: "Auth Service", status: "healthy", latency: 28 },
  { name: "CDN", status: "healthy", latency: 8 },
  { name: "Queue", status: "degraded", latency: 156 },
  { name: "Storage", status: "healthy", latency: 34 },
];

const mockQuotas: TokenQuota[] = [
  { provider: "OpenAI", used: 847000, total: 1000000 },
  { provider: "Anthropic", used: 234000, total: 500000 },
  { provider: "Google", used: 120000, total: 250000 },
];

const mockDeployments: Deployment[] = [
  { id: "1", name: "frontend-prod", status: "success", time: "2m ago", commit: "a1b2c3d" },
  { id: "2", name: "api-staging", status: "building", time: "5m ago", commit: "e4f5g6h" },
  { id: "3", name: "worker-prod", status: "failed", time: "12m ago", commit: "i7j8k9l" },
];

export function PulseTab() {
  const [activities, setActivities] = useState<ActivityEvent[]>([
    { id: "1", type: "deploy", message: "frontend-prod deployed successfully", time: "2m ago" },
    { id: "2", type: "api", message: "API rate limit warning: 80% used", time: "5m ago" },
    { id: "3", type: "error", message: "worker-prod deployment failed", time: "12m ago" },
  ]);

  // Simulate SSE activity stream
  useEffect(() => {
    const interval = setInterval(() => {
      const types: ("deploy" | "api" | "error")[] = ["deploy", "api", "error"];
      const messages = [
        "New commit pushed to main",
        "API request spike detected",
        "Database query optimized",
        "Cache invalidated",
        "SSL certificate renewed",
      ];
      
      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        time: "now",
      };
      
      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-cyan-400";
      case "degraded":
        return "bg-amber-400";
      case "down":
        return "bg-destructive";
    }
  };

  const getDeploymentIcon = (status: Deployment["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "building":
        return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* System Health */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          System Health
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {mockServices.map((service) => (
            <div
              key={service.name}
              className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                <span className="text-xs text-foreground">{service.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{service.latency}ms</span>
            </div>
          ))}
        </div>
      </section>

      {/* Token Quotas */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Token Usage
        </h2>
        <div className="space-y-3">
          {mockQuotas.map((quota) => {
            const percentage = (quota.used / quota.total) * 100;
            return (
              <div key={quota.provider} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-foreground">{quota.provider}</span>
                  <span className="text-xs text-muted-foreground">
                    {(quota.used / 1000).toFixed(0)}K / {(quota.total / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage > 90
                        ? "bg-destructive"
                        : percentage > 70
                        ? "bg-amber-400"
                        : "bg-cyan-400"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Deployments */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Deployments</h2>
        <div className="space-y-2">
          {mockDeployments.map((deployment) => (
            <div
              key={deployment.id}
              className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {getDeploymentIcon(deployment.status)}
                <div>
                  <p className="text-xs font-medium text-foreground">{deployment.name}</p>
                  <p className="text-[10px] text-muted-foreground">{deployment.commit}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">{deployment.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Activity Stream */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-dot" />
          Live Activity
        </h2>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="p-3 flex items-center gap-3">
              <AlertCircle
                className={`w-4 h-4 shrink-0 ${
                  activity.type === "error"
                    ? "text-destructive"
                    : activity.type === "deploy"
                    ? "text-cyan-400"
                    : "text-amber-400"
                }`}
              />
              <p className="text-xs text-foreground flex-1">{activity.message}</p>
              <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
