// Today: 2026-04-15 — dates seeded around this for realistic "recent activity" feel

export const mockPrograms = [
  { id: "1", name: "EMT-Paramedic Certification", code: "EMT-P", issuer: "TMPSA", duration: "2 years", activeCerts: 1243, template: "Gold Badge" },
  { id: "2", name: "Advanced First Responder", code: "AFR", issuer: "สพฉ", duration: "1 year", activeCerts: 892, template: "Silver Badge" },
  { id: "3", name: "Emergency Medical Technician", code: "EMT-B", issuer: "TMPSA", duration: "2 years", activeCerts: 3421, template: "Bronze Badge" },
  { id: "4", name: "Disaster Response Specialist", code: "DRS", issuer: "สพฉ", duration: "3 years", activeCerts: 156, template: "Platinum Badge" },
];

export const mockCertificates = [
  // Active — main body
  { id: "1", certNo: "EMT-P-2026-000123", holder: "สมชาย ใจดี", program: "EMT-Paramedic", status: "active" as const, issuedAt: "2025-06-15", expiresAt: "2027-06-15" },
  { id: "2", certNo: "EMT-P-2026-000124", holder: "สมหญิง รักดี", program: "EMT-Paramedic", status: "active" as const, issuedAt: "2025-07-01", expiresAt: "2027-07-01" },
  { id: "3", certNo: "EMT-P-2026-000125", holder: "ประภาส ทองคำ", program: "EMT-Paramedic", status: "active" as const, issuedAt: "2025-09-12", expiresAt: "2027-09-12" },
  { id: "4", certNo: "AFR-2026-000201", holder: "ศิริพร วงศ์สวัสดิ์", program: "Advanced First Responder", status: "active" as const, issuedAt: "2025-11-05", expiresAt: "2026-11-05" },
  { id: "5", certNo: "AFR-2026-000202", holder: "กิตติ วิจิตร", program: "Advanced First Responder", status: "active" as const, issuedAt: "2026-01-20", expiresAt: "2027-01-20" },
  { id: "6", certNo: "EMT-B-2026-000340", holder: "นพดล ทวีทรัพย์", program: "EMT-Basic", status: "active" as const, issuedAt: "2025-08-01", expiresAt: "2027-08-01" },
  { id: "7", certNo: "EMT-B-2026-000341", holder: "ขวัญใจ พรหมมา", program: "EMT-Basic", status: "active" as const, issuedAt: "2025-10-10", expiresAt: "2027-10-10" },
  { id: "8", certNo: "DRS-2026-000050", holder: "พีระพล ชัยชนะ", program: "Disaster Response", status: "active" as const, issuedAt: "2025-05-15", expiresAt: "2028-05-15" },

  // Expiring soon (within 30 days of 2026-04-15)
  { id: "9", certNo: "AFR-2025-000180", holder: "มานพ เกตุแก้ว", program: "Advanced First Responder", status: "active" as const, issuedAt: "2025-04-25", expiresAt: "2026-04-25" },
  { id: "10", certNo: "AFR-2025-000181", holder: "ชลธิชา ศรีสุข", program: "Advanced First Responder", status: "active" as const, issuedAt: "2025-05-02", expiresAt: "2026-05-02" },
  { id: "11", certNo: "EMT-B-2024-000310", holder: "อนุชา พันธ์ทอง", program: "EMT-Basic", status: "active" as const, issuedAt: "2024-05-10", expiresAt: "2026-05-10" },

  // Expired
  { id: "12", certNo: "AFR-2025-000456", holder: "วิชัย สุขสันต์", program: "Advanced First Responder", status: "expired" as const, issuedAt: "2024-01-10", expiresAt: "2025-01-10" },
  { id: "13", certNo: "EMT-B-2024-000120", holder: "ปรีดา แสงอรุณ", program: "EMT-Basic", status: "expired" as const, issuedAt: "2022-03-15", expiresAt: "2024-03-15" },

  // Pending (awaiting approval — visible on dashboard)
  { id: "14", certNo: "DRAFT-000401", holder: "นภา แสงทอง", program: "EMT-Basic", status: "pending" as const, issuedAt: "", expiresAt: "" },
  { id: "15", certNo: "DRAFT-000402", holder: "จิราภรณ์ ดีงาม", program: "EMT-Basic", status: "pending" as const, issuedAt: "", expiresAt: "" },

  // Revoked
  { id: "16", certNo: "DRS-2026-000789", holder: "ธนา พงศ์ไพร", program: "Disaster Response", status: "revoked" as const, issuedAt: "2025-03-20", expiresAt: "2028-03-20" },
];

