import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Calendar, BookOpen, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Course } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Training() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppStore();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollName, setEnrollName] = useState("");
  const [enrollEmail, setEnrollEmail] = useState("");

  // Create course form
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProgramId, setNewProgramId] = useState("");
  const [newCapacity, setNewCapacity] = useState(30);
  const [newSessions, setNewSessions] = useState(2);
  const [newStartDate, setNewStartDate] = useState("2026-06-01");

  const handleCreateCourse = () => {
    if (!newName.trim() || !newProgramId) return;
    dispatch({
      type: "CREATE_COURSE",
      payload: { name: newName.trim(), programId: newProgramId, capacity: newCapacity, sessions: newSessions, startDate: newStartDate },
    });
    toast.success(t("training.createdToast", { name: newName }));
    setCreateOpen(false);
    setNewName(""); setNewProgramId(""); setNewCapacity(30); setNewSessions(2); setNewStartDate("2026-06-01");
  };

  const handleEnroll = () => {
    if (!selectedCourse || !enrollName.trim() || !enrollEmail.trim()) return;
    dispatch({
      type: "ENROLL_STUDENT",
      payload: { courseId: selectedCourse.id, holderName: enrollName.trim(), holderEmail: enrollEmail.trim() },
    });
    toast.success(t("training.addStudent"), { description: enrollName });
    setEnrollName("");
    setEnrollEmail("");
  };

  const handleCompleteCourse = () => {
    if (!selectedCourse) return;
    const attendedCount = courseEnrollments.filter(e => e.attended).length;
    dispatch({ type: "COMPLETE_COURSE", payload: { courseId: selectedCourse.id } });
    toast.success(t("training.courseCompleted"), { description: `${attendedCount} ${t("certificates.title").toLowerCase()}` });
    // Refresh the selected course from state
    setSelectedCourse(prev => prev ? { ...prev, status: "completed" } : null);
  };

  const courseEnrollments = selectedCourse
    ? state.enrollments.filter(e => e.courseId === selectedCourse.id)
    : [];

  // Get updated course from store for the sheet
  const currentCourse = selectedCourse
    ? state.courses.find(c => c.id === selectedCourse.id) ?? selectedCourse
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">{t("training.title")}</h1>
          <p className="page-description">{t("training.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" />{t("training.createCourse")}</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCourse(course)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <StatusBadge status={course.status} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{course.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{t("training.program")} {course.programName}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t("training.enrollment")}</span>
                  <span className="font-medium">{course.enrolled}/{course.capacity}</span>
                </div>
                <Progress value={(course.enrolled / course.capacity) * 100} className="h-1.5" />
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{course.startDate}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{t("training.sessions", { count: course.sessions })}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Detail Sheet */}
      <Sheet open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("training.courseDetail")}</SheetTitle>
            <SheetDescription>{currentCourse?.name}</SheetDescription>
          </SheetHeader>

          {currentCourse && (
            <div className="space-y-6 mt-6">
              {/* Course Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">{t("certificates.program")}</p>
                  <p className="font-medium">{currentCourse.programName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("certificates.status")}</p>
                  <StatusBadge status={currentCourse.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("training.enrollment")}</p>
                  <p className="font-medium">{currentCourse.enrolled}/{currentCourse.capacity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("events.date")}</p>
                  <p className="font-medium">{currentCourse.startDate}</p>
                </div>
              </div>

              <Progress value={(currentCourse.enrolled / currentCourse.capacity) * 100} className="h-2" />

              {/* Enrollment List */}
              <div>
                <h3 className="text-sm font-semibold mb-3">{t("training.enrollmentList")}</h3>
                {courseEnrollments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{t("training.noEnrollments")}</p>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("users.name")}</TableHead>
                          <TableHead>{t("users.email")}</TableHead>
                          <TableHead className="w-24">{t("training.markAttendance")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courseEnrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium text-sm">{enrollment.holderName}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{enrollment.holderEmail}</TableCell>
                            <TableCell>
                              {enrollment.attended ? (
                                <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30">
                                  <Check className="h-3 w-3 mr-1" />{t("training.attended")}
                                </Badge>
                              ) : currentCourse.status !== "completed" ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => dispatch({ type: "MARK_ATTENDANCE", payload: { enrollmentId: enrollment.id } })}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                  <X className="h-3 w-3 mr-1" />{t("training.notAttended")}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Enroll Student Form */}
              {currentCourse.status === "open" && (
                <div className="space-y-3 rounded-lg border p-4">
                  <h3 className="text-sm font-semibold">{t("training.enrollStudent")}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{t("training.studentName")}</Label>
                      <Input
                        placeholder={t("training.studentName")}
                        value={enrollName}
                        onChange={e => setEnrollName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("training.studentEmail")}</Label>
                      <Input
                        type="email"
                        placeholder={t("training.studentEmail")}
                        value={enrollEmail}
                        onChange={e => setEnrollEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleEnroll}
                    disabled={!enrollName.trim() || !enrollEmail.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />{t("training.addStudent")}
                  </Button>
                </div>
              )}

              {/* Complete Course Button */}
              {currentCourse.status === "open" && courseEnrollments.some(e => e.attended) && (
                <Button className="w-full" onClick={handleCompleteCourse}>
                  {t("training.completeCourse")}
                </Button>
              )}

              {currentCourse.status === "completed" && (
                <div className="rounded-lg bg-success/10 border border-success/30 p-3 text-sm text-success text-center font-medium">
                  <Check className="h-4 w-4 inline mr-1.5" />{t("training.courseCompleted")}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Course Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("training.createCourse")}</DialogTitle>
            <DialogDescription>{t("training.createDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>{t("training.courseName")}</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="EMT-Basic Summer 2026" /></div>
            <div className="space-y-1.5">
              <Label>{t("certificates.program")}</Label>
              <Select value={newProgramId} onValueChange={setNewProgramId}>
                <SelectTrigger><SelectValue placeholder={t("certificates.program")} /></SelectTrigger>
                <SelectContent>
                  {state.programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>{t("training.capacity")}</Label><Input type="number" value={newCapacity} onChange={e => setNewCapacity(parseInt(e.target.value || "0"))} /></div>
              <div className="space-y-1.5"><Label>{t("training.sessionsLabel")}</Label><Input type="number" value={newSessions} onChange={e => setNewSessions(parseInt(e.target.value || "0"))} /></div>
              <div className="space-y-1.5"><Label>{t("events.date")}</Label><Input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateCourse} disabled={!newName.trim() || !newProgramId}>{t("common.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
