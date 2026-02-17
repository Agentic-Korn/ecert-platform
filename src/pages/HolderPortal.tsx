import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Award, QrCode, Download, RefreshCw, Bell, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const myCerts = [
  { certNo: "TMPSA-2026-000123", program: "EMT-Paramedic Certification", status: "active" as const, issuedAt: "2025-06-15", expiresAt: "2027-06-15", issuer: "TMPSA" },
  { certNo: "SPCH-2025-000456", program: "Advanced First Responder", status: "expired" as const, issuedAt: "2024-01-10", expiresAt: "2025-01-10", issuer: "สพฉ" },
];

const notifications = [
  { id: "1", title: "Certificate Approved", message: "Your EMT-Paramedic certification has been approved.", time: "2 hours ago", read: false },
  { id: "2", title: "Training Reminder", message: "EMT Refresher Course starts in 3 days.", time: "1 day ago", read: true },
  { id: "3", title: "Expiring Soon", message: "Your AFR certificate expires in 30 days.", time: "3 days ago", read: true },
];

export default function HolderPortal() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold">eCert Portal</h1>
              <p className="text-xs text-muted-foreground">สวัสดี, สมชาย ใจดี</p>
            </div>
          </div>
          <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <Tabs defaultValue="certs">
          <TabsList>
            <TabsTrigger value="certs"><Award className="h-4 w-4 mr-1.5" />My Certificates</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5" />Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="certs" className="mt-4 space-y-4">
            {myCerts.map((cert) => (
              <Card key={cert.certNo} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{cert.program}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer} · {cert.certNo}</p>
                    </div>
                    <StatusBadge status={cert.status} />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                    <span>Issued: {cert.issuedAt}</span>
                    <span>Expires: {cert.expiresAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><QrCode className="h-4 w-4 mr-1.5" />QR Code</Button>
                    <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1.5" />Download</Button>
                    {cert.status === "expired" && (
                      <Button size="sm"><RefreshCw className="h-4 w-4 mr-1.5" />ขอต่ออายุ</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-3">
            {notifications.map((n) => (
              <Card key={n.id} className={n.read ? "opacity-70" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-muted" : "bg-primary"}`} />
                    <div>
                      <h4 className="font-medium text-sm">{n.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
