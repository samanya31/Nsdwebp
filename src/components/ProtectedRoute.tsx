import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, needsNameSetup } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user needs to set up name and not already on setup page, redirect
  if (needsNameSetup && location.pathname !== '/setup-name') {
    return <Navigate to="/setup-name" replace />;
  }

  // If user is on setup page but doesn't need setup, redirect to dashboard
  if (location.pathname === '/setup-name' && !needsNameSetup) {
    return <Navigate to="/dashboard/personal-details" replace />;
  }

  return <>{children}</>;
}
