import express, { Request, Response } from 'express';
import { pool } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get Student Profile
router.get('/profile', authenticate, authorize(['student', 'parent']), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const query = `
      SELECT u.*, s.usn, s.department, s.semester, s.cgpa, s.mental_health_score
      FROM users u
      LEFT JOIN students s ON u.id = s.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Student Marks
router.get('/marks', authenticate, authorize(['student', 'parent', 'professor']), async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId || (req as any).user.id;
    const query = `
      SELECT m.*, s.name as subject_name, s.code
      FROM marks m
      JOIN subjects s ON m.subject_id = s.id
      WHERE m.student_id = $1
      ORDER BY m.date DESC
    `;
    const result = await pool.query(query, [studentId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Student Attendance
router.get('/attendance', authenticate, authorize(['student', 'parent', 'professor']), async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId || (req as any).user.id;
    const query = `
      SELECT s.name as subject_name, s.code,
             COUNT(*) as total_classes,
             SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as classes_attended,
             ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2) as attendance_percentage
      FROM attendance a
      JOIN subjects s ON a.subject_id = s.id
      WHERE a.student_id = $1
      GROUP BY s.id, s.name, s.code
    `;
    const result = await pool.query(query, [studentId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Mental Health Assessment
router.get('/mental-health', authenticate, authorize(['student', 'parent', 'professor', 'counselor']), async (req: Request, res: Response) => {
  try {
    const studentId = req.query.studentId || (req as any).user.id;
    const query = `
      SELECT * FROM mental_health_assessments
      WHERE student_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [studentId]);
    
    if (result.rows.length === 0) {
      return res.json({ message: 'No assessment found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Submit Mental Health Assessment
router.post('/mental-health', authenticate, authorize(['student']), async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;
    const { answers } = req.body;

    // Call AI Engine to predict mental health
    const aiResponse = await fetch('http://localhost:5001/api/predict/mental-health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, student_id: studentId }),
    });

    const prediction = await aiResponse.json();

    const query = `
      INSERT INTO mental_health_assessments 
      (student_id, score, risk_level, assessment_data)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [
      studentId,
      prediction.score,
      prediction.risk_level,
      JSON.stringify(prediction),
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Career Paths
router.get('/career-paths', authenticate, authorize(['student', 'parent']), async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT cp.*, 
             (SELECT json_agg(r.*) FROM resources r 
              JOIN career_path_resources cpr ON r.id = cpr.resource_id
              WHERE cpr.career_path_id = cp.id) as resources
      FROM career_paths cp
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Select Career Path
router.post('/career-paths/:careerPathId/select', authenticate, authorize(['student']), async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;
    const { careerPathId } = req.params;

    const query = `
      INSERT INTO student_career_paths (student_id, career_path_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [studentId, careerPathId]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Skill Recommendations
router.get('/skills', authenticate, authorize(['student', 'parent']), async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;
    
    // Get student's current skills
    const skillsQuery = `
      SELECT sk.name, ss.proficiency_level
      FROM student_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.student_id = $1
    `;
    const skillsResult = await pool.query(skillsQuery, [studentId]);

    // Get student's career path
    const careerQuery = `
      SELECT cp.* FROM student_career_paths scp
      JOIN career_paths cp ON scp.career_path_id = cp.id
      WHERE scp.student_id = $1
      LIMIT 1
    `;
    const careerResult = await pool.query(careerQuery, [studentId]);

    res.json({
      currentSkills: skillsResult.rows,
      careerPath: careerResult.rows[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Request Professor Location
router.post('/professor-finder', authenticate, authorize(['student']), async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;
    const { professorId } = req.body;

    // Check if professor exists and is within college
    const professorQuery = 'SELECT * FROM professors WHERE id = $1';
    const professorResult = await pool.query(professorQuery, [professorId]);

    if (professorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Professor not found' });
    }

    const professor = professorResult.rows[0];
    const validUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    const requestQuery = `
      INSERT INTO professor_finder_requests 
      (student_id, professor_id, status, valid_until, latitude, longitude)
      VALUES ($1, $2, 'pending', $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(requestQuery, [
      studentId,
      professorId,
      validUntil,
      professor.latitude,
      professor.longitude,
    ]);

    res.json({
      message: 'Location request sent',
      request: result.rows[0],
      validFor: '15 minutes',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Request Appointment
router.post('/appointments', authenticate, authorize(['student']), async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;
    const { counselorId, professorId, type, notes } = req.body;

    if (!type || !['counseling', 'mentorship'].includes(type)) {
      return res.status(400).json({ message: 'Invalid appointment type' });
    }

    const query = `
      INSERT INTO appointments 
      (student_id, counselor_id, professor_id, type, status, notes, is_confidential)
      VALUES ($1, $2, $3, $4, 'pending', $5, true)
      RETURNING *
    `;
    const result = await pool.query(query, [
      studentId,
      counselorId || null,
      professorId || null,
      type,
      notes || null,
    ]);

    res.json({
      message: 'Appointment request submitted',
      appointment: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
