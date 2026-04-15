import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Award, Calendar, Building2, Search, Clock, Globe, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/lib/store";
import type { Certificate } from "@/lib/types";
import { QrScanner } from "@/components/QrScanner";
import { DemoTourLauncher } from "@/components/DemoTourLauncher";

function maskName(name: string): string {
  const parts = name.split(" ");
  return parts.map(p => p.length <= 1 ? p : p[0] + "***").join(" ");
}

export default function VerifyPublic() {
  const { t, i18n } = useTranslation();
  const { certNo: paramCertNo } = useParams();
  const { state, dispatch } = useAppStore();

  const [searchInput, setSearchInput] = useState(paramCertNo || "");
  const [queriedCertNo, setQueriedCertNo] = useState(paramCertNo || "");
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleScanResult = (text: string) => {
    setScannerOpen(false);
    // QR may contain a verify URL; extract the cert number
    const match = text.match(/\/verify\/([^/?#]+)/);
    const certNo = match ? decodeURIComponent(match[1]) : text;
    setSearchInput(certNo);
    doSearch(certNo);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "th" ? "en" : "th");
  };

  useEffect(() => {
    if (paramCertNo) {
      doSearch(paramCertNo);
    }
  }, [paramCertNo]);

  const doSearch = (certNo: string) => {
    const trimmed = certNo.trim();
    setQueriedCertNo(trimmed);
    setSearched(true);
    const found = state.certificates.find(c => c.certNo === trimmed);
    setResult(found ?? null);
    if (found) {
      dispatch({ type: "LOG_VERIFY", payload: { certNo: trimmed } });
    }
  };

  const handleSearch = () => {
    doSearch(searchInput);
  };

  const program = result ? state.programs.find(p => p.id === result.programId) : null;
  const issuerDisplay = program ? `${program.issuer}` : "—";

  const statusIcon = result?.status === "active"
    ? <CheckCircle2 className="h-12 w-12 text-success" />
    : result?.status === "expired"
    ? <AlertTriangle className="h-12 w-12 text-warning" />
    : result?.status === "pending"
    ? <Clock className="h-12 w-12 text-muted-foreground" />
    : <XCircle className="h-12 w-12 text-destructive" />;

  const statusHeading = result?.status === "active"
    ? t("verify.validCertificate")
    : result?.status === "expired"
    ? t("verify.expiredCertificate")
    : result?.status === "pending"
    ? t("verify.pendingCertificate")
    : t("verify.revokedCertificate");

  const statusBg = result?.status === "active"
    ? "bg-success/5"
    : result?.status === "expired"
    ? "bg-warning/5"
    : result?.status === "pending"
    ? "bg-muted/5"
    : "bg-destructive/5";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary gap-1.5 text-xs font-medium"
          onClick={toggleLanguage}
        >
          <Globe className="h-3.5 w-3.5" />
          {i18n.language === "th" ? "EN" : "TH"}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display">{t("app.name")}</span>
          </div>
          <h1 className="text-lg font-semibold">{t("verify.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("verify.subtitle")}</p>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("verify.searchPlaceholder")}
                className="pl-9"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>{t("verify.verifyButton")}</Button>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setScannerOpen(true)}
            data-tour="scan-qr"
          >
            <Camera className="h-4 w-4" />
            {t("verify.scanQr")}
          </Button>
        </div>

        {/* Result — Found */}
        {searched && result && (
          <Card className="overflow-hidden">
            <div className={`p-6 text-center ${statusBg}`}>
              {statusIcon}
              <h2 className="mt-3 text-lg font-bold">{statusHeading}</h2>
              <StatusBadge status={result.status} className="mt-2" />
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <InfoRow icon={Award} label={t("verify.program")} value={result.programName} />
                <InfoRow icon={Building2} label={t("verify.issuer")} value={issuerDisplay} />
                <InfoRow label={t("verify.holder")} value={maskName(result.holderName)} />
                <InfoRow label={t("verify.certificateNo")} value={result.certNo} mono />
                <InfoRow icon={Calendar} label={t("verify.issued")} value={result.issuedAt || "—"} />
                <InfoRow icon={Calendar} label={t("verify.expires")} value={result.expiresAt || "—"} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result — Not Found */}
        {searched && !result && (
          <Card className="overflow-hidden">
            <div className="p-8 text-center">
              <XCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <h2 className="mt-3 text-lg font-bold">{t("verify.notFound")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("verify.notFoundDesc", { certNo: queriedCertNo })}</p>
              <p className="text-xs text-muted-foreground mt-2">{t("verify.notFoundHint")}</p>
            </div>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {t("verify.footer")} · {new Date().toISOString().split("T")[0]}
        </p>
      </div>

      <QrScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={handleScanResult}
      />
      <DemoTourLauncher />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }: { icon?: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
      {!Icon && <div className="w-4" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
