import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Radar, 
  Eye, 
  Scale, 
  Activity, 
  Database, 
  Satellite, 
  FileSearch, 
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";

const agents = [
  {
    id: "scout",
    name: "Scout Agent",
    role: "Data Ingestion & Collection",
    description: "Aggregates and normalizes data from IFMIS, PIMIS, COB, and PPOA registries. Monitors for new contracts, disbursements, and procurement records.",
    status: "active",
    lastAction: "Ingested 247 new IFMIS records",
    lastActionTime: "2 minutes ago",
    icon: Radar,
    color: "chart-1",
    tools: [
      { name: "IFMIS Connector", status: "active" },
      { name: "PIMIS API", status: "active" },
      { name: "COB Data Feed", status: "active" },
      { name: "PPOA Registry Scraper", status: "active" },
    ],
    metrics: {
      recordsProcessed: "1.2M",
      avgLatency: "340ms",
      uptime: "99.8%",
    },
  },
  {
    id: "visionary",
    name: "Visionary Agent",
    role: "Satellite Analysis & Physical Verification",
    description: "Analyzes satellite imagery to detect construction progress, site activity, and physical infrastructure changes. Generates before/after comparisons.",
    status: "active",
    lastAction: "Analyzed imagery for Eldoret Bypass",
    lastActionTime: "8 minutes ago",
    icon: Eye,
    color: "chart-2",
    tools: [
      { name: "Sentinel-2 Imagery", status: "active" },
      { name: "Change Detection ML", status: "active" },
      { name: "Object Recognition", status: "active" },
      { name: "Progress Estimation", status: "active" },
    ],
    metrics: {
      sitesMonitored: "392",
      imagesProcessed: "12.4K",
      accuracy: "94.2%",
    },
  },
  {
    id: "auditor",
    name: "Auditor Agent",
    role: "Fraud Detection & Risk Scoring",
    description: "Correlates financial data with physical progress. Detects anomalies, flags discrepancies, and generates risk scores based on RBA methodology.",
    status: "active",
    lastAction: "Flagged burn rate mismatch on PRJ-2024-001",
    lastActionTime: "14 minutes ago",
    icon: Scale,
    color: "chart-3",
    tools: [
      { name: "Anomaly Detection", status: "active" },
      { name: "Risk Scoring Engine", status: "active" },
      { name: "Pattern Matching", status: "active" },
      { name: "Evidence Generator", status: "active" },
    ],
    metrics: {
      projectsAudited: "392",
      flagsRaised: "181",
      confidence: "87.4%",
    },
  },
];

const dataFlow = [
  { from: "IFMIS / PIMIS / COB", to: "Scout Agent", type: "Financial Data" },
  { from: "Scout Agent", to: "Auditor Agent", type: "Normalized Records" },
  { from: "Satellite APIs", to: "Visionary Agent", type: "Imagery" },
  { from: "Visionary Agent", to: "Auditor Agent", type: "Physical Progress %" },
  { from: "Auditor Agent", to: "Dashboard", type: "Risk Flags & Scores" },
];

export default function Agents() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Autonomous Intelligence Workforce for Audit Operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-status-green-muted border border-status-green/30">
              <Activity className="w-4 h-4 text-status-green" />
              <span className="text-sm font-medium text-status-green">All Agents Operational</span>
            </div>
          </div>
        </div>

        {/* Data Flow Visualization */}
        <div className="glass-panel p-6">
          <h3 className="section-header mb-6">Data Flow Architecture</h3>
          
          <div className="relative">
            {/* Flow Diagram */}
            <div className="flex items-center justify-between gap-4">
              {/* Data Sources */}
              <div className="flex flex-col gap-2 w-40">
                <div className="p-3 bg-secondary/50 rounded-md text-center">
                  <Database className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">IFMIS</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-md text-center">
                  <Database className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">PIMIS / COB</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-md text-center">
                  <Satellite className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">Satellite API</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Raw Data</span>
              </div>

              {/* Scout & Visionary */}
              <div className="flex flex-col gap-2 w-44">
                <div className="p-4 rounded-lg border-2 border-chart-1/50 bg-chart-1/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Radar className="w-4 h-4 text-chart-1" />
                    <p className="text-sm font-semibold">Scout</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Data Ingestion</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-chart-2/50 bg-chart-2/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-chart-2" />
                    <p className="text-sm font-semibold">Visionary</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Satellite Analysis</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Processed</span>
              </div>

              {/* Auditor */}
              <div className="w-44">
                <div className="p-4 rounded-lg border-2 border-chart-3/50 bg-chart-3/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale className="w-4 h-4 text-chart-3" />
                    <p className="text-sm font-semibold">Auditor</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Fraud Detection</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Flags</span>
              </div>

              {/* Output */}
              <div className="flex flex-col gap-2 w-40">
                <div className="p-3 bg-secondary/50 rounded-md text-center">
                  <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-status-red" />
                  <p className="text-xs font-medium">Risk Alerts</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-md text-center">
                  <FileSearch className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs font-medium">Evidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <div key={agent.id} className="glass-panel p-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${agent.color}/20 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${agent.color}`} />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-green-muted">
                    <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                    <span className="text-xs font-medium text-status-green">Active</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{agent.role}</p>
                <p className="text-sm text-muted-foreground/80 mb-6">{agent.description}</p>

                {/* Last Action */}
                <div className="p-3 bg-secondary/50 rounded-md mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-status-amber" />
                    <span className="text-xs font-medium">Last Action</span>
                  </div>
                  <p className="text-sm">{agent.lastAction}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {agent.lastActionTime}
                  </div>
                </div>

                {/* Tools */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Tools</h4>
                  <div className="space-y-2">
                    {agent.tools.map((tool) => (
                      <div key={tool.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{tool.name}</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-status-green" />
                          <span className="text-xs text-status-green">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Metrics</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(agent.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-lg font-bold font-mono">{value}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Log */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-header mb-0">Recent Agent Activity</h3>
            <button className="text-xs text-sidebar-primary hover:underline">View Full Log</button>
          </div>

          <div className="space-y-3">
            {[
              { agent: "Scout", action: "Ingested 247 new IFMIS disbursement records", time: "14:32" },
              { agent: "Visionary", action: "Completed satellite analysis for Eldoret Bypass (PRJ-2024-004)", time: "14:28" },
              { agent: "Auditor", action: "Raised HIGH RISK flag: Burn rate mismatch on Nairobi-Thika Highway", time: "14:22" },
              { agent: "Scout", action: "Synced 89 COB approval records for Q3", time: "14:15" },
              { agent: "Visionary", action: "Detected 12% physical progress on Garissa Hospital (stalled)", time: "14:08" },
              { agent: "Auditor", action: "Generated Section 106B certificate for Mombasa Water Phase II", time: "13:55" },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-md">
                <span className="text-xs font-mono text-muted-foreground w-12">{log.time}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  log.agent === 'Scout' ? 'bg-chart-1/20 text-chart-1' :
                  log.agent === 'Visionary' ? 'bg-chart-2/20 text-chart-2' :
                  'bg-chart-3/20 text-chart-3'
                }`}>
                  {log.agent}
                </span>
                <span className="text-sm flex-1">{log.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Reference */}
        <div className="text-xs text-muted-foreground">
          <span className="legal-ref">
            AI agents operate under Risk-Based Auditing (RBA) methodology • PFM Act 2012, Section 68
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
