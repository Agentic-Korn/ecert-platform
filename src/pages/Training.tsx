import { mockCourses } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Users, Calendar, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function Training() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Training Courses</h1>
          <p className="page-description">จัดการคอร์สอบรมและรอบการเรียน</p>
        </div>
        <Button onClick={() => toast.info("สร้าง Course ใหม่ (Demo)")}><Plus className="h-4 w-4 mr-2" />สร้าง Course</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info(`เปิดรายละเอียด: ${course.name}`)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <StatusBadge status={course.status} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{course.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">Program: {course.program}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Enrollment</span>
                  <span className="font-medium">{course.enrolled}/{course.capacity}</span>
                </div>
                <Progress value={(course.enrolled / course.capacity) * 100} className="h-1.5" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{course.startDate}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.sessions} sessions</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
