import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { setCredentials } from './authSlice';
import { toggleTheme } from '../theme/themeSlice';
import api from '../../config/api';

const Login: React.FC = () => {
const [email, setEmail] = useState('admin@gatherly.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // --- TEMPORARY UI MOCK (Bypassing the real API Gateway) ---
      // We will replace this with the real 'api.post' when the backend is ready
      await new Promise((resolve) => setTimeout(resolve, 800)); // Fake network delay

      let responseData;
      
      if (email === 'admin@gatherly.com' && password === 'admin123') {
        // Fake a successful Admin login response
        responseData = {
          token: 'mock-jwt-token-admin-12345',
          role: 'ADMIN',
          name: 'Super Admin'
        };
      } else if (email === 'user@gatherly.com' && password === 'user123') {
        // Fake a successful Standard User login response
        responseData = {
          token: 'mock-jwt-token-user-67890',
          role: 'USER',
          name: 'Standard User'
        };
      } else {
        // Fake a backend 401 error
        throw { response: { data: { message: 'Invalid credentials in mock database.' } } };
      }

      const { token, role, name } = responseData;
      // ------------------------------------------------------------

      // 1. Save data to Redux
      dispatch(setCredentials({ user: name, email, role, token }));

      // 2. Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/events');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">

      <div className="w-full max-w-md p-8 space-y-6 bg-surface border border-outline rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Gatherly</h1>
          <p className="mt-2 text-secondary">Sign in to manage your events</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-on-error bg-error rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="admin@gatherly.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-on-primary bg-primary rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;