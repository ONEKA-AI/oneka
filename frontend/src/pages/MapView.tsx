import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Filter, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const countyData = [
  { name: "Nairobi", projects: 45, highRisk: 8 },
  { name: "Mombasa", projects: 32, highRisk: 5 },
  { name: "Kisumu", projects: 28, highRisk: 7 },
  { name: "Nakuru", projects: 24, highRisk: 3 },
  { name: "Uasin Gishu", projects: 19, highRisk: 6 },
  { name: "Kiambu", projects: 22, highRisk: 4 },
];

const projectMarkers = [
  { id: 1, name: "Nairobi-Thika Highway", status: "red" as const, lat: -1.22, lng: 36.89 },
  { id: 2, name: "Kisumu Port Rehab", status: "amber" as const, lat: -0.09, lng: 34.75 },
  { id: 3, name: "Mombasa Water Phase II", status: "green" as const, lat: -4.05, lng: 39.67 },
  { id: 4, name: "Eldoret Bypass", status: "red" as const, lat: 0.52, lng: 35.27 },
];

export default function MapView() {
  return (
    <AppLayout>
      <div className="h-[calc(100vh-3.5rem)] flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-secondary/30 grid-overlay">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors">
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Map Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                <svg className="w-16 h-16 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
                  <path d="M9 4v13" />
                  <path d="M15 7v13" />
                </svg>
              </div>
              <p className="text-lg font-medium text-muted-foreground">Geographic Audit Coverage</p>
              <p className="text-sm text-muted-foreground mt-1">Interactive satellite map view</p>
              <p className="text-xs text-muted-foreground mt-4 font-mono">47 Counties • 392 Projects</p>
            </div>
          </div>

          {/* Sample Project Markers */}
          <div className="absolute top-1/4 left-1/3">
            <div className="relative group cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-status-red animate-pulse" />
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-status-red/30" />
            </div>
          </div>
          <div className="absolute top-1/3 right-1/3">
            <div className="relative group cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-status-amber" />
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-status-amber/30" />
            </div>
          </div>
          <div className="absolute bottom-1/3 left-1/4">
            <div className="relative group cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-status-green" />
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-status-green/30" />
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Risk Classification
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-red" />
                <span className="text-sm">High Risk (47)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-amber" />
                <span className="text-sm">Medium Risk (134)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-green" />
                <span className="text-sm">Verified (211)</span>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-4 right-4 glass-panel px-3 py-2">
            <span className="text-xs font-mono text-muted-foreground">
              Kenya • 1.2921°S, 36.8219°E
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border p-4 space-y-4 overflow-auto">
          {/* Filters */}
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <h3 className="section-header mb-0">Filters</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">County</label>
                <select className="console-input w-full">
                  <option>All Counties</option>
                  <option>Nairobi</option>
                  <option>Mombasa</option>
                  <option>Kisumu</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Sector</label>
                <select className="console-input w-full">
                  <option>All Sectors</option>
                  <option>Roads & Transport</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Water & Sanitation</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Risk Level</label>
                <select className="console-input w-full">
                  <option>All Levels</option>
                  <option>High Risk</option>
                  <option>Medium Risk</option>
                  <option>Verified</option>
                </select>
              </div>
            </div>
          </div>

          {/* County Summary */}
          <div className="glass-panel p-4">
            <h3 className="section-header">County Summary</h3>
            <div className="space-y-2">
              {countyData.map((county) => (
                <div 
                  key={county.name}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{county.name}</p>
                    <p className="text-xs text-muted-foreground">{county.projects} projects</p>
                  </div>
                  {county.highRisk > 0 && (
                    <span className="text-xs font-mono text-status-red">
                      {county.highRisk} high risk
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Project */}
          <div className="glass-panel p-4">
            <h3 className="section-header">Selected Project</h3>
            <div className="p-3 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status="red" />
              </div>
              <p className="font-medium text-sm">Nairobi-Thika Highway Expansion</p>
              <p className="text-xs text-muted-foreground mt-1">Nairobi / Kiambu County</p>
              <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Sum</span>
                  <span className="font-mono">KES 4.85B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disbursed</span>
                  <span className="font-mono">KES 3.42B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <span className="font-mono text-status-red">KES 2.34B</span>
                </div>
              </div>
              <button className="w-full mt-3 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-sm font-medium">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
