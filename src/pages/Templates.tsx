import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Mail, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const badgeTemplates = [
  { id: "1", name: "Gold Badge", program: "EMT-Paramedic", preview: "🏅" },
  { id: "2", name: "Silver Badge", program: "Advanced First Responder", preview: "🥈" },
  { id: "3", name: "Bronze Badge", program: "EMT-Basic", preview: "🥉" },
  { id: "4", name: "Platinum Badge", program: "Disaster Response", preview: "💎" },
];

const messageTemplates = [
  { id: "1", name: "Certificate Approved", channel: "LINE + Email", variables: 4, body: "สวัสดีครับ {{holder_name}},\n\nใบรับรอง {{cert_no}} ของท่านได้รับการอนุมัติแล้ว\nโปรแกรม: {{program_name}}\nวันหมดอายุ: {{expiry_date}}\n\nสามารถดาวน์โหลดได้ที่ eCert Portal" },
  { id: "2", name: "Expiring Soon (30 days)", channel: "LINE + Email", variables: 5, body: "แจ้งเตือน: ใบรับรอง {{cert_no}} ของ {{holder_name}} จะหมดอายุในอีก {{days_left}} วัน\nกรุณาดำเนินการต่ออายุก่อน {{expiry_date}}" },
  { id: "3", name: "Certificate Expired", channel: "LINE + Email", variables: 4, body: "ใบรับรอง {{cert_no}} ของ {{holder_name}} หมดอายุแล้ว\nกรุณาติดต่อเพื่อดำเนินการต่ออายุ" },
  { id: "4", name: "Training Invitation", channel: "Email", variables: 6, body: "เรียน {{holder_name}},\n\nขอเชิญเข้าร่วมอบรม {{course_name}}\nวันที่: {{date}}\nสถานที่: {{location}}" },
  { id: "5", name: "Event Registration", channel: "LINE", variables: 3, body: "ยืนยันการลงทะเบียนงาน {{event_name}}\nวันที่: {{date}}\nส่วนลด: {{discount}}" },
];

type BadgeT = typeof badgeTemplates[0];
type MsgT = typeof messageTemplates[0];

export default function Templates() {
  const [selectedBadge, setSelectedBadge] = useState<BadgeT | null>(null);
  const [selectedMsg, setSelectedMsg] = useState<MsgT | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-description">Badge และ Message templates</p>
        </div>
        <Button onClick={() => toast.info("สร้าง Template ใหม่ (Demo)")}><Plus className="h-4 w-4 mr-2" />สร้าง Template</Button>
      </div>

      <Tabs defaultValue="badge">
        <TabsList>
          <TabsTrigger value="badge"><Award className="h-4 w-4 mr-1.5" />Badge Templates</TabsTrigger>
          <TabsTrigger value="message"><Mail className="h-4 w-4 mr-1.5" />Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="badge" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {badgeTemplates.map((t) => (
              <Card key={t.id} className="hover:shadow-md transition-shadow cursor-pointer text-center" onClick={() => setSelectedBadge(t)}>
                <CardContent className="p-6">
                  <div className="text-5xl mb-3">{t.preview}</div>
                  <h3 className="font-semibold text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t.program}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="message" className="mt-4">
          <div className="space-y-3">
            {messageTemplates.map((t) => (
              <Card key={t.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedMsg(t)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.channel} · {t.variables} variables</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedMsg(t); }}>Edit</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail */}
      <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Badge Template</DialogTitle>
            <DialogDescription>{selectedBadge?.program}</DialogDescription>
          </DialogHeader>
          {selectedBadge && (
            <div className="space-y-4">
              <div className="text-7xl">{selectedBadge.preview}</div>
              <div className="space-y-2 text-left">
                <Label>Template Name</Label>
                <Input defaultValue={selectedBadge.name} />
              </div>
              <div className="space-y-2 text-left">
                <Label>Linked Program</Label>
                <Input defaultValue={selectedBadge.program} />
              </div>
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Badge Preview</p>
                <p className="text-xs">แสดงบน Holder Portal, QR Card, และ PDF Certificate</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBadge(null)}>ปิด</Button>
            <Button onClick={() => { toast.success("บันทึก Badge Template สำเร็จ"); setSelectedBadge(null); }}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Template Detail */}
      <Dialog open={!!selectedMsg} onOpenChange={() => setSelectedMsg(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Template</DialogTitle>
            <DialogDescription>{selectedMsg?.channel} · {selectedMsg?.variables} variables</DialogDescription>
          </DialogHeader>
          {selectedMsg && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input defaultValue={selectedMsg.name} />
              </div>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Input defaultValue={selectedMsg.channel} />
              </div>
              <div className="space-y-2">
                <Label>Message Body</Label>
                <Textarea defaultValue={selectedMsg.body} rows={6} className="font-mono text-xs" />
              </div>
              <p className="text-xs text-muted-foreground">ใช้ {"{{variable}}"} สำหรับตัวแปร เช่น {"{{holder_name}}"}, {"{{cert_no}}"}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMsg(null)}>ปิด</Button>
            <Button onClick={() => { toast.success("บันทึก Message Template สำเร็จ"); setSelectedMsg(null); }}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
