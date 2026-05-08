import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { studentService } from '../services/api';
import { Student, Mark, Attendance } from '../types';

const AcademicDashboard: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, marksRes, attendanceRes] = await Promise.all([
        studentService.getProfile(),
        studentService.getMarks(),
        studentService.getAttendance(),
      ]);

      setStudent(profileRes.data);
      setMarks(marksRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      toast.error('Failed to fetch academic data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Academic Dashboard</h2>
        {student && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 text-sm">CGPA</p>
              <p className="text-2xl font-bold text-blue-600">{student.cgpa?.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Department</p>
              <p className="text-xl font-bold text-green-600">{student.department}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Semester</p>
              <p className="text-2xl font-bold text-purple-600">{student.semester}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-gray-600 text-sm">USN</p>
              <p className="text-lg font-bold text-orange-600">{student.usn}</p>
            </div>
          </div>
        )}
      </div>

      {/* Marks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Subject-wise Marks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-center">Marks</th>
                <th className="px-4 py-2 text-center">Max Marks</th>
                <th className="px-4 py-2 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <tr key={mark.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{(mark as any).subject_name}</td>
                  <td className="px-4 py-2">{(mark as any).code}</td>
                  <td className="px-4 py-2 text-center font-semibold">{mark.marks}</td>
                  <td className="px-4 py-2 text-center">{mark.maxMarks}</td>
                  <td className="px-4 py-2 text-center">
                    {((mark.marks / mark.maxMarks) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {marks.length === 0 && (
          <p className="text-center py-4 text-gray-500">No marks recorded yet</p>
        )}
      </div>

      {/* Attendance Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Attendance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-center">Total Classes</th>
                <th className="px-4 py-2 text-center">Classes Attended</th>
                <th className="px-4 py-2 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{(record as any).subject_name}</td>
                  <td className="px-4 py-2 text-center">{(record as any).total_classes}</td>
                  <td className="px-4 py-2 text-center">{(record as any).classes_attended}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`font-bold ${
                        (record as any).attendance_percentage >= 75
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {(record as any).attendance_percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {attendance.length === 0 && (
          <p className="text-center py-4 text-gray-500">No attendance data available</p>
        )}
      </div>
    </div>
  );
};

export default AcademicDashboard;
