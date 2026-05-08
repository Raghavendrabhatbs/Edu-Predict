import React, { useState, useEffect } from 'react';
import { counselorService } from '../services/api';
import toast from 'react-hot-toast';

const CounselorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'at-risk' | 'appointments'>('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, apptRes] = await Promise.all([
        counselorService.getMentalHealthDashboard(),
        counselorService.getAppointmentRequests(),
      ]);
      setStudents(dashRes.data);
      setAppointments(apptRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAppointment = async (appointmentId: string) => {
    try {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 3); // Schedule 3 days from now
      
      await counselorService.acceptAppointment(appointmentId, scheduledDate);
      toast.success('Appointment accepted and scheduled');
      fetchData();
    } catch (error) {
      toast.error('Failed to accept appointment');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Counselor Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor student mental health and manage appointments</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {[
              { id: 'dashboard' as const, label: '📊 Mental Health Dashboard' },
              { id: 'at-risk' as const, label: '⚠️ At-Risk Students' },
              { id: 'appointments' as const, label: '📅 Appointments' },
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
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : activeTab === 'dashboard' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Mental Health Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-gray-700 text-sm">Total Students Assessed</p>
                  <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-gray-700 text-sm">Low Risk Students</p>
                  <p className="text-3xl font-bold text-green-600">
                    {students.filter((s) => s.risk_level === 'low').length}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-4">Student Mental Health Overview</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">USN</th>
                        <th className="px-4 py-2 text-center">Score</th>
                        <th className="px-4 py-2 text-center">Risk Level</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 font-semibold">
                            {student.first_name} {student.last_name}
                          </td>
                          <td className="px-4 py-2">{student.usn}</td>
                          <td className="px-4 py-2 text-center font-bold">{student.score}</td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`px-3 py-1 rounded text-white text-sm ${
                                student.risk_level === 'critical'
                                  ? 'bg-red-600'
                                  : student.risk_level === 'high'
                                  ? 'bg-orange-600'
                                  : student.risk_level === 'medium'
                                  ? 'bg-yellow-600'
                                  : 'bg-green-600'
                              }`}
                            >
                              {student.risk_level.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button className="text-blue-600 hover:underline text-sm">Schedule</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'at-risk' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">At-Risk Students</h2>
              <div className="space-y-3">
                {students
                  .filter((s) => ['high', 'critical'].includes(s.risk_level))
                  .map((student) => (
                    <div key={student.id} className="border-l-4 border-red-600 p-4 bg-red-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-gray-600 text-sm">USN: {student.usn}</p>
                          <p className="text-sm mt-2">
                            <span className="font-semibold">Mental Health Score:</span> {student.score}/100
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Risk Level:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                                student.risk_level === 'critical' ? 'bg-red-600' : 'bg-orange-600'
                              }`}
                            >
                              {student.risk_level.toUpperCase()}
                            </span>
                          </p>
                        </div>
                        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                          Contact Now
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Appointment Requests</h2>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="border rounded p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">
                          {apt.first_name} {apt.last_name}
                        </p>
                        <p className="text-gray-600 text-sm">USN: {apt.usn}</p>
                        <p className="text-sm mt-2">{apt.notes}</p>
                      </div>
                      <button
                        onClick={() => handleAcceptAppointment(apt.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Accept & Schedule
                      </button>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-center py-8 text-gray-600">No appointment requests</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselorDashboard;
