import { useTranslation } from "react-i18next";
import { mockUsers } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const roleColors: Record<string, string> = {
  "Super Admin": "bg-primary/10 text-primary border-primary/30",
  "Approver": "bg-secondary/20 text-secondary border-secondary/30",
  "Trainer": "bg-info/10 text-info border-info/30",
  "Holder": "bg-muted text-muted-foreground border-border",
};

export default function UsersRoles() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("users.title")}</h1>
          <p className="page-description">{t("users.subtitle")}</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />{t("users.addUser")}</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("users.searchPlaceholder")} className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("users.name")}</TableHead>
              <TableHead>{t("users.email")}</TableHead>
              <TableHead>{t("users.role")}</TableHead>
              <TableHead>{t("users.status")}</TableHead>
              <TableHead>{t("users.lastLogin")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[user.role] || ""}>{user.role}</Badge>
                </TableCell>
                <TableCell><StatusBadge status={user.status} /></TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
