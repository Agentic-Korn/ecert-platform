import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Mail, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const badgeTemplates = [
  { id: "1", name: "Gold Badge", program: "EMT-Paramedic", preview: "🏅" },
  { id: "2", name: "Silver Badge", program: "Advanced First Responder", preview: "🥈" },
  { id: "3", name: "Bronze Badge", program: "EMT-Basic", preview: "🥉" },
  { id: "4", name: "Platinum Badge", program: "Disaster Response", preview: "💎" },
];

const messageTemplates = [
  { id: "1", name: "Certificate Approved", channel: "LINE + Email", variables: 4 },
  { id: "2", name: "Expiring Soon (30 days)", channel: "LINE + Email", variables: 5 },
  { id: "3", name: "Certificate Expired", channel: "LINE + Email", variables: 4 },
  { id: "4", name: "Training Invitation", channel: "Email", variables: 6 },
  { id: "5", name: "Event Registration", channel: "LINE", variables: 3 },
];

export default function Templates() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-description">Badge และ Message templates</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />สร้าง Template</Button>
      </div>

      <Tabs defaultValue="badge">
        <TabsList>
          <TabsTrigger value="badge"><Award className="h-4 w-4 mr-1.5" />Badge Templates</TabsTrigger>
          <TabsTrigger value="message"><Mail className="h-4 w-4 mr-1.5" />Message Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="badge" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {badgeTemplates.map((t) => (
              <Card key={t.id} className="hover:shadow-md transition-shadow cursor-pointer text-center">
                <CardContent className="p-6">
                  <div className="text-5xl mb-3">{t.preview}</div>
                  <h3 className="font-semibold text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t.program}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="message" className="mt-4">
          <div className="space-y-3">
            {messageTemplates.map((t) => (
              <Card key={t.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.channel} · {t.variables} variables</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
