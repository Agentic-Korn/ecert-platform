import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search, QrCode as QrCodeIcon, Shield, Clock, RotateCcw, Ban, AlertCircle } from "lucide-react";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { downloadCertificatePdf } from "@/lib/certPdf";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Certificate } from "@/lib/types";

export default function Certificates() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppStore();

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [issueStep, setIssueStep] = useState(1);
  const [search, setSearch] = useState("");

  // Issue form state
  const [issueProgramId, setIssueProgramId] = useState("");
  const [issueFirstName, setIssueFirstName] = useState("");
  const [issueLastName, setIssueLastName] = useState("");
  const [issueEmail, setIssueEmail] = useState("");
  const [issueIdentity, setIssueIdentity] = useState<"verified" | "pending">("verified");
  const [issueIdMethod, setIssueIdMethod] = useState("national-id");

  const filtered = state.certificates.filter(c =>
    !search || c.certNo.toLowerCase().includes(search.toLowerCase()) || c.holderName.toLowerCase().includes(search.toLowerCase())
  );

  const resetIssueForm = () => {
    setIssueProgramId("");
    setIssueFirstName("");
    setIssueLastName("");
    setIssueEmail("");
    setIssueIdentity("verified");
    setIssueIdMethod("national-id");
    setIssueStep(1);
  };

  const handleIssueSubmit = () => {
    const program = state.programs.find(p => p.id === issueProgramId);
    dispatch({
      type: "ISSUE_CERT",
      payload: {
        holderName: `${issueFirstName} ${issueLastName}`,
        holderEmail: issueEmail,
        programId: issueProgramId,
        programName: program?.name ?? "",
        identity: issueIdentity,
      },
    });
    toast.success(t("certificates.toastIssued"));
    setShowIssue(false);
    resetIssueForm();
  };

  const handleDownloadCert = async (cert: Certificate) => {
    const program = state.programs.find(p => p.id === cert.programId);
    toast.info(t("portal.preparingPdf"));
    try {
      await downloadCertificatePdf(cert, program);
      toast.success(t("portal.toastDownloaded"));
    } catch {
      toast.error(t("portal.downloadError"));
    }
  };

  const selectedProgram = state.programs.find(p => p.id === issueProgramId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("certificates.title")}</h1>
          <p className="page-description">{t("certificates.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success(t("certificates.toastExportTitle"), { description: t("certificates.toastExportDesc") })}>
            <Download className="h-4 w-4 mr-2" />{t("common.export")}
          </Button>
          <Button onClick={() => { setShowIssue(true); resetIssueForm(); }}>
            <Plus className="h-4 w-4 mr-2" />{t("certificates.issueCertificate")}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("certificates.searchPlaceholder")} className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("certificates.certNo")}</TableHead>
              <TableHead>{t("certificates.holder")}</TableHead>
              <TableHead>{t("certificates.program")}</TableHead>
              <TableHead>{t("certificates.status")}</TableHead>
              <TableHead>{t("certificates.issued")}</TableHead>
              <TableHead>{t("certificates.expires")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cert) => (
              <TableRow key={cert.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedCert(cert)}>
                <TableCell className="font-mono text-sm">{cert.certNo}</TableCell>
                <TableCell className="font-medium">{cert.holderName}</TableCell>
                <TableCell className="text-muted-foreground">{cert.programName}</TableCell>
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
            <SheetTitle>{t("certificates.detail")}</SheetTitle>
            <SheetDescription>{selectedCert?.certNo}</SheetDescription>
          </SheetHeader>
          {selectedCert && (
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">{t("certificates.holder")}</p><p className="font-medium">{selectedCert.holderName}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.status")}</p><StatusBadge status={selectedCert.status} /></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.program")}</p><p className="font-medium">{selectedCert.programName}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.certNo")}</p><p className="font-mono text-xs">{selectedCert.certNo}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.issued")}</p><p className="font-medium">{selectedCert.issuedAt || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.expires")}</p><p className="font-medium">{selectedCert.expiresAt || "—"}</p></div>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-sm font-semibold mb-3">{t("certificates.statusTimeline")}</p>
                <div className="space-y-3">
                  {[
                    { label: t("certificates.draftCreated"), done: true },
                    { label: t("certificates.submittedForApproval"), done: selectedCert.status !== "pending" || !!selectedCert.issuedAt },
                    { label: t("certificates.approved"), done: selectedCert.status === "active" },
                    { label: t("certificates.certificateIssued"), done: selectedCert.status === "active" && !!selectedCert.issuedAt },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full shrink-0 ${step.done ? "bg-success" : "bg-muted"}`} />
                      <p className="text-sm font-medium">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQR(true)}>
                  <QrCodeIcon className="h-4 w-4 mr-1.5" />{t("certificates.viewQR")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectedCert && handleDownloadCert(selectedCert)}>
                  <Download className="h-4 w-4 mr-1.5" />{t("common.download")}
                </Button>
                {selectedCert.status === "active" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { toast.success(t("certificates.toastExtended")); setSelectedCert(null); }}>
                      <RotateCcw className="h-4 w-4 mr-1.5" />{t("certificates.extend")}
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => { toast.error(t("certificates.toastRevoked")); setSelectedCert(null); }}>
                      <Ban className="h-4 w-4 mr-1.5" />{t("certificates.revoke")}
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
            <DialogTitle>{t("certificates.qrCode")}</DialogTitle>
            <DialogDescription>{selectedCert?.certNo}</DialogDescription>
          </DialogHeader>
          {selectedCert && <QRCodeDisplay certNo={selectedCert.certNo} />}
          <p className="text-xs text-muted-foreground">{t("certificates.qrScanDesc")}</p>
        </DialogContent>
      </Dialog>

      {/* Issue Certificate Dialog */}
      <Dialog open={showIssue} onOpenChange={() => { setShowIssue(false); resetIssueForm(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("certificates.issueDialogTitle")}</DialogTitle>
            <DialogDescription>{t("certificates.stepOf", { step: issueStep, total: 3 })}</DialogDescription>
          </DialogHeader>

          {issueStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("certificates.program")}</Label>
                <Select value={issueProgramId} onValueChange={setIssueProgramId}>
                  <SelectTrigger><SelectValue placeholder={t("certificates.program")} /></SelectTrigger>
                  <SelectContent>
                    {state.programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{t("certificates.firstName")}</Label>
                  <Input placeholder={t("certificates.firstName")} value={issueFirstName} onChange={e => setIssueFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("certificates.lastName")}</Label>
                  <Input placeholder={t("certificates.lastName")} value={issueLastName} onChange={e => setIssueLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("certificates.email")}</Label>
                <Input type="email" placeholder="email@example.com" value={issueEmail} onChange={e => setIssueEmail(e.target.value)} />
              </div>
            </div>
          )}

          {issueStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" /> {t("certificates.identityVerification")}
                </Label>
                <RadioGroup value={issueIdentity} onValueChange={(v) => setIssueIdentity(v as "verified" | "pending")} className="space-y-2">
                  <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="verified" id="id-verified" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{t("certificates.idVerified")}</p>
                      <p className="text-xs text-muted-foreground">{t("certificates.idVerifiedDesc")}</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="pending" id="id-pending" className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{t("certificates.idPendingLabel")}</p>
                      <p className="text-xs text-muted-foreground">{t("certificates.idPendingDesc")}</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {issueIdentity === "verified" && (
                <div className="space-y-2">
                  <Label className="text-xs">{t("certificates.verificationMethod")}</Label>
                  <Select value={issueIdMethod} onValueChange={setIssueIdMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national-id">{t("certificates.methodNationalId")}</SelectItem>
                      <SelectItem value="passport">{t("certificates.methodPassport")}</SelectItem>
                      <SelectItem value="employer">{t("certificates.methodEmployer")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="rounded-lg bg-success/10 border border-success/30 p-3 text-xs text-success flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {t("certificates.verificationStatus")}
                  </div>
                </div>
              )}

              {issueIdentity === "pending" && (
                <div className="rounded-lg bg-warning/10 border border-warning/30 p-3 text-xs text-warning-foreground flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-warning" />
                  <span>{t("certificates.identityPendingNotice")}</span>
                </div>
              )}
            </div>
          )}

          {issueStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">{t("certificates.reviewInfo")}</p>
              <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{t("certificates.program")}</span><span className="font-medium">{selectedProgram?.name ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("certificates.holder")}</span><span className="font-medium">{issueFirstName} {issueLastName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("certificates.email")}</span><span className="font-medium">{issueEmail}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t("certificates.idVerification")}</span>
                  <span className={`font-medium ${issueIdentity === "verified" ? "text-success" : "text-warning"}`}>
                    {issueIdentity === "verified" ? t("certificates.idVerified") : t("certificates.idPendingLabel")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {issueStep > 1 && <Button variant="outline" onClick={() => setIssueStep(s => s - 1)}>{t("common.back")}</Button>}
            {issueStep < 3 ? (
              <Button onClick={() => setIssueStep(s => s + 1)} disabled={issueStep === 1 && (!issueProgramId || !issueFirstName || !issueLastName || !issueEmail)}>
                {t("common.next")}
              </Button>
            ) : (
              <Button onClick={handleIssueSubmit}>{t("certificates.issueCertificate")}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
