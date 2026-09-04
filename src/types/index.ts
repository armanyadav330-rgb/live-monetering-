export type UserRole =
  | 'SUPER_ADMIN'
  | 'DEPARTMENT_OFFICIAL'
  | 'INSPECTION_OFFICER'
  | 'STATE_DISTRICT_AUTHORITY'
  | 'NGO_INSTITUTE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CCTVStatus = 'ONLINE' | 'OFFLINE' | 'WARNING';
export type ProjectStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED' | 'INACTIVE';
export type ChecklistStatus = 'PASS' | 'FAIL' | 'PARTIAL' | 'NOT_APPLICABLE';
export type InspectionResult =
  | 'COMPLIANT'
  | 'PARTIALLY_COMPLIANT'
  | 'NON_COMPLIANT'
  | 'REQUIRES_FOLLOW_UP';

export type InspectionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InspectionPriority = 'ROUTINE' | 'HIGH' | 'CRITICAL' | 'SURPRISE' | 'CRITICAL_AUDIT';
export type ChecklistItem = InspectionChecklistItem;
export type EvidenceFile = InspectionEvidence;
export type Notification = NotificationItem;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  designation: string;
  department?: string;
  state?: string;
  district?: string;
  assignedProjectId?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export interface RiskFactorBreakdown {
  attendanceAnomaly: number; // max 20
  cctvDowntime: number; // max 15
  inspectionHistory: number; // max 20
  gpsVerification: number; // max 20
  complianceHistory: number; // max 15
  otherSignals: number; // max 10
  total: number; // max 100
  notes?: string[];
}

export interface Project {
  id: string;
  projectId: string; // e.g., DOSJE-DEL-2025-001
  projectName: string;
  ngoName: string;
  scheme: string; // e.g. PM-AJAY, SMILE, SHREYAS, NAPDDR, AVYAY
  state: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  projectIncharge: string;
  contact: string;
  email: string;
  beneficiaryCount: number;
  staffCount: number;
  cctvStatus: CCTVStatus;
  lastCCTVHeartbeat?: string;
  attendanceStatus: 'NORMAL' | 'WARNING' | 'HIGH ATTENTION';
  averageAttendancePercent: number;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  riskBreakdown?: RiskFactorBreakdown;
  projectStatus: ProjectStatus;
  lastInspectionDate?: string;
  lastInspectionResult?: InspectionResult;
  lastVerificationDate?: string;
  activeCamerasCount: number;
  totalCamerasCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InspectionChecklistItem {
  id: string;
  title: string;
  category: 'INFRASTRUCTURE' | 'PERSONNEL' | 'RECORDS' | 'CCTV_TECH' | 'SERVICES';
  status: ChecklistStatus;
  observations: string;
}

export interface InspectionEvidence {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
  uploaderId: string;
  uploaderName: string;
  fileCategory: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  caption?: string;
}

export interface GPSVerificationData {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: string;
  distanceFromProjectMeters: number;
  status: 'MATCHED' | 'OUTSIDE EXPECTED AREA' | 'LOCATION UNAVAILABLE';
  verified: boolean;
}

export interface Inspection {
  id: string;
  inspectionCode: string; // e.g., INSP-2025-089
  projectId: string;
  projectName: string;
  ngoName: string;
  scheme: string;
  state: string;
  district: string;
  projectCoordinates: {
    latitude: number;
    longitude: number;
  };
  inspectorId: string;
  inspectorName: string;
  inspectorDesignation: string;
  scheduledDate: string;
  inspectionDate?: string;
  inspectionTime?: string;
  status: InspectionStatus;
  priority: InspectionPriority;
  assignmentReason: string;
  gps?: GPSVerificationData;
  gpsVerification?: GPSVerificationData | any;
  checklist: InspectionChecklistItem[];
  evidence: InspectionEvidence[];
  evidenceFiles?: InspectionEvidence[];
  findings: string;
  remarks: string;
  overallResult?: InspectionResult;
  riskScoreAtInspection?: number;
  submittedAt?: string;
  aiSummary?: string;
  followUpActions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CCTVCamera {
  id: string;
  projectId: string;
  cameraName: string;
  location: string;
  status: CCTVStatus;
  lastHeartbeat: string;
  ipAddress?: string;
  resolution: string;
  streamType: 'SIMULATED_HLS' | 'RTSP_WEBRTC' | 'DEMO_CANVAS';
  fps: number;
  uptimePercent: number;
}

export interface RandomVCRecord {
  id: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  participantType: 'PROJECT_INCHARGE' | 'STAFF' | 'BENEFICIARY';
  participantName: string;
  participantContact: string;
  conductedByUserId: string;
  conductedByUserName: string;
  scheduledAt: string;
  conductedAt?: string;
  durationSeconds?: number;
  verificationResult: 'VERIFIED' | 'DISCREPANCY_DETECTED' | 'UNAVAILABLE' | 'PENDING';
  verificationNotes: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  projectId: string;
  date: string;
  registeredBeneficiaries: number;
  presentBeneficiaries: number;
  registeredStaff: number;
  presentStaff: number;
  markedBy: string;
  source: 'BIOMETRIC' | 'FACIAL_RECOGNITION' | 'PORTAL_MANUAL';
  anomalyFlag: boolean;
  anomalyReason?: string;
}

export interface AIAnomalyAlert {
  id: string;
  projectId: string;
  projectName: string;
  district: string;
  state: string;
  scheme: string;
  alertType: 'ATTENDANCE_DROP' | 'CCTV_OUTAGE' | 'GPS_DEVIATION' | 'COMPLIANCE_CONCERN' | 'PATTERN_REPETITION';
  severity: 'INFO' | 'WARNING' | 'HIGH_ATTENTION' | 'CRITICAL';
  title: string;
  description: string;
  confidenceScore: number; // 0-100
  potentialImpact: string;
  suggestedAction: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'DISMISSED' | 'RESOLVED';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string; // empty means all or role-specific
  targetRole?: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'ASSIGNMENT' | 'OVERDUE' | 'HIGH_RISK' | 'CCTV_OFFLINE' | 'GPS_MISMATCH' | 'AI_ALERT' | 'REPORT_SUBMITTED';
  link?: string;
  read: boolean;
  isRead?: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action:
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'PROJECT_CREATED'
    | 'PROJECT_UPDATED'
    | 'PROJECT_DELETED'
    | 'INSPECTION_ASSIGNED'
    | 'INSPECTION_STARTED'
    | 'INSPECTION_SUBMITTED'
    | 'REPORT_EXPORTED'
    | 'VC_VERIFICATION_CONDUCTED'
    | 'USER_CREATED'
    | 'USER_ROLE_CHANGED'
    | 'AI_ANALYSIS_TRIGGERED'
    | 'DEMO_DATA_RESET';
  targetType: 'PROJECT' | 'INSPECTION' | 'USER' | 'REPORT' | 'SYSTEM';
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}
