import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Award, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Program } from "@/lib/types";

export default function Programs() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppStore();

  const [selected, setSelected] = useState<Program | null>(null);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  // Create form
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [issuer, setIssuer] = useState("TMPSA");
  const [duration, setDuration] = useState("2 years");
  const [template, setTemplate] = useState("Bronze Badge");

  const filtered = state.programs.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!name.trim() || !code.trim()) return;
    dispatch({
      type: "CREATE_PROGRAM",
      payload: { name: name.trim(), code: code.trim().toUpperCase(), issuer, duration, template },
    });
    toast.success(t("programs.createdToast", { name }));
    setCreateOpen(false);
    setName(""); setCode(""); setIssuer("TMPSA"); setDuration("2 years"); setTemplate("Bronze Badge");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("programs.title")}</h1>
          <p className="page-description">{t("programs.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />{t("programs.createProgram")}</Button>
      </div>

      <Input placeholder={t("programs.searchPlaceholder")} className="max-w-sm" value={search} onChange={e => setSearch(e.target.value)} />

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(p)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-cert-badge-bg flex items-center justify-center">
                  <Award className="h-5 w-5 text-cert-gold" />
                </div>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{p.code}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{t("programs.issuedBy")} {p.issuer}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.activeCerts.toLocaleString()} {t("programs.activeSuffix")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("programs.details")}</DialogTitle>
            <DialogDescription>{selected?.code} — {selected?.issuer}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("programs.programName")}</Label><Input defaultValue={selected.name} /></div>
                <div className="space-y-2"><Label>{t("programs.code")}</Label><Input defaultValue={selected.code} className="font-mono" /></div>
                <div className="space-y-2"><Label>{t("programs.issuer")}</Label><Input defaultValue={selected.issuer} /></div>
                <div className="space-y-2"><Label>{t("programs.duration")}</Label><Input defaultValue={selected.duration} /></div>
                <div className="space-y-2"><Label>{t("programs.certNoFormat")}</Label><Input defaultValue={`${selected.code}-{YYYY}-{SEQ:6}`} className="font-mono text-xs" /></div>
                <div className="space-y-2"><Label>{t("programs.badgeTemplate")}</Label><Input defaultValue={selected.template} /></div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="font-medium mb-1">{t("programs.renewalRules")}</p>
                <p className="text-xs text-muted-foreground">Auto-notify 30 days before expiry · Requires re-training if expired &gt; 6 months · Approver review required</p>
              </div>
              <div className="text-sm text-muted-foreground">{t("programs.activeCertificates")} <span className="font-bold text-foreground">{selected.activeCerts.toLocaleString()}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>{t("common.close")}</Button>
            <Button onClick={() => { toast.success(t("programs.toastSaved")); setSelected(null); }}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("programs.createProgram")}</DialogTitle>
            <DialogDescription>{t("programs.createDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>{t("programs.programName")}</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="EMT-Intermediate Certification" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{t("programs.code")}</Label><Input value={code} onChange={e => setCode(e.target.value)} placeholder="EMT-I" className="font-mono" /></div>
              <div className="space-y-1.5"><Label>{t("programs.issuer")}</Label><Input value={issuer} onChange={e => setIssuer(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{t("programs.duration")}</Label><Input value={duration} onChange={e => setDuration(e.target.value)} placeholder="2 years" /></div>
              <div className="space-y-1.5"><Label>{t("programs.badgeTemplate")}</Label><Input value={template} onChange={e => setTemplate(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || !code.trim()}>{t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
