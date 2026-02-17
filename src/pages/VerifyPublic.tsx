import { useParams, useSearchParams } from "react-router-dom";
import { Shield, CheckCircle2, XCircle, AlertTriangle, Award, Calendar, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

// Mock verify result
const mockVerifyResult = {
  certNo: "TMPSA-2026-000123",
  status: "active" as const,
  programName: "EMT-Paramedic Certification",
  programCode: "EMT-P",
  issuer: "TMPSA — Thai Medical Professional Standards Association",
  holderDisplay: "สม*** ใ***",
  issuedAt: "2025-06-15",
  expiresAt: "2027-06-15",
};

const statusIcons = {
  active: <CheckCircle2 className="h-12 w-12 text-success" />,
  expired: <AlertTriangle className="h-12 w-12 text-warning" />,
  revoked: <XCircle className="h-12 w-12 text-destructive" />,
};

export default function VerifyPublic() {
  const result = mockVerifyResult;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display">eCert</span>
          </div>
          <h1 className="text-lg font-semibold">Certificate Verification</h1>
          <p className="text-sm text-muted-foreground">ตรวจสอบใบรับรองดิจิทัล</p>
        </div>

        {/* Result Card */}
        <Card className="overflow-hidden">
          <div className={`p-6 text-center ${result.status === "active" ? "bg-success/5" : result.status === "expired" ? "bg-warning/5" : "bg-destructive/5"}`}>
            {statusIcons[result.status]}
            <h2 className="mt-3 text-lg font-bold capitalize">
              {result.status === "active" ? "Valid Certificate" : result.status === "expired" ? "Certificate Expired" : "Certificate Revoked"}
            </h2>
            <StatusBadge status={result.status} className="mt-2" />
          </div>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-3">
              <InfoRow icon={Award} label="Program" value={result.programName} />
              <InfoRow icon={Building2} label="Issuer" value={result.issuer} />
              <InfoRow label="Holder" value={result.holderDisplay} />
              <InfoRow label="Certificate No." value={result.certNo} mono />
              <InfoRow icon={Calendar} label="Issued" value={result.issuedAt} />
              <InfoRow icon={Calendar} label="Expires" value={result.expiresAt} />
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Verified by eCert Platform · {new Date().toISOString().split("T")[0]}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }: { icon?: any; label: string; value: string; mono?: boolean }) {
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
