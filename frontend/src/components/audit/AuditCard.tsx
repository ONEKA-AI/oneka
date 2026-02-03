import { useState } from "react";
import { MapPin, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditCardData {
  id: string;
  projectName: string;
  treasuryId: string;
  county: string;
  constituency: string;
  status: "red" | "amber" | "green";
  financialProgress: number;
  physicalProgress: number;
  budgetAllocated: string;
  amountDisbursed: string;
  amountVerified: string;
  contractor: string;
  riskScore: number;
  anomalyArea?: { x: number; y: number; width: number; height: number };
}

interface AuditCardProps {
  data: AuditCardData;
  onViewDetails?: () => void;
}

export function AuditCard({ data, onViewDetails }: AuditCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setScanProgress(0);
    
    // Animate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setScanProgress(0);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "red": return "HIGH RISK";
      case "amber": return "REVIEW";
      case "green": return "VERIFIED";
      default: return "UNKNOWN";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "red": return <AlertTriangle className="w-4 h-4" />;
      case "amber": return <Eye className="w-4 h-4" />;
      case "green": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const progressDelta = data.financialProgress - data.physicalProgress;

  return (
    <div className="glass-panel overflow-hidden group">
      {/* Header Strip */}
      <div className={cn(
        "h-1",
        data.status === "red" ? "bg-status-red" :
        data.status === "amber" ? "bg-status-amber" : "bg-status-green"
      )} />

      <div className="p-4">
        {/* Top Row: Project Info + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-base leading-tight mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.projectName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{data.county} • {data.constituency}</span>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold",
            `status-${data.status}`
          )}>
            {getStatusIcon(data.status)}
            {getStatusLabel(data.status)}
          </div>
        </div>

        {/* Treasury ID */}
        <div className="mb-4 p-2 bg-secondary/50 rounded border border-border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Treasury ID</span>
          <p className="font-mono text-sm font-medium mt-0.5">{data.treasuryId}</p>
        </div>

        {/* Split View: Financial vs Satellite */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Financial Panel */}
          <div className="p-3 bg-secondary/30 rounded border border-border">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Financial Data
            </h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Financial Progress</span>
                  <span className="font-mono font-semibold">{data.financialProgress}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-chart-1 transition-all duration-500"
                    style={{ width: `${data.financialProgress}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allocated</span>
                  <span className="font-mono">{data.budgetAllocated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disbursed</span>
                  <span className="font-mono">{data.amountDisbursed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <span className={cn(
                    "font-mono font-semibold",
                    data.status === "red" ? "text-status-red" : ""
                  )}>{data.amountVerified}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Satellite Panel */}
          <div 
            className="p-3 bg-secondary/30 rounded border border-border relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Satellite Visual
            </h4>
            
            {/* Satellite Thumbnail Placeholder */}
            <div className="aspect-video bg-secondary/50 rounded relative overflow-hidden">
              {/* Fake satellite imagery pattern */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
                    linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
                    linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)
                  `,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
                }} />
              </div>

              {/* Grid Overlay on Hover */}
              {isHovering && (
                <>
                  {/* Scanning Grid */}
                  <div className="absolute inset-0 grid-overlay opacity-60" />
                  
                  {/* Radar Sweep */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      background: `conic-gradient(
                        from ${scanProgress * 3.6}deg,
                        transparent 0deg,
                        hsl(var(--status-${data.status}) / 0.3) 30deg,
                        transparent 60deg
                      )`
                    }}
                  />

                  {/* Scan Line */}
                  <div 
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-100"
                    style={{ top: `${scanProgress}%` }}
                  />

                  {/* Anomaly Highlight */}
                  {data.anomalyArea && scanProgress > 50 && (
                    <div 
                      className={cn(
                        "absolute border-2 rounded animate-pulse",
                        data.status === "red" ? "border-status-red" : 
                        data.status === "amber" ? "border-status-amber" : "border-status-green"
                      )}
                      style={{
                        left: `${data.anomalyArea.x}%`,
                        top: `${data.anomalyArea.y}%`,
                        width: `${data.anomalyArea.width}%`,
                        height: `${data.anomalyArea.height}%`
                      }}
                    />
                  )}

                  {/* Analysis Status */}
                  <div className="absolute bottom-1 left-1 right-1 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        scanProgress < 100 ? "bg-status-amber" : `bg-status-${data.status}`
                      )} />
                      <span className="text-[10px] font-mono uppercase">
                        {scanProgress < 100 ? `Scanning... ${scanProgress}%` : "Analysis Complete"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Physical Progress Indicator */}
              <div className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm rounded px-2 py-0.5">
                <span className="text-[10px] font-mono">Physical: {data.physicalProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Comparison */}
        <div className="p-3 bg-secondary/20 rounded border border-border mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress Delta (Financial vs Physical)</span>
            <div className={cn(
              "flex items-center gap-1 text-xs font-mono font-semibold",
              progressDelta > 20 ? "text-status-red" : 
              progressDelta > 10 ? "text-status-amber" : "text-status-green"
            )}>
              {progressDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {progressDelta > 0 ? "+" : ""}{progressDelta}%
            </div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
            <div 
              className="absolute h-full bg-chart-1 opacity-50"
              style={{ width: `${data.financialProgress}%` }}
            />
            <div 
              className="absolute h-full bg-status-green"
              style={{ width: `${data.physicalProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
            <span>Financial: {data.financialProgress}%</span>
            <span>Physical: {data.physicalProgress}%</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-xs">
            <span className="text-muted-foreground">Contractor: </span>
            <span className="font-medium">{data.contractor}</span>
          </div>
          <button 
            onClick={onViewDetails}
            className="px-3 py-1.5 rounded text-xs font-medium bg-accent hover:bg-accent/80 transition-colors"
          >
            View Full Docket
          </button>
        </div>
      </div>
    </div>
  );
}

// Export sample data for demo
export const sampleAuditCards: AuditCardData[] = [
  {
    id: "1",
    projectName: "Nairobi-Thika Highway Expansion Phase III",
    treasuryId: "TRY/2024/NAI/INF/00847",
    county: "Nairobi",
    constituency: "Kasarani",
    status: "red",
    financialProgress: 78,
    physicalProgress: 34,
    budgetAllocated: "KES 4.85B",
    amountDisbursed: "KES 3.78B",
    amountVerified: "KES 1.65B",
    contractor: "Sino Hydro Corporation",
    riskScore: 87,
    anomalyArea: { x: 30, y: 40, width: 40, height: 35 }
  },
  {
    id: "2",
    projectName: "Kisumu Port Rehabilitation Works",
    treasuryId: "TRY/2024/KSM/PRT/00234",
    county: "Kisumu",
    constituency: "Kisumu Central",
    status: "amber",
    financialProgress: 62,
    physicalProgress: 48,
    budgetAllocated: "KES 2.1B",
    amountDisbursed: "KES 1.3B",
    amountVerified: "KES 1.0B",
    contractor: "China Road & Bridge Corp",
    riskScore: 54,
    anomalyArea: { x: 50, y: 20, width: 30, height: 40 }
  },
  {
    id: "3",
    projectName: "Mombasa Water Supply Phase II",
    treasuryId: "TRY/2024/MBA/WTR/00156",
    county: "Mombasa",
    constituency: "Mvita",
    status: "green",
    financialProgress: 45,
    physicalProgress: 42,
    budgetAllocated: "KES 890M",
    amountDisbursed: "KES 401M",
    amountVerified: "KES 378M",
    contractor: "Davis & Shirtliff Ltd",
    riskScore: 12,
    anomalyArea: { x: 20, y: 60, width: 25, height: 20 }
  }
];
