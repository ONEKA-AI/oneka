import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Search, Filter, Download, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const projects = [
  {
    id: "PRJ-2024-001",
    name: "Nairobi-Thika Highway Expansion Phase III",
    county: "Nairobi / Kiambu",
    sector: "Roads & Transport",
    contractSum: 4850000000,
    amountPaid: 3420000000,
    riskFlag: "red" as const,
    auditStatus: "Under Review",
    entity: "Kenya National Highways Authority",
  },
  {
    id: "PRJ-2024-002",
    name: "Kisumu Port Rehabilitation Project",
    county: "Kisumu",
    sector: "Transport",
    contractSum: 2100000000,
    amountPaid: 890000000,
    riskFlag: "amber" as const,
    auditStatus: "Pending Verification",
    entity: "Kenya Ports Authority",
  },
  {
    id: "PRJ-2024-003",
    name: "Mombasa Water Supply Phase II",
    county: "Mombasa",
    sector: "Water & Sanitation",
    contractSum: 1580000000,
    amountPaid: 1240000000,
    riskFlag: "green" as const,
    auditStatus: "Verified",
    entity: "Mombasa Water & Sewerage Co.",
  },
  {
    id: "PRJ-2024-004",
    name: "Eldoret Bypass Construction",
    county: "Uasin Gishu",
    sector: "Roads & Transport",
    contractSum: 6200000000,
    amountPaid: 1850000000,
    riskFlag: "red" as const,
    auditStatus: "Flagged - Lowball Tender",
    entity: "Kenya National Highways Authority",
  },
  {
    id: "PRJ-2024-005",
    name: "Garissa County Hospital Upgrade",
    county: "Garissa",
    sector: "Health",
    contractSum: 890000000,
    amountPaid: 445000000,
    riskFlag: "amber" as const,
    auditStatus: "Physical Verification Required",
    entity: "Ministry of Health",
  },
  {
    id: "PRJ-2024-006",
    name: "Machakos Technical Training Institute",
    county: "Machakos",
    sector: "Education",
    contractSum: 520000000,
    amountPaid: 468000000,
    riskFlag: "green" as const,
    auditStatus: "Verified",
    entity: "Ministry of Education",
  },
];

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `KES ${(value / 1000000000).toFixed(2)}B`;
  }
  return `KES ${(value / 1000000).toFixed(0)}M`;
}

export default function Projects() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects Registry</h1>
            <p className="text-sm text-muted-foreground mt-1">
              National Development Projects Under Audit Surveillance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
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
                placeholder="Search by project name, contract number, or implementing entity..."
                className="console-input pl-10 w-full"
              />
            </div>
            <select className="console-input min-w-[150px]">
              <option>All Counties</option>
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
            </select>
            <select className="console-input min-w-[150px]">
              <option>All Sectors</option>
              <option>Roads & Transport</option>
              <option>Health</option>
              <option>Education</option>
            </select>
            <select className="console-input min-w-[150px]">
              <option>All Risk Levels</option>
              <option>High Risk</option>
              <option>Medium Risk</option>
              <option>Low Risk</option>
            </select>
          </div>
        </div>

        {/* Projects Table */}
        <div className="glass-panel overflow-hidden">
          <table className="data-table">
            <thead>
              <tr className="bg-secondary/30">
                <th>Project ID</th>
                <th>Project Name</th>
                <th>County</th>
                <th>Sector</th>
                <th className="text-right">Contract Sum</th>
                <th className="text-right">Amount Paid</th>
                <th>Risk Flag</th>
                <th>Audit Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="group">
                  <td className="font-mono text-sm text-muted-foreground">{project.id}</td>
                  <td>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.entity}</p>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{project.county}</td>
                  <td className="text-muted-foreground">{project.sector}</td>
                  <td className="text-right font-mono">{formatCurrency(project.contractSum)}</td>
                  <td className="text-right font-mono">{formatCurrency(project.amountPaid)}</td>
                  <td>
                    <StatusBadge status={project.riskFlag} />
                  </td>
                  <td className="text-sm">{project.auditStatus}</td>
                  <td>
                    <Link
                      to={`/projects/${project.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-md hover:bg-accent"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">6</span> of <span className="font-medium">392</span> projects
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors text-sm">
                Previous
              </button>
              <button className="px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors text-sm">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Legal Reference */}
        <div className="text-xs text-muted-foreground">
          <span className="legal-ref">
            Data sourced from IFMIS, PIMIS, COB • Updated: 2024-01-26 14:00 EAT
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
