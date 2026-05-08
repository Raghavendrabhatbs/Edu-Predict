import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { studentService } from '../services/api';
import { MentalHealthAssessment, MentalHealthQuestion } from '../types';

const MentalHealthModule: React.FC = () => {
  const [assessment, setAssessment] = useState<MentalHealthAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  // Sample mental health questions
  const questions: MentalHealthQuestion[] = [
    {
      id: '1',
      question: 'How often do you feel stressed about your studies?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      weight: 1,
      category: 'stress',
    },
    {
      id: '2',
      question: 'Do you have difficulty sleeping?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      weight: 1,
      category: 'sleep',
    },
    {
      id: '3',
      question: 'How is your motivation level for studies?',
      options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
      weight: 1,
      category: 'motivation',
    },
    {
      id: '4',
      question: 'Do you feel anxious about your future?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
      weight: 1,
      category: 'anxiety',
    },
    {
      id: '5',
      question: 'How would you rate your overall mental well-being?',
      options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
      weight: 1,
      category: 'wellbeing',
    },
  ];

  useEffect(() => {
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      const response = await studentService.getMentalHealthAssessment();
      setAssessment(response.data);
    } catch (error) {
      console.error('Failed to fetch assessment', error);
    }
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitAssessment = async () => {
    try {
      setLoading(true);
      const response = await studentService.submitMentalHealthAssessment(answers);
      setAssessment(response.data);
      setShowQuestions(false);
      setAnswers([]);
      toast.success('Assessment submitted successfully');
    } catch (error) {
      toast.error('Failed to submit assessment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mental Health Status Card */}
      {assessment && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Mental Health Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Current Score</p>
              <p className="text-3xl font-bold text-blue-600">{assessment.score}/100</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Risk Level</p>
              <p className={`text-2xl font-bold ${getRiskColor(assessment.riskLevel)}`}>
                {assessment.riskLevel.toUpperCase()}
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded">
              <p className="text-gray-600 text-sm">Last Assessment</p>
              <p className="text-lg font-bold text-indigo-600">
                {new Date(assessment.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Questions */}
      {showQuestions ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-6">Mental Health Assessment</h3>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border-b pb-6">
                <p className="font-semibold mb-3">
                  {index + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={optionIndex}
                        checked={answers[index] === optionIndex}
                        onChange={() => handleAnswerChange(index, optionIndex)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={submitAssessment}
              disabled={loading || answers.length !== questions.length}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
            <button
              onClick={() => {
                setShowQuestions(false);
                setAnswers([]);
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowQuestions(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Take Assessment
        </button>
      )}
    </div>
  );
};

export default MentalHealthModule;
