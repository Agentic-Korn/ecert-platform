import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function ResetDemoButton({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const { dispatch } = useAppStore();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    dispatch({ type: "RESET_DEMO" });
    toast.success(t("demo.resetToast"));
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className="text-muted-foreground hover:text-primary gap-1.5 text-xs font-medium"
          data-tour="reset-demo"
          title={t("demo.reset")}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {!compact && <span className="hidden md:inline">{t("demo.reset")}</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("demo.resetConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("demo.resetConfirmDesc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>{t("demo.reset")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