export const mockApprovals = [
  { id: "1", certNo: "DRAFT-000401", holder: "นภา แสงทอง", program: "EMT-Basic", type: "issue" as const, submittedAt: "2026-04-14", identity: "verified" },
  { id: "2", certNo: "AFR-2025-000180", holder: "มานพ เกตุแก้ว", program: "Advanced First Responder", type: "extend" as const, submittedAt: "2026-04-13", identity: "verified" },
  { id: "3", certNo: "DRAFT-000402", holder: "จิราภรณ์ ดีงาม", program: "EMT-Basic", type: "issue" as const, submittedAt: "2026-04-12", identity: "pending" },
  { id: "4", certNo: "DRAFT-000403", holder: "อรรถพล วิเศษ", program: "Disaster Response", type: "issue" as const, submittedAt: "2026-04-11", identity: "verified" },
  { id: "5", certNo: "AFR-2025-000181", holder: "ชลธิชา ศรีสุข", program: "Advanced First Responder", type: "extend" as const, submittedAt: "2026-04-10", identity: "verified" },
  { id: "6", certNo: "DRAFT-000404", holder: "สุรชัย มั่งมี", program: "EMT-Paramedic", type: "issue" as const, submittedAt: "2026-04-09", identity: "verified" },
];

export const mockCourses = [
  { id: "1", name: "EMT Paramedic Training 2026 Q2", program: "EMT-Paramedic", sessions: 3, enrolled: 45, capacity: 60, status: "open" as const, startDate: "2026-05-01" },
  { id: "2", name: "Advanced First Aid Refresher", program: "Advanced First Responder", sessions: 2, enrolled: 30, capacity: 30, status: "closed" as const, startDate: "2026-04-20" },
  { id: "3", name: "Disaster Response Workshop", program: "Disaster Response", sessions: 1, enrolled: 12, capacity: 25, status: "open" as const, startDate: "2026-06-15" },
  { id: "4", name: "EMT-Basic Spring Cohort", program: "EMT-Basic", sessions: 4, enrolled: 22, capacity: 40, status: "open" as const, startDate: "2026-05-10" },
];

export const mockEvents = [
  { id: "1", name: "Thailand EMS Conference 2026", organizer: "TMPSA", date: "2026-05-15", location: "Bangkok Convention Center", attendees: 500, discountRules: 2 },
  { id: "2", name: "Regional First Responder Summit", organizer: "สพฉ", date: "2026-06-20", location: "Chiang Mai", attendees: 200, discountRules: 1 },
  { id: "3", name: "Emergency Medicine Workshop", organizer: "TMPSA", date: "2026-07-10", location: "Phuket", attendees: 80, discountRules: 3 },
  { id: "4", name: "Disaster Preparedness Expo", organizer: "สพฉ", date: "2026-08-22", location: "Khon Kaen", attendees: 150, discountRules: 2 },
];

export const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@ecert.th", role: "Super Admin", status: "active" as const, lastLogin: "2026-04-15" },
  { id: "2", name: "Dr. สมศักดิ์ อนุมัติ", email: "somsak@tmpsa.or.th", role: "Approver", status: "active" as const, lastLogin: "2026-04-15" },
  { id: "3", name: "อาจารย์ วิชาญ สอนดี", email: "wichan@training.th", role: "Trainer", status: "active" as const, lastLogin: "2026-04-14" },
  { id: "4", name: "สมชาย ใจดี", email: "somchai@gmail.com", role: "Holder", status: "active" as const, lastLogin: "2026-04-14" },
  { id: "5", name: "Dr. ประภา วินิจฉัย", email: "prapa@tmpsa.or.th", role: "Approver", status: "active" as const, lastLogin: "2026-04-13" },
  { id: "6", name: "อาจารย์ สุนีย์ ฝึกสอน", email: "sunee@training.th", role: "Trainer", status: "active" as const, lastLogin: "2026-04-12" },
];

export const mockApiClients = [
  { id: "1", name: "TMPSA Event System", apiKey: "eCrt_live_...a3f2", created: "2025-12-01", lastUsed: "2026-04-15", requests: 18420, status: "active" as const },
  { id: "2", name: "สพฉ Registration Portal", apiKey: "eCrt_live_...b7d1", created: "2026-01-15", lastUsed: "2026-04-14", requests: 5830, status: "active" as const },
  { id: "3", name: "Partner Hospital Verify Widget", apiKey: "eCrt_live_...c9e4", created: "2026-02-20", lastUsed: "2026-04-13", requests: 1240, status: "active" as const },
];

