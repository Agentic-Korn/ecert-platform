// eCert Platform — Core TypeScript Interfaces

export type CertStatus = "active" | "pending" | "expired" | "revoked" | "rejected";
export type ApprovalType = "issue" | "extend" | "revoke";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type CourseStatus = "open" | "closed" | "completed";
export type UserRole = "admin" | "approver" | "trainer" | "holder";
export type IdentityStatus = "verified" | "pending";

export interface Certificate {
  id: string;
  certNo: string;
  holderId: string;
  holderName: string;
  holderEmail: string;
  programId: string;
  programName: string;
  status: CertStatus;
  issuedAt: string;
  expiresAt: string;
  createdAt: string;
  approvedBy?: string;
}

export interface ApprovalRequest {
  id: string;
  certNo: string;
  holderId: string;
  holderName: string;
  programId: string;
  programName: string;
  type: ApprovalType;
  status: ApprovalStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reason?: string;
  identity: IdentityStatus;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  issuer: string;
  duration: string;
  activeCerts: number;
  template: string;
}

export interface Course {
  id: string;
  name: string;
  programId: string;
  programName: string;
  sessions: number;
  enrolled: number;
  capacity: number;
  status: CourseStatus;
  startDate: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  holderId: string;
  holderName: string;
  holderEmail: string;
  enrolledAt: string;
  attended: boolean;
  assessmentPassed?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface VerifyLog {
  id: string;
  certNo: string;
  queriedAt: string;
  ip?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  ip?: string;
}

export interface ApiClient {
  id: string;
  name: string;
  apiKey: string;
  created: string;
  lastUsed: string;
  requests: number;
  status: "active" | "inactive";
}

export interface MessageStats {
  id: string;
  template: string;
  channel: string;
  sent: number;
  opened: number;
  clicked: number;
  lastSent: string;
}

export interface EventRecord {
  id: string;
  name: string;
  organizer: string;
  date: string;
  location: string;
  attendees: number;
  discountRules: number;
}
