import React, { useState } from 'react';
import { Mail, Lock, LogIn, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const LoginForm = ({ onSwitchToSignup, onSwitchToAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PEHENNAWA</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in
            </button>

            <div className="flex flex-col space-y-3 text-center">
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-purple-600 hover:text-purple-500 text-sm font-medium"
              >
                Don't have an account? Sign up
              </button>
              
              <button
                type="button"
                onClick={onSwitchToAdmin}
                className="flex items-center justify-center space-x-2 text-amber-600 hover:text-amber-500 text-sm font-medium"
              >
                <Crown className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-2">Demo credentials:</p>
              <p className="text-xs text-gray-700">User: john@example.com / password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;