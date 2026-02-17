import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">ตั้งค่าระบบ eCert Platform</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input defaultValue="eCert Platform" />
          </div>
          <div className="space-y-2">
            <Label>Certificate Number Format</Label>
            <Input defaultValue="TMPSA-{YYYY}-{SEQ:6}" className="font-mono" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">ส่ง email แจ้งเตือนอัตโนมัติ</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>LINE Notifications</Label><p className="text-xs text-muted-foreground">ส่ง LINE OA message</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Expiry Reminder (30 days)</Label><p className="text-xs text-muted-foreground">แจ้งเตือนก่อนหมดอายุ 30 วัน</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button>Save Settings</Button>
    </div>
  );
}
