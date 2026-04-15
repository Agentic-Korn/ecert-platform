import { createContext, useContext, useReducer, type ReactNode } from "react";
import type {
  Certificate,
  ApprovalRequest,
  Course,
  Enrollment,
  User,
  AuthSession,
  VerifyLog,
  AuditEntry,
  Program,
} from "./types";
import {
  mockCertificates,
  mockApprovals,
  mockCourses,
  mockUsers,
  mockLogs,
  mockPrograms,
  mockEnrollmentsSeed,
  mockVerifyLogsSeed,
} from "./mockData";

// --- Utility ---
function genId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function genCertNo(programCode: string): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  return `${programCode}-${year}-${seq}`;
}

function addDuration(from: string, duration: string): string {
  const d = new Date(from);
  const match = duration.match(/(\d+)\s*(year|month|day)/i);
  if (match) {
    const n = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    if (unit.startsWith("year")) d.setFullYear(d.getFullYear() + n);
    else if (unit.startsWith("month")) d.setMonth(d.getMonth() + n);
    else d.setDate(d.getDate() + n);
  }
  return d.toISOString().split("T")[0];
}

// --- State ---
export interface AppState {
  programs: Program[];
  certificates: Certificate[];
  approvals: ApprovalRequest[];
  courses: Course[];
  enrollments: Enrollment[];
  users: User[];
  currentUser: AuthSession | null;
  verifyLogs: VerifyLog[];
  auditLog: AuditEntry[];
}

// --- Seed initial state from mockData ---
const seedCertificates: Certificate[] = mockCertificates.map((c) => ({
  id: c.id,
  certNo: c.certNo,
  holderId: c.holder === "สมชาย ใจดี" ? "4" : c.id,
  holderName: c.holder,
  holderEmail: c.holder === "สมชาย ใจดี" ? "somchai@gmail.com" : `user${c.id}@ecert.th`,
  programId: String(mockPrograms.findIndex((p) => c.program.includes(p.code) || p.name.includes(c.program)) + 1 || "1"),
  programName: c.program,
  status: c.status,
  issuedAt: c.issuedAt,
  expiresAt: c.expiresAt,
  createdAt: c.issuedAt || new Date().toISOString().split("T")[0],
}));

const seedApprovals: ApprovalRequest[] = mockApprovals.map((a) => ({
  id: a.id,
  certNo: a.certNo,
  holderId: genId(),
  holderName: a.holder,
  programId: "1",
  programName: a.program,
  type: a.type,
  status: "pending" as const,
  submittedAt: a.submittedAt,
  identity: a.identity as "verified" | "pending",
}));

const seedCourses: Course[] = mockCourses.map((c) => ({
  id: c.id,
  name: c.name,
  programId: String(mockPrograms.findIndex((p) => p.name.includes(c.program) || c.program.includes(p.code)) + 1 || "1"),
  programName: c.program,
  sessions: c.sessions,
  enrolled: c.enrolled,
  capacity: c.capacity,
  status: c.status,
  startDate: c.startDate,
}));

const seedUsers: User[] = mockUsers.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role.toLowerCase().replace("super ", "") as "admin" | "approver" | "trainer" | "holder",
  status: u.status,
  lastLogin: u.lastLogin,
}));

const seedAuditLog: AuditEntry[] = mockLogs.map((l) => ({
  id: l.id,
  action: l.action,
  actor: l.actor,
  target: l.target,
  timestamp: l.timestamp,
  ip: l.ip,
}));

export const initialState: AppState = {
  programs: mockPrograms as Program[],
  certificates: seedCertificates,
  approvals: seedApprovals,
  courses: seedCourses,
  enrollments: mockEnrollmentsSeed.map((e) => ({
    id: e.id,
    courseId: e.courseId,
    holderId: e.id,
    holderName: e.holderName,
    holderEmail: e.holderEmail,
    enrolledAt: e.enrolledAt,
    attended: e.attended,
  })),
  users: seedUsers,
  currentUser: null,
  verifyLogs: mockVerifyLogsSeed,
  auditLog: seedAuditLog,
};

