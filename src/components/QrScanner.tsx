import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QrScannerProps {
  open: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export function QrScanner({ open, onClose, onResult }: QrScannerProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" /> {t("verify.scanQr")}
          </DialogTitle>
          <DialogDescription>{t("verify.scanQrDesc")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl overflow-hidden border bg-black aspect-square">
          {open && (
            <Scanner
              onScan={(detected) => {
                if (detected && detected.length > 0) {
                  onResult(detected[0].rawValue);
                }
              }}
              onError={(err) => {
                setError(err instanceof Error ? err.message : String(err));
              }}
              constraints={{ facingMode: "environment" }}
              styles={{ container: { width: "100%", height: "100%" } }}
            />
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive">
            {t("verify.scanError")}: {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1.5" /> {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
