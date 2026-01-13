import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Loader from './components/Loader';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SetupName from './pages/SetupName';
import DashboardHome from './pages/DashboardHome';
import PersonalDetails from './pages/PersonalDetails';
import AcademicDetails from './pages/AcademicDetails';
import ReviewDetails from './pages/ReviewDetails';
import UploadDocuments from './pages/UploadDocuments';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="animate-fade-in">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/setup-name"
              element={
                <ProtectedRoute>
                  <SetupName />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ApplicationProvider>
                    <DashboardLayout>
                      <DashboardHome />
                    </DashboardLayout>
                  </ApplicationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/personal-details"
              element={
                <ProtectedRoute>
                  <ApplicationProvider>
                    <DashboardLayout>
                      <PersonalDetails />
                    </DashboardLayout>
                  </ApplicationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/academic-details"
              element={
                <ProtectedRoute>
                  <ApplicationProvider>
                    <DashboardLayout>
                      <AcademicDetails />
                    </DashboardLayout>
                  </ApplicationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/review-details"
              element={
                <ProtectedRoute>
                  <ApplicationProvider>
                    <DashboardLayout>
                      <ReviewDetails />
                    </DashboardLayout>
                  </ApplicationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/upload-documents"
              element={
                <ProtectedRoute>
                  <ApplicationProvider>
                    <DashboardLayout>
                      <UploadDocuments />
                    </DashboardLayout>
                  </ApplicationProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
