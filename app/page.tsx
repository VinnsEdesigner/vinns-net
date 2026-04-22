"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { TabRail } from "@/components/tab-rail";
import { TerminalTab } from "@/components/terminal-tab";
import { PulseTab } from "@/components/pulse-tab";
import { SnippetsTab } from "@/components/snippets-tab";
import { SettingsTab } from "@/components/settings-tab";
import { ReposTab } from "@/components/repos-tab";
import { LogsTab } from "@/components/logs-tab";

export type TabId = "terminal" | "pulse" | "snippets" | "settings" | "repos" | "logs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("terminal");

  const renderTabContent = () => {
    switch (activeTab) {
      case "terminal":
        return <TerminalTab />;
      case "pulse":
        return <PulseTab />;
      case "snippets":
        return <SnippetsTab />;
      case "settings":
        return <SettingsTab />;
      case "repos":
        return <ReposTab />;
      case "logs":
        return <LogsTab />;
      default:
        return <TerminalTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        {renderTabContent()}
      </main>
      <TabRail activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
