import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">{t("settings.title")}</h1>
        <p className="page-description">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{t("settings.organization")}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings.orgName")}</Label>
            <Input defaultValue="eCert Platform" />
          </div>
          <div className="space-y-2">
            <Label>{t("settings.certNoFormat")}</Label>
            <Input defaultValue="TMPSA-{YYYY}-{SEQ:6}" className="font-mono" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t("settings.notifications")}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>{t("settings.emailNotifications")}</Label><p className="text-xs text-muted-foreground">{t("settings.emailNotificationsDesc")}</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>{t("settings.lineNotifications")}</Label><p className="text-xs text-muted-foreground">{t("settings.lineNotificationsDesc")}</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>{t("settings.expiryReminder")}</Label><p className="text-xs text-muted-foreground">{t("settings.expiryReminderDesc")}</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => toast.success(t("settings.toastSaved"), { description: t("settings.toastSavedDesc") })}>{t("settings.saveSettings")}</Button>
    </div>
  );
}
