import { AppLayout } from "@/components/layout/AppLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentAuditFlags } from "@/components/dashboard/RecentAuditFlags";
import { AuditProgressChart } from "@/components/dashboard/AuditProgressChart";
import { SectorBreakdown } from "@/components/dashboard/SectorBreakdown";
import { RiskSummary } from "@/components/dashboard/RiskSummary";
import { FolderOpen, AlertTriangle, Wallet, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">National Audit Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Public Financial Management Intelligence Dashboard
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Reporting Period</p>
            <p className="text-sm font-mono font-medium">FY 2023/24 • Q3</p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Projects Monitored"
            value="392"
            subValue="+24 this quarter"
            trend="up"
            icon={<FolderOpen className="w-4 h-4 text-muted-foreground" />}
          />
          <KPICard
            label="High-Risk Projects"
            value="47"
            subValue="12% of portfolio"
            trend="neutral"
            icon={<AlertTriangle className="w-4 h-4 text-status-red" />}
          />
          <KPICard
            label="Funds Disbursed"
            value="KES 52.8B"
            subValue="Against KES 78.4B budgeted"
            icon={<Wallet className="w-4 h-4 text-muted-foreground" />}
          />
          <KPICard
            label="Verified Progress"
            value="KES 44.2B"
            subValue="83.7% verification rate"
            trend="up"
            icon={<TrendingUp className="w-4 h-4 text-status-green" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <AuditProgressChart />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectorBreakdown />
              <RiskSummary />
            </div>
          </div>

          {/* Right Column - Alerts */}
          <div className="space-y-6">
            <RecentAuditFlags />
            
            {/* Legal Framework Reference */}
            <div className="glass-panel p-5">
              <h3 className="section-header">Legal Framework</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">PFM Act 2012</p>
                  <p className="text-xs text-muted-foreground">Section 68 — Responsibility of Accounting Officers</p>
                </div>
                <div>
                  <p className="font-medium">PPADA 2015</p>
                  <p className="text-xs text-muted-foreground">Part IX — Procurement Review and Audit</p>
                </div>
                <div>
                  <p className="font-medium">Constitution of Kenya</p>
                  <p className="text-xs text-muted-foreground">Article 229 — Functions of the Auditor-General</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
