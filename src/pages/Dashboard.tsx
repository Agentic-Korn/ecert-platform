import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Award, BadgeCheck, ClipboardCheck, AlertTriangle, Users, Calendar, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state } = useAppStore();

  const activeCerts = state.certificates.filter(c => c.status === "active").length;
  const pendingApprovals = state.approvals.filter(a => a.status === "pending");
  const expiringSoon = state.certificates.filter(c => {
    if (c.status !== "active" || !c.expiresAt) return false;
    const diff = (new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  }).length;
  const todayVerifies = state.verifyLogs.filter(l => {
    const today = new Date().toISOString().split("T")[0];
    return l.queriedAt.startsWith(today);
  }).length;

  const recentCerts = [...state.certificates].reverse().slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("dashboard.title")}</h1>
        <p className="page-description">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="cursor-pointer" onClick={() => navigate("/certificates")}>
          <StatCard title={t("dashboard.activeCertificates")} value={activeCerts} icon={BadgeCheck} trend={`+12% ${t("dashboard.fromLastMonth")}`} trendUp />
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/approvals")}>
          <StatCard title={t("dashboard.pendingApproval")} value={pendingApprovals.length} icon={ClipboardCheck} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/certificates")}>
          <StatCard title={t("dashboard.expiringSoon")} value={expiringSoon} icon={AlertTriangle} trend={expiringSoon > 0 ? t("dashboard.requiresAction") : undefined} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/logs")}>
          <StatCard title={t("dashboard.verifyApiCalls")} value={todayVerifies} icon={ShieldCheck} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">{t("dashboard.pendingApprovals")}</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/approvals")}>{t("common.viewAll")}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => navigate("/approvals")}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.holderName}</p>
                    <p className="text-xs text-muted-foreground">{item.programName} · {item.certNo}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <StatusBadge status="pending" />
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">{t("approvals.noItems")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">{t("dashboard.recentCertificates")}</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/certificates")}>{t("common.viewAll")}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCerts.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => navigate("/certificates")}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{cert.holderName}</p>
                    <p className="text-xs text-muted-foreground">{cert.certNo}</p>
                  </div>
                  <StatusBadge status={cert.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="cursor-pointer" onClick={() => navigate("/programs")}>
          <StatCard title={t("dashboard.programs")} value={state.programs.length} icon={Award} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/users")}>
          <StatCard title={t("dashboard.registeredUsers")} value={state.users.length} icon={Users} />
        </div>
        <div className="cursor-pointer" onClick={() => navigate("/events")}>
          <StatCard title={t("dashboard.upcomingEvents")} value={3} icon={Calendar} />
        </div>
      </div>
    </div>
  );
}
