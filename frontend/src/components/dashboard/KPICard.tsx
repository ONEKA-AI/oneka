import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function KPICard({ label, value, subValue, icon, trend, className }: KPICardProps) {
  return (
    <div className={cn("kpi-card animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="kpi-label">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-value">{value}</div>
      {subValue && (
        <div className="mt-2 text-sm text-muted-foreground">
          {trend === "up" && <span className="text-status-green">↑ </span>}
          {trend === "down" && <span className="text-status-red">↓ </span>}
          {subValue}
        </div>
      )}
    </div>
  );
}
