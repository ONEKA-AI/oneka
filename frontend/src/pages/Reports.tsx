import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Shield,
  Clock,
  CheckCircle2,
  Stamp
} from "lucide-react";

const reports = [
  {
    id: "RPT-2024-0156",
    name: "Section 106B Evidence Certificate",
    project: "Nairobi-Thika Highway Expansion Phase III",
    type: "Evidence Certificate",
    riskVerdict: "red" as const,
    generatedAt: "2024-01-26 14:35",
    generatedBy: "System",
    status: "Final",
    version: "1.0",
  },
  {
    id: "RPT-2024-0155",
    name: "Quarterly Audit Summary Report",
    project: "All Projects - Q3 FY2023/24",
    type: "Summary Report",
    riskVerdict: "amber" as const,
    generatedAt: "2024-01-25 09:00",
    generatedBy: "OAG Analyst",
    status: "Final",
    version: "2.1",
  },
  {
    id: "RPT-2024-0154",
    name: "Section 106B Evidence Certificate",
    project: "Eldoret Bypass Construction",
    type: "Evidence Certificate",
    riskVerdict: "red" as const,
    generatedAt: "2024-01-24 16:22",
    generatedBy: "System",
    status: "Final",
    version: "1.0",
  },
  {
    id: "RPT-2024-0153",
    name: "Physical Verification Report",
    project: "Mombasa Water Supply Phase II",
    type: "Verification Report",
    riskVerdict: "green" as const,
    generatedAt: "2024-01-24 11:15",
    generatedBy: "Field Team",
    status: "Final",
    version: "1.0",
  },
  {
    id: "RPT-2024-0152",
    name: "Sector Risk Analysis",
    project: "Roads & Transport Sector",
    type: "Analysis Report",
    riskVerdict: "amber" as const,
    generatedAt: "2024-01-23 14:00",
    generatedBy: "AI Analysis",
    status: "Draft",
    version: "0.9",
  },
];

export default function Reports() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Evidence</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Audit Reports, Certificates, and Official Documentation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-sidebar-primary hover:bg-sidebar-primary/90 transition-colors text-sm text-sidebar-primary-foreground">
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-panel p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports by name, project, or ID..."
                className="console-input pl-10 w-full"
              />
            </div>
            <select className="console-input min-w-[180px]">
              <option>All Report Types</option>
              <option>Evidence Certificate</option>
              <option>Summary Report</option>
              <option>Verification Report</option>
              <option>Analysis Report</option>
            </select>
            <select className="console-input min-w-[150px]">
              <option>All Statuses</option>
              <option>Final</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div 
              key={report.id}
              className="glass-panel p-5 hover:bg-accent/30 transition-colors cursor-pointer group"
            >
              {/* Document Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  {report.status === "Final" && (
                    <span className="flex items-center gap-1 text-xs text-status-green">
                      <Stamp className="w-3 h-3" />
                      Final
                    </span>
                  )}
                  {report.status === "Draft" && (
                    <span className="text-xs text-status-amber">Draft</span>
                  )}
                </div>
              </div>

              {/* Report Info */}
              <div className="space-y-2 mb-4">
                <p className="font-mono text-xs text-muted-foreground">{report.id}</p>
                <h3 className="font-medium leading-tight">{report.name}</h3>
                <p className="text-sm text-muted-foreground">{report.project}</p>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-xs border-t border-border pt-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Verdict</span>
                  <StatusBadge status={report.riskVerdict} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">{report.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Generated</span>
                  <span className="font-mono">{report.generatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">By</span>
                  <span>{report.generatedBy}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Vault Section */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Evidence Vault</h2>
              <p className="text-sm text-muted-foreground">Secure storage for Section 106B certificates and audit evidence</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Certificates</p>
              <p className="text-2xl font-bold font-mono">156</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold font-mono">24</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Pending Signature</p>
              <p className="text-2xl font-bold font-mono">8</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-status-green-muted rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-status-green" />
              <div>
                <p className="font-medium text-sm">Blockchain Verification Active</p>
                <p className="text-xs text-muted-foreground">All certificates are cryptographically signed and verified</p>
              </div>
            </div>
            <button className="text-xs text-sidebar-primary hover:underline">
              View Verification Log
            </button>
          </div>
        </div>

        {/* Legal Reference */}
        <div className="text-xs text-muted-foreground">
          <span className="legal-ref">
            Reports generated per Public Audit Act 2015, Section 106B • PFM Act 2012
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
