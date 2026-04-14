import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Award, QrCode as QrCodeIcon, Download, RefreshCw, Bell, Shield, Globe, LogOut } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function HolderPortal() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const [qrCert, setQrCert] = useState<string | null>(null);
  const [renewCert, setRenewCert] = useState<string | null>(null);
  const [renewReason, setRenewReason] = useState("");

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "th" ? "en" : "th");
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  // Get certs for the logged-in holder
  const myCerts = state.currentUser
    ? state.certificates.filter(c => c.holderId === state.currentUser!.userId || c.holderName === state.currentUser!.name)
    : [];

  const handleRenewal = () => {
    if (!renewCert || !state.currentUser) return;
    const cert = state.certificates.find(c => c.certNo === renewCert);
    if (!cert) return;

    dispatch({
      type: "SUBMIT_RENEWAL",
      payload: {
        certId: cert.id,
        certNo: cert.certNo,
        holderId: state.currentUser.userId,
        holderName: state.currentUser.name,
        programName: cert.programName,
      },
    });
    toast.success(t("portal.toastRenewalSubmitted"), { description: t("portal.toastRenewalDesc") });
    setRenewCert(null);
    setRenewReason("");
  };

  const notifications = [
    { id: "1", title: t("portal.notifCertApproved"), message: t("portal.notifCertApprovedMsg"), time: t("portal.timeAgo2h"), read: false },
    { id: "2", title: t("portal.notifTrainingReminder"), message: t("portal.notifTrainingReminderMsg"), time: t("portal.timeAgo1d"), read: true },
    { id: "3", title: t("portal.notifExpiringSoon"), message: t("portal.notifExpiringSoonMsg"), time: t("portal.timeAgo3d"), read: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold">{t("portal.title")}</h1>
              <p className="text-xs text-muted-foreground">{t("portal.greeting", { name: state.currentUser?.name ?? "" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary gap-1.5 text-xs font-medium"
              onClick={toggleLanguage}
            >
              <Globe className="h-3.5 w-3.5" />
              {i18n.language === "th" ? "EN" : "TH"}
            </Button>
            <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <Tabs defaultValue="certs">
          <TabsList>
            <TabsTrigger value="certs"><Award className="h-4 w-4 mr-1.5" />{t("portal.myCertificates")}</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1.5" />{t("portal.notifications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="certs" className="mt-4 space-y-4">
            {myCerts.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  <Award className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">{t("portal.myCertificates")}</p>
                  <p className="text-sm mt-1 text-muted-foreground">{t("approvals.allProcessed")}</p>
                </CardContent>
              </Card>
            ) : (
              myCerts.map((cert) => {
                const program = state.programs.find(p => p.id === cert.programId);
                return (
                  <Card key={cert.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{cert.programName}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{program?.issuer ?? "—"} · {cert.certNo}</p>
                        </div>
                        <StatusBadge status={cert.status} />
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                        <span>{t("portal.issued")} {cert.issuedAt || "—"}</span>
                        <span>{t("portal.expires")} {cert.expiresAt || "—"}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setQrCert(cert.certNo)}>
                          <QrCodeIcon className="h-4 w-4 mr-1.5" />{t("portal.qrCode")}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toast.success(t("portal.toastDownloaded"))}>
                          <Download className="h-4 w-4 mr-1.5" />{t("common.download")}
                        </Button>
                        {(cert.status === "expired" || cert.status === "active") && (
                          <Button size="sm" onClick={() => setRenewCert(cert.certNo)}>
                            <RefreshCw className="h-4 w-4 mr-1.5" />{t("portal.requestRenewal")}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
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

      {/* QR Dialog */}
      <Dialog open={!!qrCert} onOpenChange={() => setQrCert(null)}>
        <DialogContent className="sm:max-w-sm text-center">
          <DialogHeader>
            <DialogTitle>{t("portal.qrDialogTitle")}</DialogTitle>
            <DialogDescription>{qrCert}</DialogDescription>
          </DialogHeader>
          {qrCert && <QRCodeDisplay certNo={qrCert} />}
          <p className="text-xs text-muted-foreground">{t("portal.qrDialogDesc")}</p>
        </DialogContent>
      </Dialog>

      {/* Renewal Dialog */}
      <Dialog open={!!renewCert} onOpenChange={() => { setRenewCert(null); setRenewReason(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("portal.renewalDialogTitle")}</DialogTitle>
            <DialogDescription>{renewCert}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>{t("portal.renewalReason")}</Label>
            <Textarea
              placeholder={t("portal.renewalReasonPlaceholder")}
              value={renewReason}
              onChange={e => setRenewReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRenewCert(null); setRenewReason(""); }}>{t("common.cancel")}</Button>
            <Button onClick={handleRenewal}>{t("portal.submitRequest")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
