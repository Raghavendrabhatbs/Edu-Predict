import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (userData: any) =>
    apiClient.post('/auth/register', userData),
  logout: () => localStorage.removeItem('token'),
};

// Student Services
export const studentService = {
  getProfile: () => apiClient.get('/students/profile'),
  getMarks: () => apiClient.get('/students/marks'),
  getAttendance: () => apiClient.get('/students/attendance'),
  getMentalHealthAssessment: () => apiClient.get('/students/mental-health'),
  submitMentalHealthAssessment: (answers: any) =>
    apiClient.post('/students/mental-health', answers),
  getCareerPaths: () => apiClient.get('/students/career-paths'),
  selectCareerPath: (careerPathId: string) =>
    apiClient.post(`/students/career-paths/${careerPathId}/select`, {}),
  getSkillRecommendations: () => apiClient.get('/students/skills'),
  requestProfessorLocation: (professorId: string) =>
    apiClient.post('/students/professor-finder', { professorId }),
  requestAppointment: (appointmentData: any) =>
    apiClient.post('/students/appointments', appointmentData),
};

// Professor Services
export const professorService = {
  getProfile: () => apiClient.get('/professors/profile'),
  getStudents: () => apiClient.get('/professors/students'),
  uploadMarks: (marks: any) => apiClient.post('/professors/marks', marks),
  updateAttendance: (attendance: any) =>
    apiClient.post('/professors/attendance', attendance),
  getStudentPerformance: (studentId: string) =>
    apiClient.get(`/professors/students/${studentId}/performance`),
  getMentalHealthReports: () => apiClient.get('/professors/mental-health-reports'),
  suggestSkillCertification: (studentId: string, skill: string) =>
    apiClient.post(`/professors/students/${studentId}/skills`, { skill }),
  uploadNotes: (notes: FormData) => apiClient.post('/professors/notes', notes),
};

// Counselor Services
export const counselorService = {
  getProfile: () => apiClient.get('/counselors/profile'),
  getMentalHealthDashboard: () => apiClient.get('/counselors/dashboard'),
  getAtRiskStudents: () => apiClient.get('/counselors/at-risk-students'),
  getAppointmentRequests: () => apiClient.get('/counselors/appointments/requests'),
  acceptAppointment: (appointmentId: string, scheduledDate: Date) =>
    apiClient.put(`/counselors/appointments/${appointmentId}`, { scheduledDate }),
  requestAppointment: (studentId: string) =>
    apiClient.post(`/counselors/appointments/request/${studentId}`, {}),
  suggestFollowUp: (appointmentId: string, followUpDate: Date) =>
    apiClient.post(`/counselors/appointments/${appointmentId}/follow-up`, { followUpDate }),
};

export default apiClient;
