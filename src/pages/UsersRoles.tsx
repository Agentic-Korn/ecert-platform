import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const roleColors: Record<string, string> = {
  admin:    "bg-primary/10 text-primary border-primary/30",
  approver: "bg-secondary/20 text-secondary border-secondary/30",
  trainer:  "bg-info/10 text-info border-info/30",
  holder:   "bg-muted text-muted-foreground border-border",
};

export default function UsersRoles() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppStore();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "approver" | "trainer" | "holder">("trainer");

  const filtered = state.users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!name.trim() || !email.trim()) return;
    dispatch({ type: "CREATE_USER", payload: { name: name.trim(), email: email.trim(), role } });
    toast.success(t("users.createdToast", { name }));
    setCreateOpen(false);
    setName(""); setEmail(""); setRole("trainer");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("users.title")}</h1>
          <p className="page-description">{t("users.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />{t("users.addUser")}</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("users.searchPlaceholder")} className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
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
            {filtered.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleColors[user.role] || ""}>{t(`roles.${user.role}`)}</Badge>
                </TableCell>
                <TableCell><StatusBadge status={user.status} /></TableCell>
                <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("users.addUser")}</DialogTitle>
            <DialogDescription>{t("users.createDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>{t("users.name")}</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>{t("users.email")}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>{t("users.role")}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t("roles.admin")}</SelectItem>
                  <SelectItem value="approver">{t("roles.approver")}</SelectItem>
                  <SelectItem value="trainer">{t("roles.trainer")}</SelectItem>
                  <SelectItem value="holder">{t("roles.holder")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !email.trim()}>{t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
