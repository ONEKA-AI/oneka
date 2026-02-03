import { AlertTriangle, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

const flags = [
  {
    id: 1,
    project: "Nairobi-Thika Highway Expansion",
    type: "Burn Rate Mismatch",
    status: "red" as const,
    timestamp: "2024-01-26 14:22",
    county: "Nairobi",
  },
  {
    id: 2,
    project: "Kisumu Port Rehabilitation",
    type: "Disbursement Delay",
    status: "amber" as const,
    timestamp: "2024-01-26 13:45",
    county: "Kisumu",
  },
  {
    id: 3,
    project: "Mombasa Water Supply Phase II",
    type: "Progress Verified",
    status: "green" as const,
    timestamp: "2024-01-26 12:30",
    county: "Mombasa",
  },
  {
    id: 4,
    project: "Eldoret Bypass Construction",
    type: "Lowball Tender",
    status: "red" as const,
    timestamp: "2024-01-26 11:15",
    county: "Uasin Gishu",
  },
];

export function RecentAuditFlags() {
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          <h3 className="section-header mb-0">Recent Audit Flags</h3>
        </div>
        <button className="text-xs text-sidebar-primary hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className="p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{flag.project}</p>
                <p className="text-xs text-muted-foreground">{flag.county} County</p>
              </div>
              <StatusBadge status={flag.status} label={flag.type} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="font-mono">{flag.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
