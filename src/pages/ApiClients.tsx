import { mockApiClients } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Key, Copy, BarChart3 } from "lucide-react";

export default function ApiClients() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">API Clients & Keys</h1>
          <p className="page-description">จัดการ API keys สำหรับ Verify API</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />สร้าง API Client</Button>
      </div>

      <div className="space-y-4">
        {mockApiClients.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{client.name}</h3>
                      <StatusBadge status={client.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{client.apiKey}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Created: {client.created}</span>
                      <span>Last used: {client.lastUsed}</span>
                      <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{client.requests.toLocaleString()} requests</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
            <p className="text-muted-foreground"># Verify a certificate</p>
            <p>GET /v1/verify?cert_no=TMPSA-2026-000123</p>
            <p className="text-muted-foreground mt-3"># Verify by token</p>
            <p>GET /v1/verify/token/&#123;token&#125;</p>
            <p className="text-muted-foreground mt-3"># Response</p>
            <p>&#123; "status": "active", "program_code": "EMT-P", "expires_at": "2027-06-15", "holder_display": "สม*** ใ***" &#125;</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
