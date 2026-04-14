import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("templates.title")}</h1>
          <p className="page-description">{t("templates.subtitle")}</p>
        </div>
        <Button onClick={() => toast.info(t("templates.toastCreate"))}><Plus className="h-4 w-4 mr-2" />{t("templates.createTemplate")}</Button>
      </div>

      <Tabs defaultValue="badge">
        <TabsList>
          <TabsTrigger value="badge"><Award className="h-4 w-4 mr-1.5" />{t("templates.badgeTemplates")}</TabsTrigger>
          <TabsTrigger value="message"><Mail className="h-4 w-4 mr-1.5" />{t("templates.messageTemplates")}</TabsTrigger>
        </TabsList>

        <TabsContent value="badge" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {badgeTemplates.map((t_item) => (
              <Card key={t_item.id} className="hover:shadow-md transition-shadow cursor-pointer text-center" onClick={() => setSelectedBadge(t_item)}>
                <CardContent className="p-6">
                  <div className="text-5xl mb-3">{t_item.preview}</div>
                  <h3 className="font-semibold text-sm">{t_item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t_item.program}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="message" className="mt-4">
          <div className="space-y-3">
            {messageTemplates.map((t_item) => (
              <Card key={t_item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedMsg(t_item)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{t_item.name}</h3>
                      <p className="text-xs text-muted-foreground">{t_item.channel} · {t_item.variables} variables</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedMsg(t_item); }}>{t("common.edit")}</Button>
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
            <DialogTitle>{t("templates.badgeTemplateTitle")}</DialogTitle>
            <DialogDescription>{selectedBadge?.program}</DialogDescription>
          </DialogHeader>
          {selectedBadge && (
            <div className="space-y-4">
              <div className="text-7xl">{selectedBadge.preview}</div>
              <div className="space-y-2 text-left">
                <Label>{t("templates.templateName")}</Label>
                <Input defaultValue={selectedBadge.name} />
              </div>
              <div className="space-y-2 text-left">
                <Label>{t("templates.linkedProgram")}</Label>
                <Input defaultValue={selectedBadge.program} />
              </div>
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">{t("templates.badgePreview")}</p>
                <p className="text-xs">{t("templates.badgeDisplayDesc")}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBadge(null)}>{t("common.close")}</Button>
            <Button onClick={() => { toast.success(t("templates.toastBadgeSaved")); setSelectedBadge(null); }}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Template Detail */}
      <Dialog open={!!selectedMsg} onOpenChange={() => setSelectedMsg(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("templates.messageTemplateTitle")}</DialogTitle>
            <DialogDescription>{selectedMsg?.channel} · {selectedMsg?.variables} variables</DialogDescription>
          </DialogHeader>
          {selectedMsg && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("templates.templateName")}</Label>
                <Input defaultValue={selectedMsg.name} />
              </div>
              <div className="space-y-2">
                <Label>{t("templates.channelLabel")}</Label>
                <Input defaultValue={selectedMsg.channel} />
              </div>
              <div className="space-y-2">
                <Label>{t("templates.messageBody")}</Label>
                <Textarea defaultValue={selectedMsg.body} rows={6} className="font-mono text-xs" />
              </div>
              <p className="text-xs text-muted-foreground">{t("templates.variableHint")}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMsg(null)}>{t("common.close")}</Button>
            <Button onClick={() => { toast.success(t("templates.toastMessageSaved")); setSelectedMsg(null); }}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
