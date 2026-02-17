import { mockPrograms } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Programs() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Certification Programs</h1>
          <p className="page-description">จัดการโปรแกรมใบรับรองทั้งหมด</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />สร้าง Program</Button>
      </div>

      <Input placeholder="ค้นหา program..." className="max-w-sm" />

      <div className="grid gap-4 md:grid-cols-2">
        {mockPrograms.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-cert-badge-bg flex items-center justify-center">
                  <Award className="h-5 w-5 text-cert-gold" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{p.code}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">Issued by {p.issuer}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.activeCerts.toLocaleString()} active</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
