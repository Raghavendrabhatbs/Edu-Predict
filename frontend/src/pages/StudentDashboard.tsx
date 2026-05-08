import React, { useState } from 'react';
import AcademicDashboard from '../components/AcademicDashboard';
import MentalHealthModule from '../components/MentalHealthModule';
import CareerPathModule from '../components/CareerPathModule';
import ProfessorFinder from '../components/ProfessorFinder';
import AppointmentScheduler from '../components/AppointmentScheduler';

type TabType = 'academic' | 'mental-health' | 'career' | 'professor-finder' | 'appointments';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('academic');

  const tabs = [
    { id: 'academic', label: '📚 Academic', icon: '📊' },
    { id: 'mental-health', label: '🧠 Mental Health', icon: '❤️' },
    { id: 'career', label: '🎯 Career Path', icon: '🚀' },
    { id: 'professor-finder', label: '🔍 Find Professor', icon: '👨‍🏫' },
    { id: 'appointments', label: '📅 Appointments', icon: '📞' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your personalized learning portal</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 px-4 py-4 font-semibold border-b-2 transition text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'academic' && <AcademicDashboard />}
          {activeTab === 'mental-health' && <MentalHealthModule />}
          {activeTab === 'career' && <CareerPathModule />}
          {activeTab === 'professor-finder' && <ProfessorFinder />}
          {activeTab === 'appointments' && <AppointmentScheduler />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