export const mockLogs = [
  { id: "1", action: "Certificate Approved", actor: "Dr. สมศักดิ์", target: "EMT-P-2026-000125", timestamp: "2026-04-15 10:30", ip: "203.150.xxx.xxx" },
  { id: "2", action: "Verify API Call", actor: "TMPSA Event System", target: "EMT-P-2026-000123", timestamp: "2026-04-15 10:31", ip: "203.150.xxx.xxx" },
  { id: "3", action: "Certificate Approved", actor: "Dr. ประภา", target: "AFR-2026-000202", timestamp: "2026-04-15 09:18", ip: "203.150.xxx.xxx" },
  { id: "4", action: "Verify API Call", actor: "Partner Hospital Verify Widget", target: "EMT-P-2026-000124", timestamp: "2026-04-15 08:45", ip: "110.77.xxx.xxx" },
  { id: "5", action: "Renewal Requested", actor: "มานพ เกตุแก้ว", target: "AFR-2025-000180", timestamp: "2026-04-13 15:22", ip: "1.47.xxx.xxx" },
  { id: "6", action: "Student Enrolled", actor: "อาจารย์ วิชาญ", target: "สุดา ใจเย็น → course-1", timestamp: "2026-04-12 11:05", ip: "203.150.xxx.xxx" },
  { id: "7", action: "Certificate Revoked", actor: "Dr. สมศักดิ์", target: "DRS-2026-000789", timestamp: "2026-04-10 14:22", ip: "203.150.xxx.xxx" },
  { id: "8", action: "Course Completed", actor: "อาจารย์ วิชาญ", target: "EMT-B Winter Cohort — 18 certs issued", timestamp: "2026-04-08 16:00", ip: "203.150.xxx.xxx" },
  { id: "9", action: "User Created", actor: "Admin User", target: "sunee@training.th", timestamp: "2026-04-05 09:00", ip: "10.0.xxx.xxx" },
  { id: "10", action: "API Key Issued", actor: "Admin User", target: "Partner Hospital Verify Widget", timestamp: "2026-02-20 10:15", ip: "10.0.xxx.xxx" },
];

export const mockMessages = [
  { id: "1", template: "Certificate Approved", channel: "Email", sent: 1820, opened: 1652, clicked: 1241, lastSent: "2026-04-15" },
  { id: "2", template: "Expiring Soon (30 days)", channel: "Email", sent: 642, opened: 480, clicked: 312, lastSent: "2026-04-14" },
  { id: "3", template: "Certificate Expired", channel: "Email", sent: 128, opened: 98, clicked: 54, lastSent: "2026-04-10" },
  { id: "4", template: "Renewal Reminder", channel: "Email", sent: 245, opened: 198, clicked: 142, lastSent: "2026-04-13" },
  { id: "5", template: "Training Enrollment Confirmed", channel: "Email", sent: 112, opened: 105, clicked: 82, lastSent: "2026-04-12" },
];

// --- Additional seeded runtime data (enrollments, verify logs) ---
export const mockEnrollmentsSeed = [
  { id: "enr-1", courseId: "1", holderName: "สุดา ใจเย็น", holderEmail: "suda@example.com", enrolledAt: "2026-04-12", attended: true },
  { id: "enr-2", courseId: "1", holderName: "มนตรี เสถียร", holderEmail: "montri@example.com", enrolledAt: "2026-04-12", attended: true },
  { id: "enr-3", courseId: "1", holderName: "กาญจนา พิทักษ์", holderEmail: "kanchana@example.com", enrolledAt: "2026-04-11", attended: true },
  { id: "enr-4", courseId: "1", holderName: "ธีระ มงคล", holderEmail: "theera@example.com", enrolledAt: "2026-04-11", attended: false },
  { id: "enr-5", courseId: "4", holderName: "อภิชาติ ก้าวหน้า", holderEmail: "apichat@example.com", enrolledAt: "2026-04-10", attended: true },
  { id: "enr-6", courseId: "4", holderName: "รัตนา พูลสุข", holderEmail: "rattana@example.com", enrolledAt: "2026-04-10", attended: true },
];

export const mockVerifyLogsSeed = [
  { id: "vl-1", certNo: "EMT-P-2026-000123", queriedAt: "2026-04-15T10:31:00Z" },
  { id: "vl-2", certNo: "EMT-P-2026-000124", queriedAt: "2026-04-15T08:45:00Z" },
  { id: "vl-3", certNo: "EMT-P-2026-000125", queriedAt: "2026-04-14T14:20:00Z" },
  { id: "vl-4", certNo: "AFR-2026-000201", queriedAt: "2026-04-14T11:05:00Z" },
  { id: "vl-5", certNo: "EMT-P-2026-000123", queriedAt: "2026-04-13T16:18:00Z" },
  { id: "vl-6", certNo: "EMT-B-2026-000340", queriedAt: "2026-04-13T09:50:00Z" },
  { id: "vl-7", certNo: "DRS-2026-000050", queriedAt: "2026-04-12T13:40:00Z" },
  { id: "vl-8", certNo: "EMT-P-2026-000123", queriedAt: "2026-04-12T10:12:00Z" },
];
