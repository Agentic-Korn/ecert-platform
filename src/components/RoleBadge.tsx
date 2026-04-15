import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Shield, ClipboardCheck, GraduationCap, User } from "lucide-react";
import type { UserRole } from "@/lib/types";

const roleConfig: Record<UserRole, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  admin:    { icon: Shield,         cls: "bg-primary text-primary-foreground" },
  approver: { icon: ClipboardCheck, cls: "bg-secondary text-secondary-foreground" },
  trainer:  { icon: GraduationCap,  cls: "bg-info text-info-foreground" },
  holder:   { icon: User,           cls: "bg-cert-gold text-cert-gold-foreground" },
};

export function RoleBadge() {
  const { t } = useTranslation();
  const { state } = useAppStore();
  const role = state.currentUser?.role;
  if (!role) return null;
  const cfg = roleConfig[role];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${cfg.cls}`}
      data-tour="role-badge"
      title={t(`roles.${role}`)}
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{t(`roles.${role}`)}</span>
    </span>
  );
}
