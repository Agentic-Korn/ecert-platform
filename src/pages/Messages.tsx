import { mockMessages } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/StatCard";
import { Send, Eye, MousePointerClick, MessageSquare } from "lucide-react";

export default function Messages() {
  const totalSent = mockMessages.reduce((s, m) => s + m.sent, 0);
  const totalOpened = mockMessages.reduce((s, m) => s + m.opened, 0);
  const totalClicked = mockMessages.reduce((s, m) => s + m.clicked, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <p className="page-description">สถิติการส่งข้อความ LINE/Email</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Sent" value={totalSent.toLocaleString()} icon={Send} />
        <StatCard title="Opened" value={`${Math.round((totalOpened / totalSent) * 100)}%`} icon={Eye} />
        <StatCard title="Clicked" value={`${Math.round((totalClicked / totalSent) * 100)}%`} icon={MousePointerClick} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Message Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Opened</TableHead>
                <TableHead className="text-right">Clicked</TableHead>
                <TableHead>Last Sent</TableHead>
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
