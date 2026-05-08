# Edu-Predict Architecture

## System Overview

```
┌─────────────────┐
│   Frontend      │
│  (React+TS)     │
└────────┬────────┘
         │
         │ HTTP/REST
         ▼
┌─────────────────┐        ┌──────────────┐
│   Backend       │◄──────►│ PostgreSQL   │
│  (Express)      │        │  Database    │
└────────┬────────┘        └──────────────┘
         │
         │ HTTP/REST
         ▼
┌─────────────────┐
│   AI Engine     │
│   (Flask)       │
└─────────────────┘
```

## Component Details

### Frontend Layer (React + TypeScript + Vite)

**Technology Stack:**
- React 18.2 for UI
- TypeScript for type safety
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Zustand for state management (can be added)
- React Hot Toast for notifications

**Key Directories:**
```
frontend/src/
├── pages/           # Page components
├── components/      # Reusable components
├── services/        # API service layer
├── types/           # TypeScript types
├── hooks/           # Custom hooks
├── utils/           # Utility functions
└── styles/          # CSS/Tailwind
```

**Portal Structure:**
1. **Student/Parent Portal**
   - Academic Dashboard
   - Mental Health Module
   - Career Path Module
   - Professor Finder
   - Appointment Scheduler

2. **Professor Portal**
   - Student Management
   - Performance Analytics
   - Mental Health Reports
   - Mark/Attendance Upload

3. **Counselor Portal**
   - Mental Health Dashboard
   - At-Risk Students
   - Appointment Management
   - Follow-up Scheduling

### Backend Layer (Express.js + Node.js)

**Technology Stack:**
- Express.js for HTTP server
- PostgreSQL for data persistence
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

**Key Directories:**
```
backend/src/
├── routes/          # API endpoints
├── controllers/     # Business logic
├── models/          # Database models
├── middleware/      # Auth, validation, etc.
├── config/          # Configuration
├── types/           # TypeScript types
└── utils/           # Utility functions
```

**API Organization:**
- `/api/auth` - Authentication
- `/api/students` - Student endpoints
- `/api/professors` - Professor endpoints
- `/api/counselors` - Counselor endpoints

**Key Features:**
1. **Authentication**
   - JWT token-based auth
   - Role-based access control
   - Secure password storage

2. **Data Management**
   - Student profiles and performance
   - Attendance and marks tracking
   - Mental health assessments
   - Career path management
   - Appointment scheduling

3. **Notifications**
   - Counselor notifications for high-risk students
   - Appointment reminders
   - Performance alerts

### AI/ML Engine (Python + Flask)

**Technology Stack:**
- Flask for HTTP API
- scikit-learn for ML models
- TensorFlow for deep learning
- Pandas for data manipulation
- spaCy for NLP
- NumPy for numerical computing

**Key Models:**
```
ai-engine/
├── models/          # Trained ML models
├── services/        # Service classes
├── routes/          # API endpoints
└── utils/           # Helper functions
```

**ML Algorithms:**

1. **Mental Health Prediction**
   - Random Forest Classifier
   - Input: Assessment answers
   - Output: Risk level (low/medium/high/critical)

2. **Performance Prediction**
   - Regression model (LinearRegression/RandomForest)
   - Input: Marks, attendance, assignments
   - Output: Predicted performance score

3. **Dropout Risk Prediction**
   - Logistic Regression/Gradient Boosting
   - Input: Multiple student metrics
   - Output: Dropout probability

4. **Career Path Recommendation**
   - Content-based filtering
   - Skill matching algorithm
   - Input: Student skills and interests
   - Output: Ranked career paths

5. **Skill Gap Analysis**
   - Set difference algorithm
   - Input: Current vs required skills
   - Output: Missing skills with recommendations

### Database Layer (PostgreSQL)

**Database Schema:**

**Users (Base table)**
- id (UUID)
- email, password
- role (student/professor/counselor/admin)
- firstName, lastName
- timestamps

**Students**
- id (FK to users)
- usn (unique student number)
- department, semester
- cgpa, mentalHealthScore

