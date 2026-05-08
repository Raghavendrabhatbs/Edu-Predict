import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { studentService } from '../services/api';
import { CareerPath } from '../types';

const CareerPathModule: React.FC = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      setLoading(true);
      const response = await studentService.getCareerPaths();
      setCareerPaths(response.data);
    } catch (error) {
      toast.error('Failed to fetch career paths');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPath = async (pathId: string) => {
    try {
      await studentService.selectCareerPath(pathId);
      const selected = careerPaths.find((p) => p.id === pathId);
      setSelectedPath(selected || null);
      toast.success('Career path selected successfully');
    } catch (error) {
      toast.error('Failed to select career path');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Career Path Prediction</h2>

      {selectedPath ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">{selectedPath.name}</h3>
          <p className="text-gray-600 mb-4">{selectedPath.description}</p>

          <div className="mb-6">
            <h4 className="font-bold mb-3">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPath.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold mb-3">Learning Resources</h4>
            <div className="space-y-2">
              {selectedPath.resources?.map((resource, index) => (
                <div key={index} className="border p-3 rounded hover:bg-gray-50">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {resource.title}
                  </a>
                  <p className="text-sm text-gray-600">
                    {resource.platform} • {resource.type} • {resource.difficulty}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold mb-3">Learning Roadmap</h4>
            <div className="space-y-2">
              {selectedPath.roadmap?.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500">
                    Progress: {item.progress}% • Deadline: {new Date(item.deadline).toLocaleDateString()}
                  </p>
                  <div className="bg-gray-200 h-2 mt-2 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedPath(null)}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Paths
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{path.name}</h3>
              <p className="text-gray-600 mb-4">{path.description}</p>
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {path.skills?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                  {path.skills && path.skills.length > 3 && (
                    <span className="text-xs text-gray-600">+{path.skills.length - 3} more</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSelectPath(path.id)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View & Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerPathModule;
