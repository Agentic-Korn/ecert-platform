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
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Users & Roles</h1>
          <p className="page-description">จัดการผู้ใช้งานและสิทธิ์</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />เพิ่มผู้ใช้</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="ค้นหาผู้ใช้..." className="pl-9" />
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
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