**Professors**
- id (FK to users)
- department, specialization
- office location, coordinates

**Counselors**
- id (FK to users)
- specialization, license
- office location

**Academic Tables**
- Subjects
- Marks
- Attendance
- Notes

**Mental Health**
- MentalHealthAssessments
- AssessmentAnswers

**Career Planning**
- CareerPaths
- StudentCareerPaths
- RoadmapItems
- Resources

**Appointments**
- Appointments
- AppointmentFollowUps

**Other**
- Skills
- StudentSkills
- ProfessorFinderRequests

**Indexes:**
- On frequently queried fields (studentId, professorId, etc.)
- On unique fields (usn, email, etc.)
- On foreign keys

## Data Flow

### Login Flow
```
1. User enters credentials (Frontend)
   ↓
2. POST /api/auth/login (Backend)
   ↓
3. Verify password, generate JWT token
   ↓
4. Return token + user info (Frontend)
   ↓
5. Store token in localStorage
   ↓
6. Redirect to dashboard
```

### Mental Health Assessment Flow
```
1. Student answers questions (Frontend)
   ↓
2. POST /api/students/mental-health (Backend)
   ↓
3. Forward to AI Engine
   ↓
4. ML model predicts risk level
   ↓
5. Store assessment in DB
   ↓
6. Notify counselor if high risk
   ↓
7. Return results to frontend
```

### Career Path Selection Flow
```
1. Student views career paths (Frontend)
   ↓
2. GET /api/students/career-paths (Backend)
   ↓
3. AI Engine recommends paths
   ↓
4. Display with resources and roadmap
   ↓
5. Student selects path
   ↓
6. POST /api/students/career-paths/:id/select
   ↓
7. Create roadmap with milestones
   ↓
8. Track progress over time
```

## Security Considerations

1. **Authentication**
   - JWT tokens with expiration
   - Secure password hashing (bcryptjs)
   - Token refresh mechanism

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource-level authorization
   - Middleware checks on all endpoints

3. **Data Protection**
   - HTTPS in production
   - Encrypted database connections
   - Sensitive data masking in logs

4. **Privacy**
   - Confidential counseling sessions
   - Student data segregation by role
   - GDPR compliance considerations

5. **Input Validation**
   - Server-side validation
   - SQL injection prevention (parameterized queries)
   - XSS prevention

## Scalability Considerations

1. **Database**
   - Use indexes appropriately
   - Connection pooling
   - Read replicas for analytics

2. **API**
   - Caching layer (Redis)
   - Load balancing
   - Microservices for AI engine

3. **Frontend**
   - Code splitting
   - Lazy loading
   - CDN for static assets

4. **Real-time Features**
   - WebSocket for notifications
   - Message queue (RabbitMQ/Kafka)
   - Real-time sync

## Deployment Architecture

```
┌─────────────┐
│  Vercel     │ (Frontend)
└─────────────┘

┌─────────────┐
│  Heroku     │ (Backend)
└─────────────┘

┌─────────────┐
│  Heroku     │ (AI Engine)
└─────────────┘

┌─────────────┐
│  AWS RDS    │ (PostgreSQL)
└─────────────┘
```

## Monitoring and Analytics

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - Log aggregation (ELK Stack)

2. **Metrics**
   - API response times
   - Error rates
   - User engagement
   - Model accuracy

3. **Alerting**
   - High error rates
   - Performance degradation
   - Database issues
   - ML model drift

## Future Enhancements

1. **Real-time Collaboration**
   - Live chat with professors
   - Shared notes and documents
   - Video conferencing integration

2. **Advanced Analytics**
   - Predictive interventions
   - Peer comparison analytics
   - Learning style analysis

3. **Mobile App**
   - React Native implementation
   - Offline support
   - Push notifications

4. **Blockchain**
   - Certificate verification
   - Skill credentials
   - Immutable records

5. **Integration**
   - Third-party learning platforms
   - University management systems
   - Career opportunity platforms
