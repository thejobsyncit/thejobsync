// ==================== ENUMS ====================

export type UserRole =
  | 'super_admin'
  | 'it_admin'
  | 'admin'
  | 'placement_coordinator'
  | 'recruiter'
  | 'interviewer'
  | 'hr'
  | 'client'
  | 'developer'
  | 'tester'
  | 'dms'
  | 'coordinator'
  | 'application_support'
  | 'super_admin_erp'
  | 'admin_erp';

export type RequirementStatus = 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled';
export type CandidateStatus = 'new' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'selected' | 'rejected' | 'offered' | 'joined' | 'withdrawn';
export type InterviewStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PlacementStatus = 'offer_sent' | 'offer_accepted' | 'joining_confirmed' | 'joined' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// ==================== ENTITIES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  website?: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobRequirement {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  skills: string[];
  experience: string;
  positions: number;
  filledPositions: number;
  location: string;
  salaryRange: string;
  status: RequirementStatus;
  priority: Priority;
  assignedRecruiters: string[];
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  education: string;
  currentCompany?: string;
  currentRole?: string;
  expectedSalary?: string;
  location: string;
  resumeUrl?: string;
  status: CandidateStatus;
  source?: string;
  assignedSupportId?: string | null;
  appliedFor?: string | null;
  requirementTitle?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  requirementId: string;
  requirementTitle: string;
  interviewerId: string;
  interviewerName: string;
  scheduledAt: string;
  duration: number; // minutes
  type: 'phone' | 'video' | 'in_person' | 'technical' | 'hr';
  status: InterviewStatus;
  feedback?: string;
  rating?: number; // 1-5
  recommendation?: 'select' | 'reject' | 'hold';
  createdAt: string;
  updatedAt: string;
}

export interface Placement {
  id: string;
  candidateId: string;
  candidateName: string;
  requirementId: string;
  requirementTitle: string;
  clientId: string;
  clientName: string;
  position: string;
  salary: string;
  joiningDate: string;
  status: PlacementStatus;
  offerLetterUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface CompanyLead {
  id: string;
  companyName: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  contactPerson?: string | null;
  position?: string | null;
  website?: string | null;
  address?: string | null;
  requirementDetails?: string | null;
  validityTime?: string | null;
  remark?: string | null;
  dmsId: string;
  coordinatorId?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Optional relations
  dms?: User;
  coordinator?: User;
}

// ==================== DASHBOARD STATS ====================

export interface DashboardStats {
  totalClients: number;
  activeRequirements: number;
  totalCandidates: number;
  scheduledInterviews: number;
  placements: number;
  openPositions: number;
  thisMonthPlacements: number;
  thisMonthInterviews: number;
}

export interface RecentActivity {
  id: string;
  type: 'client' | 'requirement' | 'candidate' | 'interview' | 'placement';
  action: string;
  description: string;
  user: string;
  timestamp: string;
}

// ==================== UI HELPERS ====================

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: SidebarItem[];
}

export const ROLE_LABELS: Partial<Record<UserRole, string>> = {
  super_admin: 'Super Admin',
  it_admin: 'IT Admin',
  admin: 'Admin',
  placement_coordinator: 'Placement Coordinator',
  recruiter: 'Recruiter',
  interviewer: 'Interviewer',
  hr: 'HR Professional',
  client: 'Client',
  developer: 'Developer',
  tester: 'QA Tester',
  dms: 'DMS',
  coordinator: 'Coordinator',
  application_support: 'Application Support',
  super_admin_erp: 'Super Admin ERP',
  admin_erp: 'Admin ERP',
};

export const ROLE_COLORS: Partial<Record<UserRole, string>> = {
  super_admin: '#ef4444',
  it_admin: '#f97316',
  admin: '#eab308',
  placement_coordinator: '#10b981',
  recruiter: '#00B4D8',   // ocean cyan
  interviewer: '#0077B6', // ocean blue
  hr: '#03045E',          // deep navy
  client: '#90E0EF',      // light cyan
  developer: '#a855f7',
  tester: '#ec4899',
  dms: '#f43f5e',         // rose
  coordinator: '#8b5cf6', // violet
  application_support: '#06b6d4', // cyan
  super_admin_erp: '#b91c1c', // darker red
  admin_erp: '#d97706', // darker amber
};

export const STATUS_COLORS: Record<string, string> = {
  // Requirement
  open: '#22c55e',
  in_progress: '#3b82f6',
  on_hold: '#eab308',
  closed: '#6b7280',
  cancelled: '#ef4444',
  // Candidate
  new: '#3b82f6',
  shortlisted: '#8b5cf6',
  interview_scheduled: '#f97316',
  interviewed: '#06b6d4',
  selected: '#22c55e',
  rejected: '#ef4444',
  offered: '#eab308',
  joined: '#10b981',
  withdrawn: '#6b7280',
  // Interview
  scheduled: '#3b82f6',
  completed: '#22c55e',
  no_show: '#ef4444',
  // Placement
  offer_sent: '#f97316',
  offer_accepted: '#8b5cf6',
  joining_confirmed: '#06b6d4',
};
