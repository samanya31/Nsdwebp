import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplication } from '../context/ApplicationContext';
import {
  User,
  GraduationCap,
  Eye,
  Upload,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Clock,
  Home,
} from 'lucide-react';

import nsdLogo from '../assets/NSDLOGO.png';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/dashboard/personal-details', label: 'Personal Details', icon: User },
  { path: '/dashboard/academic-details', label: 'Academic Details', icon: GraduationCap },
  { path: '/dashboard/upload-documents', label: 'Upload Documents', icon: Upload },
  { path: '/dashboard/review-details', label: 'Review Details', icon: Eye },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { applicationData } = useApplication();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusBadge = () => {
    if (applicationData?.status === 'submitted') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-xs font-semibold">
          <CheckCircle className="h-3 w-3" />
          Submitted
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-xs font-semibold animate-pulse">
        <Clock className="h-3 w-3" />
        In Progress
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-soft">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block w-12 h-12 flex items-center justify-center">
                  <img src={nsdLogo} alt="NSD Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[#d84315] uppercase tracking-wide">
                    National School of Drama
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Admission Portal</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {applicationData?.personal_details?.fullName ||
                    user?.user_metadata?.full_name ||
                    user?.user_metadata?.username ||
                    user?.email?.split('@')[0] ||
                    'Student'}
                </p>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <p className="text-xs text-gray-500">
                    ID: {applicationData?.application_id?.slice(0, 10) || '---'}
                  </p>
                  {getStatusBadge()}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:block p-2.5 text-gray-600 hover:text-[#d84315] hover:bg-orange-50 rounded-xl transition-all duration-300 group"
                title="Logout"
              >
                <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Elegant Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-72 bg-white border-r border-gray-200 shadow-medium
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            pt-16 lg:pt-0
          `}
        >
          <nav className="h-full px-4 py-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-2">
              <div className="mb-6">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
              </div>
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isComplete = index < navItems.findIndex(nav => nav.path === location.pathname);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-lg mx-2
                      transition-all duration-300 relative overflow-hidden font-medium
                      ${isActive
                        ? 'bg-[#FFF8F0] text-[#d84315] shadow-sm'
                        : isComplete
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d84315] rounded-r-full" />
                    )}
                    <div className="relative flex items-center gap-3 w-full">
                      <div className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-white text-[#d84315]' : isComplete ? 'bg-emerald-100' : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1 text-sm font-sans">{item.label}</span>
                      {isComplete && (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="mt-8 px-2 border-t border-gray-100 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                  <LogOut className="h-5 w-5" />
                </div>
                <span className="font-sans font-semibold tracking-wide">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
