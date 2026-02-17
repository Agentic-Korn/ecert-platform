import { mockEvents } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MapPin, Users, Tag, Calendar } from "lucide-react";

export default function Events() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-description">จัดการงานอีเวนต์และส่วนลดตามใบรับรอง</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />สร้าง Event</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
    </div>
  );
}
