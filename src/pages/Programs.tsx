import { useState } from "react";
import { mockPrograms } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Program = typeof mockPrograms[0];

export default function Programs() {
  const [selected, setSelected] = useState<Program | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Certification Programs</h1>
          <p className="page-description">จัดการโปรแกรมใบรับรองทั้งหมด</p>
        </div>
        <Button onClick={() => toast.info("สร้าง Program ใหม่ (Demo)")}><Plus className="h-4 w-4 mr-2" />สร้าง Program</Button>
      </div>

      <Input placeholder="ค้นหา program..." className="max-w-sm" />

      <div className="grid gap-4 md:grid-cols-2">
        {mockPrograms.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(p)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-cert-badge-bg flex items-center justify-center">
                  <Award className="h-5 w-5 text-cert-gold" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{p.code}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">Issued by {p.issuer}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.activeCerts.toLocaleString()} active</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Program Details</DialogTitle>
            <DialogDescription>{selected?.code} — {selected?.issuer}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Program Name</Label><Input defaultValue={selected.name} /></div>
                <div className="space-y-2"><Label>Code</Label><Input defaultValue={selected.code} className="font-mono" /></div>
                <div className="space-y-2"><Label>Issuer</Label><Input defaultValue={selected.issuer} /></div>
                <div className="space-y-2"><Label>Duration</Label><Input defaultValue={selected.duration} /></div>
                <div className="space-y-2"><Label>Cert No. Format</Label><Input defaultValue={`${selected.code}-{YYYY}-{SEQ:6}`} className="font-mono text-xs" /></div>
                <div className="space-y-2"><Label>Badge Template</Label><Input defaultValue={selected.template} /></div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="font-medium mb-1">Renewal Rules</p>
                <p className="text-xs text-muted-foreground">Auto-notify 30 days before expiry · Requires re-training if expired &gt; 6 months · Approver review required</p>
              </div>
              <div className="text-sm text-muted-foreground">Active Certificates: <span className="font-bold text-foreground">{selected.activeCerts.toLocaleString()}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>ปิด</Button>
            <Button onClick={() => { toast.success("บันทึก Program สำเร็จ"); setSelected(null); }}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
