export type PortalRole = 'landing' | 'login' | 'student' | 'employer' | 'admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'employer' | 'admin';
  token: string;
  loginTime: string;
}

export interface InternshipRole {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Hybrid' | 'Remote' | 'On-site';
  stipend: string;
  tags: string[];
  description: string;
  matchScore?: number;
  applicantsCount: number;
  sector: string;
  status: 'Open' | 'Closing Soon' | 'Reviewing';
  featured?: boolean;
  /** Duration string used by the Stitch filter panel (e.g. "6 Months") */
  duration: string;
}

export interface Candidate {
  id: string;
  name: string;
  university: string;
  roleFocus: string;
  experience: string;
  aiMatchScore: number;
  avatarInitials: string;
  appliedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Interviewed' | 'Offered' | 'Rejected';
  email: string;
  phone: string;
  skills: string[];
  summary: string;
}

export interface StateDistribution {
  state: string;
  applications: number;
  verifiedPercentage: number;
  topSectors: string[];
  activePartners: number;
}

export interface VerificationBatch {
  id: string;
  title: string;
  type: string;
  priority: 'High' | 'Standard' | 'System';
  count: number;
  status: 'Pending' | 'In Review' | 'Completed';
  zone: string;
}

/** Represents a company pending admin approval on the platform */
export interface PendingCompany {
  id: string;
  name: string;
  industry: string;
  dateApplied: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface ApplicationFormData {
  internshipId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  graduationYear: string;
  sop: string;
  skills: string[];
}
