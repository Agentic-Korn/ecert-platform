import { mockApprovals } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Eye, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Approvals() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Approval Inbox</h1>
          <p className="page-description">คำขอใบรับรองที่รออนุมัติ ({mockApprovals.length} รายการ)</p>
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button>
      </div>

      <div className="space-y-3">
        {mockApprovals.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{item.holder}</h3>
                    <Badge variant="outline" className="text-[10px] capitalize">{item.type}</Badge>
                    {item.identity === "verified" ? (
                      <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">ID Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">ID Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.program} · {item.certNo}</p>
                  <p className="text-xs text-muted-foreground mt-1">Submitted: {item.submittedAt}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><X className="h-4 w-4" /></Button>
                  <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground"><Check className="h-4 w-4 mr-1" />Approve</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
