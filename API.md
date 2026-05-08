# Edu-Predict API Documentation

## Overview

Edu-Predict is a comprehensive API for managing student education, mental health, and career guidance. The API is organized into three main modules: Authentication, Student, Professor, and Counselor.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Error details (if available)"
}
```

## Authentication Endpoints

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

### Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "newstudent@example.com",
  "password": "password",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "student",
  "usn": "USN12345",
  "department": "Computer Science",
  "semester": 3
}
```

**Response:** Same as Login

## Student Endpoints

### Get Student Profile

**Endpoint:** `GET /students/profile`

**Authentication:** Required (student, parent)

**Response:**
```json
{
  "id": "uuid",
  "email": "student@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "usn": "USN12345",
  "department": "Computer Science",
  "semester": 3,
  "cgpa": 3.75,
  "mentalHealthScore": 75
}
```

### Get Marks

**Endpoint:** `GET /students/marks`

**Query Parameters:**
- `studentId` (optional) - Get marks for specific student

**Response:**
```json
[
  {
    "id": "uuid",
    "studentId": "uuid",
    "subject_name": "Data Structures",
    "code": "CS201",
    "marks": 85,
    "maxMarks": 100,
    "testType": "exam",
    "date": "2026-04-15"
  }
]
```

### Get Attendance

**Endpoint:** `GET /students/attendance`

**Query Parameters:**
- `studentId` (optional) - Get attendance for specific student

**Response:**
```json
[
  {
    "subject_name": "Data Structures",
    "code": "CS201",
    "total_classes": 30,
    "classes_attended": 28,
    "attendance_percentage": 93.33
  }
]
```

### Get Mental Health Assessment

**Endpoint:** `GET /students/mental-health`

**Query Parameters:**
- `studentId` (optional) - Get assessment for specific student

**Response:**
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "score": 75,
  "riskLevel": "low",
  "timestamp": "2026-05-01T10:30:00Z",
  "recommendedCounselor": "uuid"
}
```

### Submit Mental Health Assessment

**Endpoint:** `POST /students/mental-health`

**Authentication:** Required (student)

**Request Body:**
```json
{
  "answers": [3, 2, 4, 1, 5]
}
```

**Response:**
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "score": 75,
  "riskLevel": "low",
  "timestamp": "2026-05-01T10:30:00Z"
}
```

### Get Career Paths

**Endpoint:** `GET /students/career-paths`

