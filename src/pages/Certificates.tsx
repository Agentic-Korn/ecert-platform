import { mockCertificates } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Certificates() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Certificates</h1>
          <p className="page-description">ค้นหาและจัดการใบรับรองทั้งหมด</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button><Plus className="h-4 w-4 mr-2" />Issue Certificate</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ค้นหาด้วย Cert No, ชื่อ..." className="pl-9" />
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cert No.</TableHead>
              <TableHead>Holder</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCertificates.map((cert) => (
              <TableRow key={cert.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm">{cert.certNo}</TableCell>
                <TableCell className="font-medium">{cert.holder}</TableCell>
                <TableCell className="text-muted-foreground">{cert.program}</TableCell>
                <TableCell><StatusBadge status={cert.status} /></TableCell>
                <TableCell className="text-muted-foreground">{cert.issuedAt || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{cert.expiresAt || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
