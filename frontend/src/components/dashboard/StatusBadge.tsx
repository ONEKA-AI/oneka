import { cn } from "@/lib/utils";

type StatusType = "green" | "amber" | "red";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusLabels: Record<StatusType, string> = {
  green: "VERIFIED",
  amber: "REVIEW",
  red: "HIGH RISK",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        `status-${status}`,
        className
      )}
    >
      {label || statusLabels[status]}
    </span>
  );
}
