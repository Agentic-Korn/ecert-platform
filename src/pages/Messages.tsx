import { useTranslation } from "react-i18next";
import { mockMessages } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/StatCard";
import { Send, Eye, MousePointerClick, MessageSquare } from "lucide-react";

export default function Messages() {
  const { t } = useTranslation();
  const totalSent = mockMessages.reduce((s, m) => s + m.sent, 0);
  const totalOpened = mockMessages.reduce((s, m) => s + m.opened, 0);
  const totalClicked = mockMessages.reduce((s, m) => s + m.clicked, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t("messages.title")}</h1>
        <p className="page-description">{t("messages.subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title={t("messages.totalSent")} value={totalSent.toLocaleString()} icon={Send} />
        <StatCard title={t("messages.opened")} value={`${Math.round((totalOpened / totalSent) * 100)}%`} icon={Eye} />
        <StatCard title={t("messages.clicked")} value={`${Math.round((totalClicked / totalSent) * 100)}%`} icon={MousePointerClick} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("messages.messageActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("messages.template")}</TableHead>
                <TableHead>{t("messages.channel")}</TableHead>
                <TableHead className="text-right">{t("messages.sent")}</TableHead>
                <TableHead className="text-right">{t("messages.opened")}</TableHead>
                <TableHead className="text-right">{t("messages.clicked")}</TableHead>
                <TableHead>{t("messages.lastSent")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.template}</TableCell>
                  <TableCell className="text-muted-foreground">{msg.channel}</TableCell>
                  <TableCell className="text-right">{msg.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{msg.opened.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{msg.clicked.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{msg.lastSent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
