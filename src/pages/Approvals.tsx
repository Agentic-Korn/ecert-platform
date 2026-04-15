import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Eye, Filter, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { ApprovalRequest } from "@/lib/types";

export default function Approvals() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppStore();

  const pendingItems = state.approvals.filter(a => a.status === "pending");

  const [selectedItem, setSelectedItem] = useState<ApprovalRequest | null>(null);
  const [approveItem, setApproveItem] = useState<ApprovalRequest | null>(null);
  const [rejectItem, setRejectItem] = useState<ApprovalRequest | null>(null);
  const [reason, setReason] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [bulkReason, setBulkReason] = useState("");

  const reviewer = state.currentUser?.name ?? "System";

  const toggleSelected = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const allChecked = pendingItems.length > 0 && pendingItems.every(i => selectedIds.has(i.id));
  const toggleAll = () => {
    if (allChecked) setSelectedIds(new Set());
    else setSelectedIds(new Set(pendingItems.map(i => i.id)));
  };

  const handleApprove = () => {
    if (!approveItem) return;
    dispatch({ type: "APPROVE_REQUEST", payload: { approvalId: approveItem.id, reviewedBy: reviewer } });
    toast.success(t("approvals.toastApproved", { holder: approveItem.holderName }), { description: approveItem.certNo });
    setApproveItem(null);
    setReason("");
  };

  const handleReject = () => {
    if (!rejectItem) return;
    dispatch({ type: "REJECT_REQUEST", payload: { approvalId: rejectItem.id, reviewedBy: reviewer, reason: reason.trim() } });
    toast.error(t("approvals.toastRejected", { holder: rejectItem.holderName }), { description: reason || t("approvals.noReason") });
    setRejectItem(null);
    setReason("");
  };

  const handleBulkApprove = () => {
    const ids = Array.from(selectedIds);
    dispatch({ type: "BULK_APPROVE", payload: { approvalIds: ids, reviewedBy: reviewer } });
    toast.success(t("approvals.bulkApprovedToast", { count: ids.length }));
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (!bulkReason.trim()) return;
    const ids = Array.from(selectedIds);
    dispatch({ type: "BULK_REJECT", payload: { approvalIds: ids, reviewedBy: reviewer, reason: bulkReason.trim() } });
    toast.error(t("approvals.bulkRejectedToast", { count: ids.length }));
    setSelectedIds(new Set());
    setBulkRejectOpen(false);
    setBulkReason("");
  };

  const handleAttach = (approvalId: string) => {
    const filename = `id-doc-${approvalId.slice(0, 6)}.pdf`;
    dispatch({ type: "ATTACH_DOC", payload: { approvalId, filename } });
    toast.success(t("approvals.docAttachedToast", { filename }));
    // refresh dialog item
    setSelectedItem(prev => prev ? { ...prev, attachedDoc: filename, identity: "verified" } : prev);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("approvals.title")}</h1>
          <p className="page-description">{t("approvals.subtitle", { count: pendingItems.length })}</p>
        </div>
        <Button variant="outline" onClick={() => toast.info(t("approvals.toastFiltered"))}><Filter className="h-4 w-4 mr-2" />{t("common.filter")}</Button>
      </div>

      {/* Bulk action bar */}
      {pendingItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-card/60 p-3" data-tour="bulk-approve">
          <Checkbox checked={allChecked} onCheckedChange={toggleAll} aria-label="select all" />
          <span className="text-sm text-muted-foreground">
            {selectedIds.size > 0
              ? t("approvals.nSelected", { count: selectedIds.size })
              : t("approvals.selectToBulk")}
          </span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              disabled={selectedIds.size === 0}
              onClick={() => { setBulkReason(""); setBulkRejectOpen(true); }}
            >
              <X className="h-4 w-4 mr-1" /> {t("approvals.rejectN", { count: selectedIds.size })}
            </Button>
            <Button
              size="sm"
              className="bg-success hover:bg-success/90 text-success-foreground"
              disabled={selectedIds.size === 0}
              onClick={handleBulkApprove}
            >
              <Check className="h-4 w-4 mr-1" /> {t("approvals.approveN", { count: selectedIds.size })}
            </Button>
          </div>
        </div>
      )}

      {pendingItems.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <Check className="h-10 w-10 mx-auto mb-3 text-success" />
          <p className="font-semibold">{t("approvals.noItems")}</p>
          <p className="text-sm mt-1">{t("approvals.allProcessed")}</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {pendingItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="mt-1.5"
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => toggleSelected(item.id)}
                    aria-label={`select ${item.holderName}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm">{item.holderName}</h3>
                      <Badge variant="outline" className="text-[10px] capitalize">{item.type}</Badge>
                      {item.identity === "verified" ? (
                        <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">{t("approvals.idVerified")}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">{t("approvals.idPending")}</Badge>
                      )}
                      {item.attachedDoc && (
                        <Badge variant="outline" className="text-[10px] bg-info/10 text-info border-info/30">
                          <Paperclip className="h-2.5 w-2.5 mr-1" /> {item.attachedDoc}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.programName} · {item.certNo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("approvals.submitted")} {item.submittedAt}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => { setRejectItem(item); setReason(""); }}><X className="h-4 w-4" /></Button>
                    <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => { setApproveItem(item); setReason(""); }}>
                      <Check className="h-4 w-4 mr-1" />{t("common.approve")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("approvals.requestDetails")}</DialogTitle>
            <DialogDescription>{t("approvals.requestDetailsDesc")}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">{t("approvals.fullName")}</p><p className="font-medium">{selectedItem.holderName}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("approvals.type")}</p><p className="font-medium capitalize">{selectedItem.type}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.program")}</p><p className="font-medium">{selectedItem.programName}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.certNo")}</p><p className="font-medium font-mono text-xs">{selectedItem.certNo}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("approvals.submitted")}</p><p className="font-medium">{selectedItem.submittedAt}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("certificates.idVerification")}</p>
                  {selectedItem.identity === "verified" ? (
                    <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">{t("approvals.idVerified")}</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">{t("approvals.idPending")}</Badge>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-dashed p-4 text-sm">
                <p className="font-medium mb-1 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" /> {t("approvals.attachedDocs")}
                </p>
                {selectedItem.attachedDoc ? (
                  <p className="text-xs text-success font-mono">✓ {selectedItem.attachedDoc}</p>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground mb-2">{t("approvals.attachedDocsDesc")}</p>
                    <Button size="sm" variant="outline" onClick={() => handleAttach(selectedItem.id)}>
                      <Paperclip className="h-4 w-4 mr-1.5" />{t("approvals.attachDemoDoc")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={!!approveItem} onOpenChange={() => setApproveItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("approvals.confirmApproval")}</DialogTitle>
            <DialogDescription>{t("approvals.confirmApprovalDesc", { holder: approveItem?.holderName })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>{t("approvals.notesOptional")}</Label>
            <Textarea placeholder={t("approvals.addNotes")} value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveItem(null)}>{t("common.cancel")}</Button>
            <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleApprove}>
              <Check className="h-4 w-4 mr-1" />{t("common.approve")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectItem} onOpenChange={() => setRejectItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("approvals.rejectRequest")}</DialogTitle>
            <DialogDescription>{t("approvals.rejectRequestDesc", { holder: rejectItem?.holderName })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>{t("approvals.rejectReason")}</Label>
            <Textarea placeholder={t("approvals.stateReason")} value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectItem(null)}>{t("common.cancel")}</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!reason.trim()}>
              <X className="h-4 w-4 mr-1" />{t("common.reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={bulkRejectOpen} onOpenChange={setBulkRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("approvals.bulkRejectTitle", { count: selectedIds.size })}</DialogTitle>
            <DialogDescription>{t("approvals.bulkRejectDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>{t("approvals.sharedReason")}</Label>
            <Textarea placeholder={t("approvals.stateReason")} value={bulkReason} onChange={e => setBulkReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkRejectOpen(false)}>{t("common.cancel")}</Button>
            <Button variant="destructive" onClick={handleBulkReject} disabled={!bulkReason.trim()}>
              <X className="h-4 w-4 mr-1" />{t("approvals.rejectN", { count: selectedIds.size })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
