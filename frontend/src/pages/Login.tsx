import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
    usn: '',
    department: '',
    semester: '1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login(formData.email, formData.password);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful');
        
        // Redirect based on role
        const role = response.data.user.role;
        navigate(`/${role}/dashboard`);
      } else {
        const response = await authService.register(formData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Registration successful');
        
        const role = response.data.user.role;
        navigate(`/${role}/dashboard`);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">Edu-Predict</h1>
          <p className="text-blue-100 mt-2">AI-Powered Educational Portal</p>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 font-semibold transition ${
                isLogin
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 font-semibold transition ${
                !isLogin
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration Only Fields */}
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="professor">Professor</option>
                  <option value="counselor">Counselor</option>
                </select>

                {/* Student-specific fields */}
                {formData.role === 'student' && (
                  <>
                    <input
                      type="text"
                      name="usn"
                      placeholder="USN (University Serial Number)"
                      value={formData.usn}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      name="department"
                      placeholder="Department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                    />
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}

            {/* Common Fields */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong>Student:</strong> student@example.com / password</p>
              <p><strong>Professor:</strong> prof@example.com / password</p>
              <p><strong>Counselor:</strong> counselor@example.com / password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
