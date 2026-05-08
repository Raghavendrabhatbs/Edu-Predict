-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'parent', 'professor', 'counselor', 'admin')),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  usn VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(255),
  semester INTEGER,
  cgpa DECIMAL(3,2),
  mental_health_score INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parents Table
CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relation VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professors Table
CREATE TABLE professors (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(255),
  specialization VARCHAR(255),
  phone VARCHAR(20),
  office_location VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Counselors Table
CREATE TABLE counselors (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  license_number VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  office_location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(255),
  semester INTEGER,
  professor_id UUID REFERENCES professors(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marks Table
CREATE TABLE marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  marks DECIMAL(5,2),
  max_marks DECIMAL(5,2) DEFAULT 100,
  test_type VARCHAR(100),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('present', 'absent', 'leave')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mental Health Assessments Table
CREATE TABLE mental_health_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  risk_level VARCHAR(50) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  assessment_data JSONB,
  recommended_counselor_id UUID REFERENCES counselors(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Paths Table
CREATE TABLE career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  skills JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Career Paths (Selection)
CREATE TABLE student_career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  career_path_id UUID NOT NULL REFERENCES career_paths(id),
  selected_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roadmap Items Table
CREATE TABLE roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_career_path_id UUID NOT NULL REFERENCES student_career_paths(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  duration INTEGER, -- in days
  deadline TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  progress DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('video', 'book', 'course', 'article')),
  url VARCHAR(500),
  platform VARCHAR(100),
  difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Path Resources (Junction)
CREATE TABLE career_path_resources (
  career_path_id UUID REFERENCES career_paths(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  PRIMARY KEY (career_path_id, resource_id)
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES counselors(id),
  professor_id UUID REFERENCES professors(id),
  type VARCHAR(50) CHECK (type IN ('counseling', 'mentorship')),
  status VARCHAR(50) CHECK (status IN ('pending', 'accepted', 'scheduled', 'completed', 'cancelled')),
  requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_date TIMESTAMP,
  duration INTEGER DEFAULT 60, -- in minutes
  notes TEXT,
  is_confidential BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professor Finder Requests Table
CREATE TABLE professor_finder_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES professors(id),
  status VARCHAR(50) CHECK (status IN ('pending', 'accepted', 'expired')),
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until TIMESTAMP,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes Table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID NOT NULL REFERENCES professors(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  title VARCHAR(255),
  file_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Skills Table
CREATE TABLE student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id),
  proficiency_level VARCHAR(50) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for better query performance
CREATE INDEX idx_students_usn ON students(usn);
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_subject_id ON marks(subject_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_mental_health_student_id ON mental_health_assessments(student_id);
CREATE INDEX idx_appointments_student_id ON appointments(student_id);
CREATE INDEX idx_appointments_counselor_id ON appointments(counselor_id);
CREATE INDEX idx_professor_finder_student_id ON professor_finder_requests(student_id);
CREATE INDEX idx_professor_finder_professor_id ON professor_finder_requests(professor_id);
