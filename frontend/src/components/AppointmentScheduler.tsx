import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { studentService } from '../services/api';
import { Appointment } from '../types';

const AppointmentScheduler: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'counseling' as 'counseling' | 'mentorship',
    counselorId: '',
    professorId: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await studentService.requestAppointment(formData);
      toast.success('Appointment request submitted');
      setFormData({
        type: 'counseling',
        counselorId: '',
        professorId: '',
        notes: '',
      });
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to submit appointment request');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Request Appointment'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Appointment Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="counseling">Counseling</option>
                <option value="mentorship">Mentorship</option>
              </select>
            </div>

            {formData.type === 'counseling' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Counselor ID (Optional)</label>
                <input
                  type="text"
                  value={formData.counselorId}
                  onChange={(e) => setFormData({ ...formData, counselorId: e.target.value })}
                  placeholder="Leave empty for automatic assignment"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            {formData.type === 'mentorship' && (
              <div>
                <label className="block text-sm font-semibold mb-2">Professor ID (Optional)</label>
                <input
                  type="text"
                  value={formData.professorId}
                  onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
                  placeholder="Leave empty for automatic assignment"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Describe your appointment request"
                rows={4}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold mb-4">Your Appointments</h3>
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments scheduled yet</p>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{apt.type.charAt(0).toUpperCase() + apt.type.slice(1)}</p>
                    <p className="text-sm text-gray-600">Status: {apt.status}</p>
                    <p className="text-sm text-gray-600">Requested: {new Date(apt.requestedDate).toLocaleDateString()}</p>
                    {apt.scheduledDate && (
                      <p className="text-sm text-green-600">Scheduled: {new Date(apt.scheduledDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-white text-sm ${
                      apt.status === 'scheduled'
                        ? 'bg-green-600'
                        : apt.status === 'pending'
                        ? 'bg-yellow-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    {apt.status.toUpperCase()}
                  </span>
                </div>
                {apt.notes && <p className="text-sm text-gray-700 mt-2">Note: {apt.notes}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
