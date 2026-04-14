import { useState } from "react";
import { useTranslation } from "react-i18next";
import { mockEvents } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MapPin, Users, Tag, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type EventItem = typeof mockEvents[0];

export default function Events() {
  const [selected, setSelected] = useState<EventItem | null>(null);
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("events.title")}</h1>
          <p className="page-description">{t("events.subtitle")}</p>
        </div>
        <Button onClick={() => toast.info(t("events.toastCreate"))}><Plus className="h-4 w-4 mr-2" />{t("events.createEvent")}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(event)}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-2">{event.name}</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{event.date}</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</p>
                <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{event.attendees} attendees · {event.organizer}</p>
                <p className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />{event.discountRules} discount rules</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("events.details")}</DialogTitle>
            <DialogDescription>{selected?.organizer}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("events.eventName")}</Label><Input defaultValue={selected.name} /></div>
                <div className="space-y-2"><Label>{t("events.date")}</Label><Input defaultValue={selected.date} /></div>
                <div className="space-y-2"><Label>{t("events.location")}</Label><Input defaultValue={selected.location} /></div>
                <div className="space-y-2"><Label>{t("events.organizer")}</Label><Input defaultValue={selected.organizer} /></div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">{t("events.discountRulesTitle", { count: selected.discountRules })}</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium">EMT-P Certified → 30% off</p>
                    <p className="text-xs text-muted-foreground">ผู้ถือใบรับรอง EMT-Paramedic ที่ยังไม่หมดอายุ</p>
                  </div>
                  {selected.discountRules > 1 && (
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      <p className="font-medium">AFR Certified → 20% off</p>
                      <p className="text-xs text-muted-foreground">ผู้ถือใบรับรอง Advanced First Responder</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {t("events.registeredAttendees")} <span className="font-bold text-foreground">{selected.attendees}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>{t("common.close")}</Button>
            <Button onClick={() => { toast.success(t("events.toastSaved")); setSelected(null); }}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