// --- Actions ---
export type AppAction =
  | { type: "LOGIN"; payload: AuthSession }
  | { type: "LOGOUT" }
  | { type: "ISSUE_CERT"; payload: { holderName: string; holderEmail: string; programId: string; programName: string; identity: "verified" | "pending" } }
  | { type: "APPROVE_REQUEST"; payload: { approvalId: string; reviewedBy: string } }
  | { type: "REJECT_REQUEST"; payload: { approvalId: string; reviewedBy: string; reason: string } }
  | { type: "SUBMIT_RENEWAL"; payload: { certId: string; certNo: string; holderId: string; holderName: string; programName: string } }
  | { type: "ENROLL_STUDENT"; payload: { courseId: string; holderName: string; holderEmail: string } }
  | { type: "MARK_ATTENDANCE"; payload: { enrollmentId: string } }
  | { type: "COMPLETE_COURSE"; payload: { courseId: string } }
  | { type: "LOG_VERIFY"; payload: { certNo: string } }
  | { type: "SET_LANGUAGE"; payload: string };

// --- Reducer ---
export function appReducer(state: AppState, action: AppAction): AppState {
  const now = new Date().toISOString().split("T")[0];
  const actor = state.currentUser?.name ?? "System";

  function addAudit(s: AppState, logAction: string, target: string): AuditEntry[] {
    return [...s.auditLog, { id: genId(), action: logAction, actor, target, timestamp: new Date().toISOString().replace("T", " ").substring(0, 16), ip: "—" }];
  }

  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };

    case "LOGOUT":
      return { ...state, currentUser: null };

    case "ISSUE_CERT": {
      const { holderName, holderEmail, programId, programName, identity } = action.payload;
      const program = state.programs.find((p) => p.id === programId);
      const draftCertNo = `DRAFT-${Date.now()}`;
      const newCert: Certificate = {
        id: genId(),
        certNo: draftCertNo,
        holderId: genId(),
        holderName,
        holderEmail,
        programId,
        programName,
        status: "pending",
        issuedAt: "",
        expiresAt: "",
        createdAt: now,
      };
      const newApproval: ApprovalRequest = {
        id: genId(),
        certNo: draftCertNo,
        holderId: newCert.holderId,
        holderName,
        programId,
        programName: program?.name ?? programName,
        type: "issue",
        status: "pending",
        submittedAt: now,
        identity,
      };
      return {
        ...state,
        certificates: [...state.certificates, newCert],
        approvals: [...state.approvals, newApproval],
        auditLog: addAudit(state, "Certificate Draft Created", draftCertNo),
      };
    }

    case "APPROVE_REQUEST": {
      const { approvalId, reviewedBy } = action.payload;
      const approval = state.approvals.find((a) => a.id === approvalId);
      if (!approval) return state;

      const program = state.programs.find((p) => p.id === approval.programId || p.name === approval.programName);
      const programCode = program?.code ?? "ECRT";
      const duration = program?.duration ?? "2 years";
      const realCertNo = genCertNo(programCode);

      const updatedApprovals = state.approvals.map((a) =>
        a.id === approvalId ? { ...a, status: "approved" as const, reviewedAt: now, reviewedBy } : a
      );

      let updatedCerts: Certificate[];
      if (approval.type === "extend") {
        updatedCerts = state.certificates.map((c) =>
          c.certNo === approval.certNo
            ? { ...c, status: "active" as const, expiresAt: addDuration(c.expiresAt || now, duration) }
            : c
        );
      } else {
        updatedCerts = state.certificates.map((c) =>
          c.certNo === approval.certNo
            ? { ...c, certNo: realCertNo, status: "active" as const, issuedAt: now, expiresAt: addDuration(now, duration), approvedBy: reviewedBy }
            : c
        );
      }

      return {
        ...state,
        approvals: updatedApprovals,
        certificates: updatedCerts,
        auditLog: addAudit(state, approval.type === "extend" ? "Certificate Extended" : "Certificate Approved", realCertNo),
      };
    }

    case "REJECT_REQUEST": {
      const { approvalId, reviewedBy, reason } = action.payload;
      const approval = state.approvals.find((a) => a.id === approvalId);
      if (!approval) return state;

      const updatedApprovals = state.approvals.map((a) =>
        a.id === approvalId ? { ...a, status: "rejected" as const, reviewedAt: now, reviewedBy, reason } : a
      );
      const updatedCerts = state.certificates.map((c) =>
        c.certNo === approval.certNo ? { ...c, status: "rejected" as const } : c
      );

      return {
        ...state,
        approvals: updatedApprovals,
        certificates: updatedCerts,
        auditLog: addAudit(state, "Request Rejected", approval.certNo),
      };
    }

    case "SUBMIT_RENEWAL": {
      const { certNo, holderId, holderName, programName } = action.payload;
      const cert = state.certificates.find((c) => c.certNo === certNo);
      const newApproval: ApprovalRequest = {
        id: genId(),
        certNo,
        holderId,
        holderName,
        programId: cert?.programId ?? "1",
        programName,
        type: "extend",
        status: "pending",
        submittedAt: now,
        identity: "verified",
      };
      return {
        ...state,
        approvals: [...state.approvals, newApproval],
        auditLog: addAudit(state, "Renewal Requested", certNo),
      };
    }

    case "ENROLL_STUDENT": {
      const { courseId, holderName, holderEmail } = action.payload;
      const newEnrollment: Enrollment = {
        id: genId(),
        courseId,
        holderId: genId(),
        holderName,
        holderEmail,
        enrolledAt: now,
        attended: false,
      };
      const updatedCourses = state.courses.map((c) =>
        c.id === courseId ? { ...c, enrolled: c.enrolled + 1 } : c
      );
      return {
        ...state,
        enrollments: [...state.enrollments, newEnrollment],
        courses: updatedCourses,
        auditLog: addAudit(state, "Student Enrolled", `${holderName} → ${courseId}`),
      };
    }

    case "MARK_ATTENDANCE": {
      const { enrollmentId } = action.payload;
      return {
        ...state,
        enrollments: state.enrollments.map((e) =>
          e.id === enrollmentId ? { ...e, attended: true } : e
        ),
      };
    }

    case "COMPLETE_COURSE": {
      const { courseId } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (!course) return state;

      const attendedStudents = state.enrollments.filter((e) => e.courseId === courseId && e.attended);
      const program = state.programs.find((p) => p.id === course.programId || p.name === course.programName);

      const newCerts: Certificate[] = attendedStudents.map((e) => ({
        id: genId(),
        certNo: `DRAFT-${Date.now()}-${e.holderId}`,
        holderId: e.holderId,
        holderName: e.holderName,
        holderEmail: e.holderEmail,
        programId: course.programId,
        programName: program?.name ?? course.programName,
        status: "pending" as const,
        issuedAt: "",
        expiresAt: "",
        createdAt: now,
      }));

      const newApprovals: ApprovalRequest[] = newCerts.map((c) => ({
        id: genId(),
        certNo: c.certNo,
        holderId: c.holderId,
        holderName: c.holderName,
        programId: c.programId,
        programName: c.programName,
        type: "issue" as const,
        status: "pending" as const,
        submittedAt: now,
        identity: "verified" as const,
      }));

      return {
        ...state,
        courses: state.courses.map((c) => (c.id === courseId ? { ...c, status: "completed" as const } : c)),
        certificates: [...state.certificates, ...newCerts],
        approvals: [...state.approvals, ...newApprovals],
        auditLog: addAudit(state, "Course Completed", `${course.name} — ${attendedStudents.length} certs issued`),
      };
    }

    case "LOG_VERIFY": {
      return {
        ...state,
        verifyLogs: [...state.verifyLogs, { id: genId(), certNo: action.payload.certNo, queriedAt: new Date().toISOString() }],
        auditLog: addAudit(state, "Verify API Call", action.payload.certNo),
      };
    }

    case "SET_LANGUAGE":
      return state; // Language is handled by i18next, not store state

    default:
      return state;
  }
}

// --- Context ---
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
