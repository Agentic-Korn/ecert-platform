import { useState } from "react";
import { mockApprovals } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Eye, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type ApprovalItem = typeof mockApprovals[0];

export default function Approvals() {
  const [items, setItems] = useState([...mockApprovals]);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [approveItem, setApproveItem] = useState<ApprovalItem | null>(null);
  const [rejectItem, setRejectItem] = useState<ApprovalItem | null>(null);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    if (!approveItem) return;
    setItems(prev => prev.filter(i => i.id !== approveItem.id));
    toast.success(`อนุมัติใบรับรองของ ${approveItem.holder} เรียบร้อย`, { description: approveItem.certNo });
    setApproveItem(null);
    setReason("");
  };

  const handleReject = () => {
    if (!rejectItem) return;
    setItems(prev => prev.filter(i => i.id !== rejectItem.id));
    toast.error(`ปฏิเสธคำขอของ ${rejectItem.holder}`, { description: reason || "ไม่ระบุเหตุผล" });
    setRejectItem(null);
    setReason("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Approval Inbox</h1>
          <p className="page-description">คำขอใบรับรองที่รออนุมัติ ({items.length} รายการ)</p>
        </div>
        <Button variant="outline" onClick={() => toast.info("Filter applied")}><Filter className="h-4 w-4 mr-2" />Filter</Button>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <Check className="h-10 w-10 mx-auto mb-3 text-success" />
          <p className="font-semibold">ไม่มีคำขอรออนุมัติ</p>
          <p className="text-sm mt-1">ทุกรายการได้รับการดำเนินการแล้ว</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{item.holder}</h3>
                      <Badge variant="outline" className="text-[10px] capitalize">{item.type}</Badge>
                      {item.identity === "verified" ? (
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">ID Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">ID Pending</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.program} · {item.certNo}</p>
                    <p className="text-xs text-muted-foreground mt-1">Submitted: {item.submittedAt}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => { setRejectItem(item); setReason(""); }}><X className="h-4 w-4" /></Button>
                    <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => { setApproveItem(item); setReason(""); }}><Check className="h-4 w-4 mr-1" />Approve</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>รายละเอียดคำขอ</DialogTitle>
            <DialogDescription>ข้อมูลผู้สมัครและเอกสารประกอบ</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">ชื่อ-สกุล</p><p className="font-medium">{selectedItem.holder}</p></div>
                <div><p className="text-xs text-muted-foreground">ประเภท</p><p className="font-medium capitalize">{selectedItem.type}</p></div>
                <div><p className="text-xs text-muted-foreground">Program</p><p className="font-medium">{selectedItem.program}</p></div>
                <div><p className="text-xs text-muted-foreground">Cert No.</p><p className="font-medium font-mono text-xs">{selectedItem.certNo}</p></div>
                <div><p className="text-xs text-muted-foreground">Submitted</p><p className="font-medium">{selectedItem.submittedAt}</p></div>
                <div><p className="text-xs text-muted-foreground">ID Verification</p>
                  <StatusBadge status={selectedItem.identity === "verified" ? "active" : "pending"} />
                </div>
              </div>
              <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">
                <p className="font-medium mb-1">📄 เอกสารแนบ</p>
                <p className="text-xs">สำเนาบัตรประชาชน, ใบรับรองการอบรม, รูปถ่าย</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={!!approveItem} onOpenChange={() => setApproveItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการอนุมัติ</DialogTitle>
            <DialogDescription>อนุมัติใบรับรองของ {approveItem?.holder}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>หมายเหตุ (ถ้ามี)</Label>
            <Textarea placeholder="เพิ่มหมายเหตุ..." value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveItem(null)}>ยกเลิก</Button>
            <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleApprove}>
              <Check className="h-4 w-4 mr-1" />อนุมัติ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectItem} onOpenChange={() => setRejectItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปฏิเสธคำขอ</DialogTitle>
            <DialogDescription>ปฏิเสธคำขอของ {rejectItem?.holder}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>เหตุผลในการปฏิเสธ *</Label>
            <Textarea placeholder="ระบุเหตุผล..." value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectItem(null)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!reason.trim()}>
              <X className="h-4 w-4 mr-1" />ปฏิเสธ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
