import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Map,
  AlertTriangle,
  FileText,
  Settings,
  Shield,
  Activity,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Projects Registry", href: "/projects", icon: FolderOpen },
  { name: "Audit Workbench", href: "/workbench", icon: Activity },
  { name: "AI Agents", href: "/agents", icon: Bot },
  { name: "Geographic Coverage", href: "/map", icon: Map },
  { name: "Audit Flags", href: "/alerts", icon: AlertTriangle },
  { name: "Reports & Evidence", href: "/reports", icon: FileText },
  { name: "System Control", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">ONEKA AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Audit Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-panel p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-status-green" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              System Status
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Sync</span>
              <span className="text-status-green font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Update</span>
              <span className="font-mono text-foreground">14:32 EAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <div className="p-4 text-[10px] text-muted-foreground space-y-1">
        <p className="uppercase tracking-wider">Office of the Auditor-General</p>
        <p className="legal-ref">PFM Act 2012 • PPADA 2015</p>
      </div>
    </aside>
  );
}
