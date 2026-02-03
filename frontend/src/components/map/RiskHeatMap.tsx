import { useState } from "react";
import { Filter, Layers, ZoomIn, ZoomOut, Maximize2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectMarker {
  id: string;
  name: string;
  status: "red" | "amber" | "green";
  lat: number;
  lng: number;
  county: string;
  constituency: string;
  fundingSource: string;
  budget: string;
  riskScore: number;
}

const projectMarkers: ProjectMarker[] = [
  { id: "1", name: "Nairobi-Thika Highway Expansion", status: "red", lat: 35, lng: 25, county: "Nairobi", constituency: "Kasarani", fundingSource: "Treasury", budget: "KES 4.85B", riskScore: 87 },
  { id: "2", name: "Kisumu Port Rehabilitation", status: "amber", lat: 55, lng: 45, county: "Kisumu", constituency: "Kisumu Central", fundingSource: "NG-CDF", budget: "KES 2.1B", riskScore: 54 },
  { id: "3", name: "Mombasa Water Supply Phase II", status: "green", lat: 75, lng: 65, county: "Mombasa", constituency: "Mvita", fundingSource: "World Bank", budget: "KES 890M", riskScore: 12 },
  { id: "4", name: "Eldoret Bypass Construction", status: "red", lat: 25, lng: 55, county: "Uasin Gishu", constituency: "Ainabkoi", fundingSource: "Treasury", budget: "KES 3.2B", riskScore: 91 },
  { id: "5", name: "Nakuru Health Facility", status: "green", lat: 45, lng: 35, county: "Nakuru", constituency: "Nakuru Town East", fundingSource: "NG-CDF", budget: "KES 450M", riskScore: 8 },
  { id: "6", name: "Garissa Solar Plant", status: "amber", lat: 65, lng: 75, county: "Garissa", constituency: "Garissa Township", fundingSource: "AfDB", budget: "KES 1.8B", riskScore: 45 },
  { id: "7", name: "Machakos Stadium Upgrade", status: "red", lat: 40, lng: 60, county: "Machakos", constituency: "Machakos Town", fundingSource: "Treasury", budget: "KES 780M", riskScore: 78 },
  { id: "8", name: "Nyeri Market Complex", status: "green", lat: 30, lng: 40, county: "Nyeri", constituency: "Nyeri Town", fundingSource: "NG-CDF", budget: "KES 320M", riskScore: 15 },
];

const counties = ["All Counties", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Uasin Gishu", "Garissa", "Machakos", "Nyeri"];
const constituencies = ["All Constituencies", "Kasarani", "Kisumu Central", "Mvita", "Ainabkoi", "Nakuru Town East", "Garissa Township", "Machakos Town", "Nyeri Town"];
const fundingSources = ["All Sources", "Treasury", "NG-CDF", "World Bank", "AfDB"];
const riskLevels = ["All Levels", "High Risk", "Medium Risk", "Verified"];

interface RiskHeatMapProps {
  onSelectProject?: (project: ProjectMarker) => void;
}

export function RiskHeatMap({ onSelectProject }: RiskHeatMapProps) {
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedConstituency, setSelectedConstituency] = useState("All Constituencies");
  const [selectedFunding, setSelectedFunding] = useState("All Sources");
  const [selectedRisk, setSelectedRisk] = useState("All Levels");
  const [hoveredProject, setHoveredProject] = useState<ProjectMarker | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredMarkers = projectMarkers.filter((marker) => {
    if (selectedCounty !== "All Counties" && marker.county !== selectedCounty) return false;
    if (selectedConstituency !== "All Constituencies" && marker.constituency !== selectedConstituency) return false;
    if (selectedFunding !== "All Sources" && marker.fundingSource !== selectedFunding) return false;
    if (selectedRisk === "High Risk" && marker.status !== "red") return false;
    if (selectedRisk === "Medium Risk" && marker.status !== "amber") return false;
    if (selectedRisk === "Verified" && marker.status !== "green") return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "red": return "bg-status-red";
      case "amber": return "bg-status-amber";
      case "green": return "bg-status-green";
      default: return "bg-muted";
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case "red": return "glow-red";
      case "amber": return "glow-amber";
      case "green": return "glow-green";
      default: return "";
    }
  };

  return (
    <div className="h-full flex">
      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Topographical Wireframe Background */}
        <div className="absolute inset-0 topo-wireframe opacity-30" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay" />
        
        {/* Kenya Map Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative w-[80%] h-[80%] transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Map Outline */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full opacity-20"
              style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.3))" }}
            >
              <path 
                d="M30 15 L45 10 L60 15 L75 25 L80 40 L85 55 L80 70 L70 80 L55 85 L40 80 L25 70 L20 55 L25 40 L30 25 Z"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
              />
              {/* County Grid Lines */}
              <line x1="30" y1="15" x2="55" y2="85" stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
              <line x1="20" y1="55" x2="85" y2="55" stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
              <line x1="25" y1="40" x2="80" y2="40" stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
              <line x1="25" y1="70" x2="80" y2="70" stroke="hsl(var(--border))" strokeWidth="0.2" opacity="0.5" />
            </svg>

            {/* Project Markers */}
            {filteredMarkers.map((marker) => (
              <div
                key={marker.id}
                className="absolute cursor-pointer group"
                style={{ 
                  left: `${marker.lat}%`, 
                  top: `${marker.lng}%`,
                  transform: "translate(-50%, -50%)"
                }}
                onMouseEnter={() => setHoveredProject(marker)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => onSelectProject?.(marker)}
              >
                {/* Pulse Ring */}
                <div className={cn(
                  "absolute -inset-2 rounded-full opacity-30 animate-pulse",
                  getStatusColor(marker.status)
                )} />
                
                {/* Marker Dot */}
                <div className={cn(
                  "w-3 h-3 rounded-full relative z-10 transition-transform duration-200 group-hover:scale-150",
                  getStatusColor(marker.status),
                  getStatusGlow(marker.status)
                )} />

                {/* Hover Tooltip */}
                {hoveredProject?.id === marker.id && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 glass-panel p-3 min-w-[200px] animate-fade-in">
                    <p className="font-semibold text-sm mb-1">{marker.name}</p>
                    <p className="text-xs text-muted-foreground">{marker.county} • {marker.constituency}</p>
                    <div className="mt-2 pt-2 border-t border-border space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-mono">{marker.budget}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Risk Score</span>
                        <span className={cn(
                          "font-mono font-semibold",
                          marker.status === "red" ? "text-status-red" : 
                          marker.status === "amber" ? "text-status-amber" : "text-status-green"
                        )}>{marker.riskScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button 
            className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors"
            onClick={() => setZoomLevel(1)}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors">
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass-panel p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Traffic Light Classification
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-red glow-red" />
              <span className="text-sm">High Risk / Ghost Project ({filteredMarkers.filter(m => m.status === "red").length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-amber glow-amber" />
              <span className="text-sm">Stalled / Inconclusive ({filteredMarkers.filter(m => m.status === "amber").length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-green glow-green" />
              <span className="text-sm">Convergent / On Track ({filteredMarkers.filter(m => m.status === "green").length})</span>
            </div>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-4 right-4 glass-panel px-3 py-2">
          <span className="text-xs font-mono text-muted-foreground">
            Kenya • 1.2921°S, 36.8219°E • {filteredMarkers.length} Projects
          </span>
        </div>
      </div>

      {/* Filter Sidebar */}
      <div className="w-72 border-l border-border p-4 space-y-4 overflow-auto bg-background/50">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h3 className="section-header mb-0">Risk Triage Filters</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">County</label>
              <select 
                className="console-input w-full"
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
              >
                {counties.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Constituency</label>
              <select 
                className="console-input w-full"
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
              >
                {constituencies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Funding Source</label>
              <select 
                className="console-input w-full"
                value={selectedFunding}
                onChange={(e) => setSelectedFunding(e.target.value)}
              >
                {fundingSources.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Risk Level</label>
              <select 
                className="console-input w-full"
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
              >
                {riskLevels.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-panel p-4">
          <h3 className="section-header">Risk Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Projects</span>
              <span className="font-mono font-semibold">{filteredMarkers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Funds at Risk</span>
              <span className="font-mono font-semibold text-status-red">KES 8.85B</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ghost Projects</span>
              <span className="font-mono font-semibold text-status-red">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
