import React, { useState, useEffect } from 'react';
import { professorService } from '../services/api';
import toast from 'react-hot-toast';

const ProfessorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'performance' | 'mental-health'>('students');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await professorService.getStudents();
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Professor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your students and monitor their progress</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {[
              { id: 'students' as const, label: '👥 My Students' },
              { id: 'performance' as const, label: '📈 Performance Analytics' },
              { id: 'mental-health' as const, label: '🧠 Mental Health Reports' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 font-semibold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">My Students</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
                    >
                      <p className="font-bold text-lg">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-gray-600 text-sm">USN: {student.usn}</p>
                      <p className="text-gray-600 text-sm">Dept: {student.department}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">CGPA:</span> {student.cgpa?.toFixed(2)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          View Details
                        </button>
                        <button className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                          Upload Marks
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Performance Analytics</h2>
              {selectedStudent ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="font-bold text-lg">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </p>
                    <p className="text-gray-600">USN: {selectedStudent.usn}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-100 p-4 rounded">
                      <p className="text-gray-700 text-sm">Current CGPA</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedStudent.cgpa?.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded">
                      <p className="text-gray-700 text-sm">Mental Health Score</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedStudent.mental_health_score || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">Select a student to view performance details</p>
              )}
            </div>
          )}

          {activeTab === 'mental-health' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Mental Health Reports</h2>
              <p className="text-gray-600">View mental health assessments and risk levels of your students</p>
              <div className="mt-4 space-y-3">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-600">USN: {student.usn}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        Score: {student.mental_health_score || 'No data'}
                      </p>
                      <button className="text-blue-600 text-sm hover:underline mt-1">View Report</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
