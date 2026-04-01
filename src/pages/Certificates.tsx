import { useState } from "react";
import { mockCertificates, mockPrograms } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search, QrCode, Shield, Clock, RotateCcw, Ban } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Cert = typeof mockCertificates[0];

const timeline = [
  { label: "Draft Created", date: "2025-06-01", done: true },
  { label: "Submitted for Approval", date: "2025-06-10", done: true },
  { label: "Approved", date: "2025-06-14", done: true },
  { label: "Certificate Issued", date: "2025-06-15", done: true },
];

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [issueStep, setIssueStep] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = mockCertificates.filter(c =>
    !search || c.certNo.toLowerCase().includes(search.toLowerCase()) || c.holder.toLowerCase().includes(search.toLowerCase())
  );

  const handleIssueSubmit = () => {
    const newCertNo = `TMPSA-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`;
    toast.success("ออกใบรับรองสำเร็จ!", { description: `Certificate No: ${newCertNo}` });
    setShowIssue(false);
    setIssueStep(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Certificates</h1>
          <p className="page-description">ค้นหาและจัดการใบรับรองทั้งหมด</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Export started", { description: "กำลังส่งออกไฟล์ CSV..." })}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={() => { setShowIssue(true); setIssueStep(1); }}><Plus className="h-4 w-4 mr-2" />Issue Certificate</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ค้นหาด้วย Cert No, ชื่อ..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
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
            {filtered.map((cert) => (
              <TableRow key={cert.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedCert(cert)}>
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

      {/* Certificate Detail Sheet */}
      <Sheet open={!!selectedCert && !showQR} onOpenChange={() => setSelectedCert(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Certificate Detail</SheetTitle>
            <SheetDescription>{selectedCert?.certNo}</SheetDescription>
          </SheetHeader>
          {selectedCert && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Holder</p><p className="font-medium">{selectedCert.holder}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={selectedCert.status} /></div>
                <div><p className="text-xs text-muted-foreground">Program</p><p className="font-medium">{selectedCert.program}</p></div>
                <div><p className="text-xs text-muted-foreground">Cert No.</p><p className="font-mono text-xs">{selectedCert.certNo}</p></div>
                <div><p className="text-xs text-muted-foreground">Issued</p><p className="font-medium">{selectedCert.issuedAt || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Expires</p><p className="font-medium">{selectedCert.expiresAt || "—"}</p></div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-sm font-semibold mb-3">Status Timeline</p>
                <div className="space-y-3">
                  {timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full shrink-0 ${t.done ? "bg-success" : "bg-muted"}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQR(true)}>
                  <QrCode className="h-4 w-4 mr-1.5" />View QR
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Certificate PDF downloaded")}>
                  <Download className="h-4 w-4 mr-1.5" />Download
                </Button>
                {selectedCert.status === "active" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { toast.success("ต่ออายุใบรับรองเรียบร้อย"); setSelectedCert(null); }}>
                      <RotateCcw className="h-4 w-4 mr-1.5" />Extend
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => { toast.error("เพิกถอนใบรับรองเรียบร้อย"); setSelectedCert(null); }}>
                      <Ban className="h-4 w-4 mr-1.5" />Revoke
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>{selectedCert?.certNo}</DialogDescription>
          </DialogHeader>
          <div className="mx-auto my-4 h-48 w-48 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center bg-muted/30">
            <QrCode className="h-20 w-20 text-primary/60" />
            <p className="text-[10px] text-muted-foreground mt-2 font-mono">/verify/{selectedCert?.certNo}</p>
          </div>
          <p className="text-xs text-muted-foreground">สแกน QR นี้เพื่อตรวจสอบใบรับรอง</p>
        </DialogContent>
      </Dialog>

      {/* Issue Certificate Dialog */}
      <Dialog open={showIssue} onOpenChange={() => { setShowIssue(false); setIssueStep(1); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>ขั้นตอนที่ {issueStep} จาก 3</DialogDescription>
          </DialogHeader>

          {issueStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Program</Label>
                <Select defaultValue="1">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {mockPrograms.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>ชื่อ</Label><Input placeholder="ชื่อ" defaultValue="สมชาย" /></div>
                <div className="space-y-2"><Label>นามสกุล</Label><Input placeholder="นามสกุล" defaultValue="ใจดี" /></div>
              </div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" defaultValue="somchai@gmail.com" /></div>
            </div>
          )}

          {issueStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
                <Shield className="h-10 w-10 mx-auto mb-3 text-primary/50" />
                <p className="font-medium text-sm">Identity Verification</p>
                <p className="text-xs mt-1">อัปโหลดสำเนาบัตรประชาชนหรือพาสปอร์ต</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Mock: เลือกไฟล์สำเร็จ")}>เลือกไฟล์</Button>
              </div>
              <div className="rounded-lg bg-success/10 border border-success/30 p-3 text-sm text-success flex items-center gap-2">
                <Clock className="h-4 w-4" /> สถานะ: รอการตรวจสอบ (Mock)
              </div>
            </div>
          )}

          {issueStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">ตรวจสอบข้อมูล</p>
              <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Program</span><span className="font-medium">EMT-Paramedic Certification</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Holder</span><span className="font-medium">สมชาย ใจดี</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">somchai@gmail.com</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ID Verification</span><span className="font-medium text-success">Uploaded</span></div>
              </div>
            </div>
          )}

          <DialogFooter>
            {issueStep > 1 && <Button variant="outline" onClick={() => setIssueStep(s => s - 1)}>ย้อนกลับ</Button>}
            {issueStep < 3 ? (
              <Button onClick={() => setIssueStep(s => s + 1)}>ถัดไป</Button>
            ) : (
              <Button onClick={handleIssueSubmit}>ออกใบรับรอง</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
