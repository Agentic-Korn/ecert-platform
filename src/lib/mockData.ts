export const mockPrograms = [
  { id: "1", name: "EMT-Paramedic Certification", code: "EMT-P", issuer: "TMPSA", duration: "2 years", activeCerts: 1243, template: "Gold Badge" },
  { id: "2", name: "Advanced First Responder", code: "AFR", issuer: "สพฉ", duration: "1 year", activeCerts: 892, template: "Silver Badge" },
  { id: "3", name: "Emergency Medical Technician", code: "EMT-B", issuer: "TMPSA", duration: "2 years", activeCerts: 3421, template: "Bronze Badge" },
  { id: "4", name: "Disaster Response Specialist", code: "DRS", issuer: "สพฉ", duration: "3 years", activeCerts: 156, template: "Platinum Badge" },
];

export const mockCertificates = [
  { id: "1", certNo: "TMPSA-2026-000123", holder: "สมชาย ใจดี", program: "EMT-Paramedic", status: "active" as const, issuedAt: "2025-06-15", expiresAt: "2027-06-15" },
  { id: "2", certNo: "TMPSA-2026-000124", holder: "สมหญิง รักดี", program: "EMT-Paramedic", status: "active" as const, issuedAt: "2025-07-01", expiresAt: "2027-07-01" },
  { id: "3", certNo: "SPCH-2025-000456", holder: "วิชัย สุขสันต์", program: "Advanced First Responder", status: "expired" as const, issuedAt: "2024-01-10", expiresAt: "2025-01-10" },
  { id: "4", certNo: "TMPSA-2026-000125", holder: "นภา แสงทอง", program: "EMT-Basic", status: "pending" as const, issuedAt: "", expiresAt: "" },
  { id: "5", certNo: "SPCH-2026-000789", holder: "ธนา พงศ์ไพร", program: "Disaster Response", status: "revoked" as const, issuedAt: "2025-03-20", expiresAt: "2028-03-20" },
];

export const mockApprovals = [
  { id: "1", certNo: "TMPSA-2026-000125", holder: "นภา แสงทอง", program: "EMT-Paramedic", type: "issue" as const, submittedAt: "2026-02-15", identity: "verified" },
  { id: "2", certNo: "SPCH-2026-000457", holder: "ปรีชา มั่นคง", program: "Advanced First Responder", type: "extend" as const, submittedAt: "2026-02-14", identity: "verified" },
  { id: "3", certNo: "TMPSA-2026-000126", holder: "จิราภรณ์ ดีงาม", program: "EMT-Basic", type: "issue" as const, submittedAt: "2026-02-13", identity: "pending" },
  { id: "4", certNo: "SPCH-2026-000458", holder: "อรรถพล วิเศษ", program: "Disaster Response", type: "issue" as const, submittedAt: "2026-02-12", identity: "verified" },
];

export const mockCourses = [
  { id: "1", name: "EMT Paramedic Training 2026", program: "EMT-Paramedic", sessions: 3, enrolled: 45, capacity: 60, status: "open" as const, startDate: "2026-03-01" },
  { id: "2", name: "Advanced First Aid Refresher", program: "Advanced First Responder", sessions: 2, enrolled: 30, capacity: 30, status: "closed" as const, startDate: "2026-02-20" },
  { id: "3", name: "Disaster Response Workshop", program: "Disaster Response", sessions: 1, enrolled: 12, capacity: 25, status: "open" as const, startDate: "2026-04-15" },
];

export const mockEvents = [
  { id: "1", name: "Thailand EMS Conference 2026", organizer: "TMPSA", date: "2026-05-15", location: "Bangkok Convention Center", attendees: 500, discountRules: 2 },
  { id: "2", name: "Regional First Responder Summit", organizer: "สพฉ", date: "2026-06-20", location: "Chiang Mai", attendees: 200, discountRules: 1 },
  { id: "3", name: "Emergency Medicine Workshop", organizer: "TMPSA", date: "2026-07-10", location: "Phuket", attendees: 80, discountRules: 3 },
];

export const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@ecert.th", role: "Super Admin", status: "active" as const, lastLogin: "2026-02-17" },
  { id: "2", name: "Dr. สมศักดิ์ อนุมัติ", email: "somsak@tmpsa.or.th", role: "Approver", status: "active" as const, lastLogin: "2026-02-16" },
  { id: "3", name: "อาจารย์ วิชาญ สอนดี", email: "wichan@training.th", role: "Trainer", status: "active" as const, lastLogin: "2026-02-15" },
  { id: "4", name: "สมชาย ใจดี", email: "somchai@gmail.com", role: "Holder", status: "active" as const, lastLogin: "2026-02-14" },
];

export const mockApiClients = [
  { id: "1", name: "TMPSA Event System", apiKey: "eCrt_live_...a3f2", created: "2025-12-01", lastUsed: "2026-02-17", requests: 12450, status: "active" as const },
  { id: "2", name: "สพฉ Registration Portal", apiKey: "eCrt_live_...b7d1", created: "2026-01-15", lastUsed: "2026-02-16", requests: 3200, status: "active" as const },
];

export const mockLogs = [
  { id: "1", action: "Certificate Approved", actor: "Dr. สมศักดิ์", target: "TMPSA-2026-000123", timestamp: "2026-02-17 10:30", ip: "203.150.xxx.xxx" },
  { id: "2", action: "Certificate Issued", actor: "System", target: "TMPSA-2026-000123", timestamp: "2026-02-17 10:31", ip: "—" },
  { id: "3", action: "Verify API Call", actor: "TMPSA Event System", target: "TMPSA-2026-000123", timestamp: "2026-02-17 11:15", ip: "203.150.xxx.xxx" },
  { id: "4", action: "Certificate Revoked", actor: "Dr. สมศักดิ์", target: "SPCH-2026-000789", timestamp: "2026-02-16 14:22", ip: "203.150.xxx.xxx" },
  { id: "5", action: "User Created", actor: "Admin User", target: "wichan@training.th", timestamp: "2026-02-15 09:00", ip: "10.0.xxx.xxx" },
];

export const mockMessages = [
  { id: "1", template: "Certificate Approved", channel: "LINE", sent: 1243, opened: 1180, clicked: 890, lastSent: "2026-02-17" },
  { id: "2", template: "Expiring Soon (30 days)", channel: "Email", sent: 456, opened: 320, clicked: 210, lastSent: "2026-02-16" },
  { id: "3", template: "Certificate Expired", channel: "LINE + Email", sent: 89, opened: 75, clicked: 42, lastSent: "2026-02-15" },
];
