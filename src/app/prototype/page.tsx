"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Plus } from "lucide-react";
import { useState } from "react";

export default function PrototypePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation - 48px fixed height */}
      <header className="h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 h-8 w-8"
          >
            {sidebarCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
          <h1 className="font-semibold text-lg">Thumbnail Editor</h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            user@example.com
          </span>
          <Button variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content Area - calc(100vh - 48px) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Left Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-16" : "w-72"
          } border-r bg-muted/10 transition-all duration-300 flex flex-col`}
        >
          <div className="p-4 pb-10 pt-10">
            {!sidebarCollapsed && (
              <Button className="w-full h-16" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
            {sidebarCollapsed && (
              <Button size="sm" className="w-full p-2">
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 p-2 space-y-2">
            {/* Mock project list */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors ${
                  sidebarCollapsed ? "aspect-square" : ""
                }`}
              >
                {!sidebarCollapsed ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                    <p className="text-sm font-medium">Project {i}</p>
                  </div>
                ) : (
                  <div className="w-full h-8 bg-muted rounded"></div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* History Panel - Fixed 300px width */}
        <div className="w-80 border-r bg-muted/5 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-base">Edit History</h2>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {/* Mock history items */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-muted rounded flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Edit {i}: Add modern tech background
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area - Flexible width */}
        <main className="flex-1 flex flex-col bg-background relative">
          <div className="flex-1 flex items-center justify-center p-8 pb-32">
            {/* Mock image display area */}
            <div className="max-w-2xl w-full">
              <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <p className="text-muted-foreground">Image Preview Area</p>
              </div>
            </div>
          </div>

          {/* Fixed bottom prompt input */}
          <div className="absolute bottom-0 left-0 right-0 p-10 bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <textarea
                  placeholder="Describe how you want to edit this image..."
                  className="flex-1 min-h-[60px] max-h-[200px] px-4 py-3 border border-input bg-background rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                  rows={1}
                />
                <Button className="h-[60px] px-6">
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
