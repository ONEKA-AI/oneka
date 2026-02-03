import { cn } from "@/lib/utils";

const riskData = [
  { level: "High Risk", count: 47, color: "red", percentage: 12 },
  { level: "Medium Risk", count: 134, color: "amber", percentage: 34 },
  { level: "Low Risk / Verified", count: 211, color: "green", percentage: 54 },
];

export function RiskSummary() {
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <h3 className="section-header">Risk Distribution</h3>

      <div className="space-y-4">
        {riskData.map((item) => (
          <div key={item.level}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{item.level}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">{item.count}</span>
                <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  item.color === "green" && "bg-status-green",
                  item.color === "amber" && "bg-status-amber",
                  item.color === "red" && "bg-status-red"
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Projects</span>
          <span className="font-mono font-medium">392</span>
        </div>
      </div>
    </div>
  );
}
