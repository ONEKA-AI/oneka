import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  AlertTriangle, 
  Clock, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  User,
  Building
} from "lucide-react";

const alerts = [
  {
    id: "ALT-2024-0892",
    type: "Burn Rate Mismatch",
    project: "Nairobi-Thika Highway Expansion Phase III",
    entity: "Kenya National Highways Authority",
    severity: "red" as const,
    description: "Financial progress (78%) significantly exceeds physical progress (48%). Gap of KES 1.08B unverified.",
    timestamp: "2024-01-26 14:22",
    status: "open",
    assignedTo: "OAG Audit Team Alpha",
  },
  {
    id: "ALT-2024-0891",
    type: "Lowball Tender",
    project: "Eldoret Bypass Construction",
    entity: "Kenya National Highways Authority",
    severity: "red" as const,
    description: "Contract awarded at 24% below engineer's estimate. Possible quality compromise risk.",
    timestamp: "2024-01-26 11:15",
    status: "under_review",
    assignedTo: "PPOA Review Panel",
  },
  {
    id: "ALT-2024-0890",
    type: "Disbursement Delay",
    project: "Kisumu Port Rehabilitation Project",
    entity: "Kenya Ports Authority",
    severity: "amber" as const,
    description: "No disbursement in 90 days despite pending invoices. Contractor cash flow impact.",
    timestamp: "2024-01-26 13:45",
    status: "open",
    assignedTo: null,
  },
  {
    id: "ALT-2024-0889",
    type: "Stalled Project",
    project: "Garissa County Hospital Upgrade",
    entity: "Ministry of Health",
    severity: "amber" as const,
    description: "Physical progress unchanged for 120 days. Site activity not detected via satellite.",
    timestamp: "2024-01-25 16:30",
    status: "escalated",
    assignedTo: "County Audit Task Force",
  },
  {
    id: "ALT-2024-0888",
    type: "Progress Verified",
    project: "Mombasa Water Supply Phase II",
    entity: "Mombasa Water & Sewerage Co.",
    severity: "green" as const,
    description: "Physical progress matches financial disbursement within 5% tolerance.",
    timestamp: "2024-01-26 12:30",
    status: "resolved",
    assignedTo: null,
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "text-status-amber" },
  under_review: { label: "Under Review", color: "text-chart-1" },
  escalated: { label: "Escalated", color: "text-status-red" },
  resolved: { label: "Resolved", color: "text-status-green" },
};

export default function Alerts() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Audit Flags</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Risk Indicators and Anomaly Notifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-status-red" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">High Risk</span>
            </div>
            <p className="text-2xl font-bold font-mono">23</p>
          </div>
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-status-amber" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Review</span>
            </div>
            <p className="text-2xl font-bold font-mono">48</p>
          </div>
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-chart-1" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assigned</span>
            </div>
            <p className="text-2xl font-bold font-mono">31</p>
          </div>
          <div className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-status-green" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolved Today</span>
            </div>
            <p className="text-2xl font-bold font-mono">12</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className="glass-panel p-5 hover:bg-accent/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Severity Indicator */}
                <div className={`w-1 h-full min-h-[80px] rounded-full ${
                  alert.severity === 'red' ? 'bg-status-red' :
                  alert.severity === 'amber' ? 'bg-status-amber' : 'bg-status-green'
                }`} />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-muted-foreground">{alert.id}</span>
                        <StatusBadge status={alert.severity} label={alert.type} />
                        <span className={`text-xs font-medium ${statusLabels[alert.status].color}`}>
                          {statusLabels[alert.status].label}
                        </span>
                      </div>
                      <h3 className="font-medium">{alert.project}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Building className="w-3 h-3" />
                        {alert.entity}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>

                  <div className="flex items-center justify-between">
                    {alert.assignedTo ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>Assigned to: <span className="text-foreground">{alert.assignedTo}</span></span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {alert.status !== 'resolved' && (
                        <>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-border hover:bg-accent transition-colors">
                            <XCircle className="w-3 h-3" />
                            Dismiss
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-accent hover:bg-accent/80 transition-colors">
                            Review
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {alert.status === 'resolved' && (
                        <span className="flex items-center gap-1.5 text-xs text-status-green">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified & Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Reference */}
        <div className="text-xs text-muted-foreground">
          <span className="legal-ref">
            Audit flags generated per Risk-Based Auditing (RBA) methodology • PFM Act 2012
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
