import express, { Request, Response } from 'express';
import { pool } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get Professor Profile
router.get('/profile', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const query = `
      SELECT u.*, p.department, p.specialization, p.office_location
      FROM users u
      LEFT JOIN professors p ON u.id = p.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Professor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Students
router.get('/students', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const professorId = (req as any).user.id;
    const query = `
      SELECT DISTINCT u.id, u.first_name, u.last_name, u.email,
             s.usn, s.department, s.semester, s.cgpa, s.mental_health_score
      FROM users u
      JOIN students s ON u.id = s.id
      JOIN subjects sub ON s.department = sub.department
      WHERE sub.professor_id = $1
      ORDER BY u.last_name
    `;
    const result = await pool.query(query, [professorId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Upload Marks
router.post('/marks', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const { marks } = req.body;
    
    if (!Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ message: 'Invalid marks data' });
    }

    const query = `
      INSERT INTO marks (student_id, subject_id, marks, max_marks, test_type)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (student_id, subject_id) DO UPDATE SET marks = $3
      RETURNING *
    `;

    const results = [];
    for (const mark of marks) {
      const result = await pool.query(query, [
        mark.studentId,
        mark.subjectId,
        mark.marks,
        mark.maxMarks || 100,
        mark.testType || 'exam',
      ]);
      results.push(result.rows[0]);
    }

    res.json({ message: 'Marks uploaded successfully', marks: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update Attendance
router.post('/attendance', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const { attendance } = req.body;
    
    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ message: 'Invalid attendance data' });
    }

    const query = `
      INSERT INTO attendance (student_id, subject_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const results = [];
    for (const record of attendance) {
      const result = await pool.query(query, [
        record.studentId,
        record.subjectId,
        record.status, // 'present', 'absent', 'leave'
      ]);
      results.push(result.rows[0]);
    }

    res.json({ message: 'Attendance updated', records: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Student Performance
router.get('/students/:studentId/performance', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    
    // Get marks
    const marksQuery = `
      SELECT AVG(marks::numeric) as average_marks, 
             COUNT(*) as total_assessments
      FROM marks
      WHERE student_id = $1
    `;
    const marksResult = await pool.query(marksQuery, [studentId]);

    // Get attendance
    const attendanceQuery = `
      SELECT ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2) as attendance_percentage
      FROM attendance
      WHERE student_id = $1
    `;
    const attendanceResult = await pool.query(attendanceQuery, [studentId]);

    // Get mental health
    const mentalHealthQuery = `
      SELECT score, risk_level FROM mental_health_assessments
      WHERE student_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `;
    const mentalHealthResult = await pool.query(mentalHealthQuery, [studentId]);

    res.json({
      studentId,
      academicPerformance: marksResult.rows[0],
      attendance: attendanceResult.rows[0],
      mentalHealth: mentalHealthResult.rows[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Mental Health Reports
router.get('/mental-health-reports', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT u.id, u.first_name, u.last_name, 
             mha.score, mha.risk_level, mha.timestamp
      FROM mental_health_assessments mha
      JOIN students s ON mha.student_id = s.id
      JOIN users u ON s.id = u.id
      ORDER BY mha.timestamp DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Suggest Skill Certification
router.post('/students/:studentId/skills', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { skill } = req.body;

    // Find or create skill
    let skillId: string;
    const skillQuery = 'SELECT id FROM skills WHERE name = $1';
    let skillResult = await pool.query(skillQuery, [skill]);

    if (skillResult.rows.length === 0) {
      const createQuery = `
        INSERT INTO skills (name, category)
        VALUES ($1, 'suggested')
        RETURNING id
      `;
      skillResult = await pool.query(createQuery, [skill]);
    }

    skillId = skillResult.rows[0].id;

    // Add skill to student
    const addSkillQuery = `
      INSERT INTO student_skills (student_id, skill_id, proficiency_level)
      VALUES ($1, $2, 'beginner')
      ON CONFLICT (student_id, skill_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(addSkillQuery, [studentId, skillId]);

    res.json({
      message: 'Skill suggestion added',
      skill: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Upload Notes
router.post('/notes', authenticate, authorize(['professor']), async (req: Request, res: Response) => {
  try {
    const professorId = (req as any).user.id;
    const { subjectId, title, description, fileUrl } = req.body;

    const query = `
      INSERT INTO notes (professor_id, subject_id, title, description, file_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      professorId,
      subjectId,
      title,
      description,
      fileUrl,
    ]);

    res.json({
      message: 'Notes uploaded successfully',
      note: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
