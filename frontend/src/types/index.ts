// User Types
export type UserRole = 'student' | 'parent' | 'professor' | 'counselor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Student extends User {
  usn: string;
  department: string;
  semester: number;
  cgpa: number;
  mentalHealthScore?: number;
}

export interface Professor extends User {
  department: string;
  specialization: string;
  students?: Student[];
}

export interface Counselor extends User {
  specialization: string;
  licenseNumber: string;
}

// Academic Types
export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  marks: number;
  maxMarks: number;
  date: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  percentage: number;
  date: Date;
}

// Mental Health Types
export interface MentalHealthAssessment {
  id: string;
  studentId: string;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  recommendedCounselor?: Counselor;
}

export interface MentalHealthQuestion {
  id: string;
  question: string;
  options: string[];
  weight: number;
  category: string;
}

// Career Path Types
export interface CareerPath {
  id: string;
  name: string;
  description: string;
  skills: string[];
  resources: Resource[];
  roadmap: RoadmapItem[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  deadline: Date;
  completed: boolean;
  progress: number; // 0-100
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'book' | 'course' | 'article';
  url: string;
  platform: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Appointment Types
export interface Appointment {
  id: string;
  studentId: string;
  counselorId?: string;
  professorId?: string;
  type: 'counseling' | 'mentorship';
  status: 'pending' | 'accepted' | 'scheduled' | 'completed' | 'cancelled';
  requestedDate: Date;
  scheduledDate?: Date;
  duration: number; // in minutes
  notes?: string;
  isConfidential: boolean;
}

// Location Types
export interface ProfessorLocation {
  professorId: string;
  latitude: number;
  longitude: number;
  validUntil: Date; // 15 minutes from request
  requestId: string;
}

// Analytics Types
export interface PerformanceMetrics {
  studentId: string;
  cgpa: number;
  averageMarks: number;
  attendancePercentage: number;
  weakSubjects: string[];
  strongSubjects: string[];
}

export interface SkillGap {
  studentId: string;
  requiredSkills: string[];
  currentSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}
