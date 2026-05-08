import express, { Request, Response } from 'express';
import { pool } from '../index';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Get Counselor Profile
router.get('/profile', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const query = `
      SELECT u.*, c.specialization, c.license_number, c.office_location
      FROM users u
      LEFT JOIN counselors c ON u.id = c.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Mental Health Dashboard
router.get('/dashboard', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email,
             s.usn, s.department, s.cgpa,
             mha.score, mha.risk_level, mha.timestamp
      FROM mental_health_assessments mha
      JOIN students s ON mha.student_id = s.id
      JOIN users u ON s.id = u.id
      ORDER BY mha.score ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get At-Risk Students
router.get('/at-risk-students', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email,
             s.usn, s.department, s.cgpa,
             mha.score, mha.risk_level, mha.timestamp
      FROM mental_health_assessments mha
      JOIN students s ON mha.student_id = s.id
      JOIN users u ON s.id = u.id
      WHERE mha.risk_level IN ('high', 'critical')
      ORDER BY mha.score ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get Appointment Requests
router.get('/appointments/requests', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const counselorId = (req as any).user.id;
    const query = `
      SELECT a.*, u.first_name, u.last_name, u.email, s.usn
      FROM appointments a
      JOIN students s ON a.student_id = s.id
      JOIN users u ON s.id = u.id
      WHERE a.counselor_id = $1 OR a.counselor_id IS NULL
      AND a.status = 'pending'
      ORDER BY a.requested_date DESC
    `;
    const result = await pool.query(query, [counselorId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Accept Appointment
router.put('/appointments/:appointmentId', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { scheduledDate } = req.body;
    const counselorId = (req as any).user.id;

    if (!scheduledDate) {
      return res.status(400).json({ message: 'Scheduled date is required' });
    }

    const query = `
      UPDATE appointments
      SET status = 'scheduled', 
          scheduled_date = $1,
          counselor_id = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [scheduledDate, counselorId, appointmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({
      message: 'Appointment accepted and scheduled',
      appointment: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Request Appointment with Student
router.post('/appointments/request/:studentId', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const counselorId = (req as any).user.id;

    const query = `
      INSERT INTO appointments (student_id, counselor_id, type, status)
      VALUES ($1, $2, 'counseling', 'pending')
      RETURNING *
    `;
    const result = await pool.query(query, [studentId, counselorId]);

    res.json({
      message: 'Appointment request sent to student',
      appointment: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Suggest Follow-up Appointment
router.post('/appointments/:appointmentId/follow-up', authenticate, authorize(['counselor']), async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { followUpDate } = req.body;
    const counselorId = (req as any).user.id;

    // Get original appointment
    const getQuery = 'SELECT * FROM appointments WHERE id = $1';
    const appointmentResult = await pool.query(getQuery, [appointmentId]);

    if (appointmentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const originalAppointment = appointmentResult.rows[0];

    // Create follow-up appointment
    const createQuery = `
      INSERT INTO appointments 
      (student_id, counselor_id, type, status, requested_date, scheduled_date)
      VALUES ($1, $2, 'counseling', 'scheduled', $3, $4)
      RETURNING *
    `;
    const result = await pool.query(createQuery, [
      originalAppointment.student_id,
      counselorId,
      new Date(),
      followUpDate,
    ]);

    res.json({
      message: 'Follow-up appointment scheduled',
      appointment: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
