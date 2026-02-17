import { Award, BadgeCheck, ClipboardCheck, AlertTriangle, TrendingUp, Users, Calendar, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockApprovals, mockCertificates } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">ภาพรวมระบบใบรับรองดิจิทัล eCert</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Certificates" value="5,712" icon={BadgeCheck} trend="+12% จากเดือนก่อน" trendUp />
        <StatCard title="Pending Approval" value={mockApprovals.length} icon={ClipboardCheck} />
        <StatCard title="Expiring Soon (30d)" value="128" icon={AlertTriangle} trend="ต้องดำเนินการ" />
        <StatCard title="Verify API Calls (Today)" value="1,842" icon={ShieldCheck} trend="+24%" trendUp />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockApprovals.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.holder}</p>
                    <p className="text-xs text-muted-foreground">{item.program} · {item.certNo}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <StatusBadge status="pending" />
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Certificates</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCertificates.slice(0, 4).map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{cert.holder}</p>
                    <p className="text-xs text-muted-foreground">{cert.certNo}</p>
                  </div>
                  <StatusBadge status={cert.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Programs" value={4} icon={Award} />
        <StatCard title="Registered Users" value="8,234" icon={Users} />
        <StatCard title="Upcoming Events" value={3} icon={Calendar} />
      </div>
    </div>
  );
}
