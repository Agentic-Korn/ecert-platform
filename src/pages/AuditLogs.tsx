import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AuditLogs() {
  const { t } = useTranslation();
  const { state } = useAppStore();
  const [search, setSearch] = useState("");

  const logs = [...state.auditLog].reverse();
  const filtered = logs.filter(l =>
    !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("auditLogs.title")}</h1>
        <p className="page-description">{t("auditLogs.subtitle")}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("auditLogs.searchPlaceholder")} className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("auditLogs.action")}</TableHead>
              <TableHead>{t("auditLogs.actor")}</TableHead>
              <TableHead>{t("auditLogs.target")}</TableHead>
              <TableHead>{t("auditLogs.timestamp")}</TableHead>
              <TableHead>{t("auditLogs.ip")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell className="text-muted-foreground">{log.actor}</TableCell>
                <TableCell className="font-mono text-sm">{log.target}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{log.timestamp}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{log.ip ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
