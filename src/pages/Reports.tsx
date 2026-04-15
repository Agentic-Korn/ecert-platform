import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, ClipboardCheck, AlertTriangle, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

export default function Reports() {
  const { t } = useTranslation();
  const { state } = useAppStore();

  const activeCerts = state.certificates.filter(c => c.status === "active").length;
  const pendingApprovals = state.approvals.filter(a => a.status === "pending").length;
  const expiringSoon = state.certificates.filter(c => {
    if (c.status !== "active" || !c.expiresAt) return false;
    const diff = (new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  }).length;
  const verifyCount = state.verifyLogs.length;

  // Certs by program
  const programCounts: Record<string, number> = {};
  state.certificates.filter(c => c.status === "active").forEach(c => {
    programCounts[c.programName] = (programCounts[c.programName] || 0) + 1;
  });
  const byProgram = Object.entries(programCounts).map(([name, count]) => ({ name: name.length > 20 ? name.substring(0, 20) + "…" : name, count }));

  // Certs by status
  const statusCounts: Record<string, number> = {};
  state.certificates.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  const byStatus = Object.entries(statusCounts).map(([status, count]) => ({ name: t(`common.${status}`), count }));

  const stats = [
    { title: t("dashboard.activeCertificates"), value: activeCerts, icon: BadgeCheck, color: "text-success" },
    { title: t("dashboard.pendingApproval"), value: pendingApprovals, icon: ClipboardCheck, color: "text-primary" },
    { title: t("dashboard.expiringSoon"), value: expiringSoon, icon: AlertTriangle, color: "text-warning" },
    { title: t("dashboard.verifyApiCalls"), value: verifyCount, icon: Search, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("nav.reports")}</h1>
        <p className="page-description">{t("dashboard.subtitle")}</p>
      </div>

      {/* Stat Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.title}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Certs by Program */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("certificates.program")}</CardTitle>
          </CardHeader>
          <CardContent>
            {byProgram.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byProgram}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">—</p>
            )}
          </CardContent>
        </Card>

        {/* Certs by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("certificates.status")}</CardTitle>
          </CardHeader>
          <CardContent>
            {byStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byStatus} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, count }) => `${name}: ${count}`}>
                    {byStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Verify Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t("certificates.verifyHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          {state.verifyLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("certificates.noVerifications")}</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("certificates.certNo")}</TableHead>
                    <TableHead>{t("auditLogs.timestamp")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...state.verifyLogs].reverse().slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.certNo}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(log.queriedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
