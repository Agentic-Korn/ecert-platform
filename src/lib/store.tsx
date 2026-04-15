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
import type { ApiClient } from "./types";
import {
  mockCertificates,
  mockApprovals,
  mockCourses,
  mockUsers,
  mockLogs,
  mockPrograms,
  mockEnrollmentsSeed,
  mockVerifyLogsSeed,
  mockApiClients,
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
  apiClients: ApiClient[];
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

function buildInitialState(): AppState {
  return {
    programs: mockPrograms.map((p) => ({ ...p })) as Program[],
    certificates: seedCertificates.map((c) => ({ ...c })),
    approvals: seedApprovals.map((a) => ({ ...a })),
    courses: seedCourses.map((c) => ({ ...c })),
    enrollments: mockEnrollmentsSeed.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      holderId: e.id,
      holderName: e.holderName,
      holderEmail: e.holderEmail,
      enrolledAt: e.enrolledAt,
      attended: e.attended,
    })),
    users: seedUsers.map((u) => ({ ...u })),
    apiClients: mockApiClients.map((c) => ({ ...c })),
    currentUser: null,
    verifyLogs: mockVerifyLogsSeed.map((l) => ({ ...l })),
    auditLog: seedAuditLog.map((a) => ({ ...a })),
  };
}

export const initialState: AppState = buildInitialState();

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
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "BULK_APPROVE"; payload: { approvalIds: string[]; reviewedBy: string } }
  | { type: "BULK_REJECT"; payload: { approvalIds: string[]; reviewedBy: string; reason: string } }
  | { type: "ATTACH_DOC"; payload: { approvalId: string; filename: string } }
  | { type: "RESET_DEMO" }
  | { type: "CREATE_PROGRAM"; payload: { name: string; code: string; issuer: string; duration: string; template: string } }
  | { type: "CREATE_COURSE"; payload: { name: string; programId: string; capacity: number; sessions: number; startDate: string } }
  | { type: "CREATE_USER"; payload: { name: string; email: string; role: "admin" | "approver" | "trainer" | "holder" } }
  | { type: "CREATE_API_CLIENT"; payload: { name: string } };

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

    case "BULK_APPROVE": {
      const { approvalIds, reviewedBy } = action.payload;
      let workingState = state;
      for (const id of approvalIds) {
        workingState = appReducer(workingState, { type: "APPROVE_REQUEST", payload: { approvalId: id, reviewedBy } });
      }
      return {
        ...workingState,
        auditLog: addAudit(workingState, "Bulk Approval", `${approvalIds.length} requests`),
      };
    }

    case "BULK_REJECT": {
      const { approvalIds, reviewedBy, reason } = action.payload;
      let workingState = state;
      for (const id of approvalIds) {
        workingState = appReducer(workingState, { type: "REJECT_REQUEST", payload: { approvalId: id, reviewedBy, reason } });
      }
      return {
        ...workingState,
        auditLog: addAudit(workingState, "Bulk Rejection", `${approvalIds.length} requests`),
      };
    }

    case "ATTACH_DOC": {
      const { approvalId, filename } = action.payload;
      return {
        ...state,
        approvals: state.approvals.map((a) =>
          a.id === approvalId ? { ...a, attachedDoc: filename, identity: "verified" as const } : a
        ),
        auditLog: addAudit(state, "Document Attached", `${approvalId} → ${filename}`),
      };
    }

    case "RESET_DEMO": {
      const fresh = buildInitialState();
      // Preserve current login session through reset
      return { ...fresh, currentUser: state.currentUser };
    }

    case "CREATE_PROGRAM": {
      const { name, code, issuer, duration, template } = action.payload;
      const newProgram: Program = {
        id: genId(),
        name,
        code,
        issuer,
        duration,
        activeCerts: 0,
        template,
      };
      return {
        ...state,
        programs: [...state.programs, newProgram],
        auditLog: addAudit(state, "Program Created", `${name} (${code})`),
      };
    }

    case "CREATE_COURSE": {
      const { name, programId, capacity, sessions, startDate } = action.payload;
      const program = state.programs.find((p) => p.id === programId);
      const newCourse: Course = {
        id: genId(),
        name,
        programId,
        programName: program?.name ?? "",
        sessions,
        enrolled: 0,
        capacity,
        status: "open",
        startDate,
      };
      return {
        ...state,
        courses: [...state.courses, newCourse],
        auditLog: addAudit(state, "Course Created", name),
      };
    }

    case "CREATE_USER": {
      const { name, email, role } = action.payload;
      const newUser: User = {
        id: genId(),
        name,
        email,
        role,
        status: "active",
        lastLogin: "—",
      };
      return {
        ...state,
        users: [...state.users, newUser],
        auditLog: addAudit(state, "User Created", `${name} (${role})`),
      };
    }

    case "CREATE_API_CLIENT": {
      const { name } = action.payload;
      const key = "eCrt_demo_" + Math.random().toString(36).substring(2, 14);
      const newClient: ApiClient = {
        id: genId(),
        name,
        apiKey: key,
        created: now,
        lastUsed: "—",
        requests: 0,
        status: "active",
      };
      return {
        ...state,
        apiClients: [...state.apiClients, newClient],
        auditLog: addAudit(state, "API Key Issued", name),
      };
    }

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
