import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Server, 
  Database, 
  Activity, 
  Bell, 
  Shield, 
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const dataSources = [
  { name: "IFMIS", status: "connected", lastSync: "2024-01-26 14:00" },
  { name: "PIMIS", status: "connected", lastSync: "2024-01-26 13:45" },
  { name: "Controller of Budget", status: "connected", lastSync: "2024-01-26 12:30" },
  { name: "PPOA Registry", status: "connected", lastSync: "2024-01-26 11:15" },
  { name: "Satellite Imagery API", status: "connected", lastSync: "2024-01-26 14:20" },
];

const auditThresholds = [
  { name: "Financial-Physical Gap Alert", value: "20%", description: "Trigger alert when gap exceeds this threshold" },
  { name: "Burn Rate Warning", value: "150%", description: "Alert when burn rate exceeds expected rate" },
  { name: "Inactivity Period", value: "90 days", description: "Flag projects with no progress for this duration" },
  { name: "Tender Variance", value: "25%", description: "Alert when contract award varies from estimate" },
];

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Control</h1>
          <p className="text-sm text-muted-foreground mt-1">
            System Configuration and Audit Parameters
          </p>
        </div>

        {/* System Status */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-status-green-muted flex items-center justify-center">
              <Activity className="w-5 h-5 text-status-green" />
            </div>
            <div>
              <h2 className="font-semibold">System Status</h2>
              <p className="text-sm text-status-green">All systems operational</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Uptime</p>
              <p className="text-lg font-bold font-mono">99.97%</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">API Latency</p>
              <p className="text-lg font-bold font-mono">124ms</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Data Freshness</p>
              <p className="text-lg font-bold font-mono">&lt;1hr</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">AI Model</p>
              <p className="text-lg font-bold font-mono">v2.4.1</p>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Database className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">Data Sources</h2>
                <p className="text-sm text-muted-foreground">Connected government systems and APIs</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
              <RefreshCw className="w-4 h-4" />
              Sync All
            </button>
          </div>

          <div className="space-y-3">
            {dataSources.map((source) => (
              <div 
                key={source.name}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-status-green" />
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-xs text-muted-foreground">Last sync: {source.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-status-green font-medium">Connected</span>
                  <button className="p-2 rounded-md hover:bg-accent transition-colors">
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Thresholds */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Sliders className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Audit Thresholds</h2>
              <p className="text-sm text-muted-foreground">Risk detection parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            {auditThresholds.map((threshold) => (
              <div 
                key={threshold.name}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{threshold.name}</p>
                  <p className="text-xs text-muted-foreground">{threshold.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium">{threshold.value}</span>
                  <button className="text-xs text-sidebar-primary hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Notification Rules</h2>
              <p className="text-sm text-muted-foreground">Alert distribution settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium">High-Risk Alerts</p>
                <p className="text-xs text-muted-foreground">Email + SMS to OAG leadership</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-status-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-xs text-muted-foreground">Email digest at 08:00 EAT</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-status-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div>
                <p className="font-medium">Weekly Report</p>
                <p className="text-xs text-muted-foreground">Automated PDF report generation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-status-green after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-semibold">Security & Compliance</h2>
              <p className="text-sm text-muted-foreground">Access control and audit trail</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-status-green-muted rounded-lg border border-status-green/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-status-green" />
                <span className="text-sm font-medium text-status-green">Data Encryption</span>
              </div>
              <p className="text-xs text-muted-foreground">AES-256 encryption at rest and in transit</p>
            </div>
            <div className="p-4 bg-status-green-muted rounded-lg border border-status-green/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-status-green" />
                <span className="text-sm font-medium text-status-green">Audit Logging</span>
              </div>
              <p className="text-xs text-muted-foreground">All actions logged with timestamps</p>
            </div>
            <div className="p-4 bg-status-green-muted rounded-lg border border-status-green/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-status-green" />
                <span className="text-sm font-medium text-status-green">Role-Based Access</span>
              </div>
              <p className="text-xs text-muted-foreground">Granular permissions per user role</p>
            </div>
            <div className="p-4 bg-status-green-muted rounded-lg border border-status-green/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-status-green" />
                <span className="text-sm font-medium text-status-green">Data Retention</span>
              </div>
              <p className="text-xs text-muted-foreground">7-year retention per statutory requirements</p>
            </div>
          </div>
        </div>

        {/* Legal Reference */}
        <div className="text-xs text-muted-foreground">
          <span className="legal-ref">
            System configuration compliant with Data Protection Act 2019 • Computer Misuse and Cybercrimes Act 2018
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