**Authentication:** Required (student, parent)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Software Development",
    "description": "Become a skilled software developer...",
    "skills": ["Python", "JavaScript", "SQL"],
    "resources": [
      {
        "id": "uuid",
        "title": "Python for Everyone",
        "type": "course",
        "platform": "Coursera",
        "difficulty": "beginner"
      }
    ],
    "roadmap": [
      {
        "id": "uuid",
        "title": "Learn Python Basics",
        "description": "Master Python fundamentals",
        "duration": 30,
        "deadline": "2026-06-01",
        "completed": false,
        "progress": 45
      }
    ]
  }
]
```

### Select Career Path

**Endpoint:** `POST /students/career-paths/:careerPathId/select`

**Authentication:** Required (student)

**Response:**
```json
{
  "id": "uuid",
  "studentId": "uuid",
  "careerPathId": "uuid",
  "selectedDate": "2026-05-01",
  "progress": 0
}
```

### Get Skill Recommendations

**Endpoint:** `GET /students/skills`

**Authentication:** Required (student, parent)

**Response:**
```json
{
  "currentSkills": [
    {
      "name": "Python",
      "proficiency_level": "intermediate"
    }
  ],
  "careerPath": {
    "id": "uuid",
    "name": "Data Science",
    "skills": ["Python", "SQL", "Machine Learning"]
  }
}
```

### Request Professor Location

**Endpoint:** `POST /students/professor-finder`

**Authentication:** Required (student)

**Request Body:**
```json
{
  "professorId": "uuid"
}
```

**Response:**
```json
{
  "message": "Location request sent",
  "request": {
    "id": "uuid",
    "studentId": "uuid",
    "professorId": "uuid",
    "status": "pending",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "validUntil": "2026-05-01T10:45:00Z"
  },
  "validFor": "15 minutes"
}
```

### Request Appointment

**Endpoint:** `POST /students/appointments`

**Authentication:** Required (student)

**Request Body:**
```json
{
  "type": "counseling",
  "counselorId": "uuid (optional)",
  "professorId": "uuid (optional)",
  "notes": "I need help with anxiety"
}
```

**Response:**
```json
{
  "message": "Appointment request submitted",
  "appointment": {
    "id": "uuid",
    "studentId": "uuid",
    "counselorId": "uuid",
    "professorId": null,
    "type": "counseling",
    "status": "pending",
    "requestedDate": "2026-05-01T10:30:00Z",
    "isConfidential": true
  }
}
```

## Professor Endpoints

### Get Professor Profile

**Endpoint:** `GET /professors/profile`

**Authentication:** Required (professor)

**Response:**
```json
{
  "id": "uuid",
  "email": "prof@example.com",
  "firstName": "Dr.",
  "lastName": "Smith",
  "department": "Computer Science",
  "specialization": "AI/ML",
  "officeLocation": "Building A, Room 301"
}
```

### Get Students

**Endpoint:** `GET /professors/students`

**Authentication:** Required (professor)

**Response:**
```json
[
  {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "usn": "USN12345",
    "department": "Computer Science",
    "semester": 3,
    "cgpa": 3.75,
    "mental_health_score": 75
  }
]
```

### Upload Marks

**Endpoint:** `POST /professors/marks`

**Authentication:** Required (professor)

**Request Body:**
```json
{
  "marks": [
    {
      "studentId": "uuid",
      "subjectId": "uuid",
      "marks": 85,
      "maxMarks": 100,
      "testType": "exam"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Marks uploaded successfully",
  "marks": [...]
}
```

### Update Attendance

**Endpoint:** `POST /professors/attendance`

**Authentication:** Required (professor)

**Request Body:**
```json
{
  "attendance": [
    {
      "studentId": "uuid",
      "subjectId": "uuid",
      "status": "present"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Attendance updated",
  "records": [...]
}
```

## Counselor Endpoints

### Get Mental Health Dashboard

**Endpoint:** `GET /counselors/dashboard`

**Authentication:** Required (counselor)

**Response:**
```json
[
  {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "usn": "USN12345",
    "department": "Computer Science",
    "cgpa": 3.75,
    "score": 75,
    "risk_level": "low",
    "timestamp": "2026-05-01T10:30:00Z"
  }
]
```

### Get At-Risk Students

**Endpoint:** `GET /counselors/at-risk-students`

**Authentication:** Required (counselor)

**Response:** Same format as dashboard but filtered to high/critical risk only

### Get Appointment Requests

**Endpoint:** `GET /counselors/appointments/requests`

**Authentication:** Required (counselor)

**Response:**
```json
[
  {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "usn": "USN12345",
    "type": "counseling",
    "status": "pending",
    "requestedDate": "2026-05-01T10:30:00Z"
  }
]
```

### Accept Appointment

**Endpoint:** `PUT /counselors/appointments/:appointmentId`

**Authentication:** Required (counselor)

**Request Body:**
```json
{
  "scheduledDate": "2026-05-05T14:00:00Z"
}
```

**Response:**
```json
{
  "message": "Appointment accepted and scheduled",
  "appointment": {...}
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

Currently, no rate limiting is implemented. This should be added in production.

## CORS

CORS is enabled for all origins in development. In production, update this in `backend/src/index.ts`.

## Pagination

Some endpoints support pagination via query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

## Filtering and Sorting

Supported on select endpoints:
- `sort` - Sort field (e.g., `date`, `name`)
- `order` - Sort order (`asc`, `desc`)
- `filter` - Filter criteria

## Webhooks

Currently not implemented. Can be added for event notifications.
