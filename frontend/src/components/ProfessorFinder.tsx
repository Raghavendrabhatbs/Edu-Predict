import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { studentService } from '../services/api';

const ProfessorFinder: React.FC = () => {
  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<any | null>(null);
  const [locationRequest, setLocationRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock professors data - in real app, this would come from API
  const mockProfessors = [
    {
      id: '1',
      firstName: 'Dr. John',
      lastName: 'Smith',
      department: 'Computer Science',
      specialization: 'AI & ML',
      officeLocation: 'Building A, Room 301',
    },
    {
      id: '2',
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      department: 'Computer Science',
      specialization: 'Web Development',
      officeLocation: 'Building B, Room 205',
    },
    {
      id: '3',
      firstName: 'Prof. Mike',
      lastName: 'Williams',
      department: 'Data Science',
      specialization: 'Big Data',
      officeLocation: 'Building C, Room 102',
    },
  ];

  useEffect(() => {
    setProfessors(mockProfessors);
  }, []);

  const handleRequestLocation = async (professor: any) => {
    try {
      setLoading(true);
      const response = await studentService.requestProfessorLocation(professor.id);
      setLocationRequest(response.data.request);
      setSelectedProfessor(professor);
      toast.success('Location request sent. Valid for 15 minutes');
    } catch (error) {
      toast.error('Failed to request location');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Find Professor</h2>

      {locationRequest ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Location Details</h3>
            <button
              onClick={() => {
                setLocationRequest(null);
                setSelectedProfessor(null);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold">
                {selectedProfessor.firstName} {selectedProfessor.lastName}
              </p>
              <p className="text-gray-600">{selectedProfessor.specialization}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="font-semibold mb-2">📍 Location</p>
              <p className="text-gray-800">{selectedProfessor.officeLocation}</p>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="font-semibold mb-2">Coordinates</p>
              <p className="text-gray-800">
                Lat: {locationRequest.latitude?.toFixed(4)}, Long: {locationRequest.longitude?.toFixed(4)}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded">
              <p className="font-semibold mb-2">⏱️ Valid Until</p>
              <p className="text-red-600 font-bold">
                {new Date(locationRequest.valid_until).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">This location is valid for 15 minutes from the request time</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((professor) => (
            <div key={professor.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-2">
                {professor.firstName} {professor.lastName}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{professor.specialization}</p>
              <p className="text-gray-600 text-sm mb-4">Dept: {professor.department}</p>
              <p className="text-gray-700 text-sm mb-4">
                📍 {professor.officeLocation}
              </p>
              <button
                onClick={() => handleRequestLocation(professor)}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Requesting...' : 'Get Location'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorFinder;
