import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "active" | "pending" | "expired" | "revoked" | "draft" | "approved" | "rejected" | "extended" | "completed" | "open" | "closed";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning border-warning/30" },
  expired: { label: "Expired", className: "bg-destructive/15 text-destructive border-destructive/30" },
  revoked: { label: "Revoked", className: "bg-destructive/15 text-destructive border-destructive/30" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  approved: { label: "Approved", className: "bg-success/15 text-success border-success/30" },
  rejected: { label: "Rejected", className: "bg-destructive/15 text-destructive border-destructive/30" },
  extended: { label: "Extended", className: "bg-info/15 text-info border-info/30" },
  completed: { label: "Completed", className: "bg-success/15 text-success border-success/30" },
  open: { label: "Open", className: "bg-info/15 text-info border-info/30" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground border-border" },
};

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className, className)}>
      {config.label}
    </Badge>
  );
}
