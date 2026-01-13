import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplication } from '../context/ApplicationContext';
import { User, GraduationCap, Eye, Upload, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import maleForm from '../assets/maleform.png';
import femaleForm from '../assets/femaleform.png';
import GenderSelectionModal from '../components/GenderSelectionModal';

interface NavCard {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
    color: string;
}

const navCards: NavCard[] = [
    {
        title: 'Personal Details',
        description: 'Complete your personal information',
        icon: User,
        path: '/dashboard/personal-details',
        color: 'from-blue-500 to-blue-600',
    },
    {
        title: 'Academic Details',
        description: 'Add your educational background',
        icon: GraduationCap,
        path: '/dashboard/academic-details',
        color: 'from-purple-500 to-purple-600',
    },
    {
        title: 'Review Details',
        description: 'Review your application',
        icon: Eye,
        path: '/dashboard/review-details',
        color: 'from-emerald-500 to-emerald-600',
    },
    {
        title: 'Upload Documents',
        description: 'Submit required documents',
        icon: Upload,
        path: '/dashboard/upload-documents',
        color: 'from-amber-500 to-amber-600',
    },
];

export default function DashboardHome() {
    const navigate = useNavigate();
    const { user, setFullName } = useAuth();
    const { applicationData, updatePersonalDetails } = useApplication();

    const userName = applicationData?.personal_details?.fullName ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.username ||
        user?.email?.split('@')[0] ||
        'Student';

    // Check if we need to ask for name (rely on persistent application data)
    // We strictly check application DB. If it's missing, we ask.
    // This covers both new Google users and any legacy users without profiles.
    const needsNameSetup = !applicationData?.personal_details?.fullName;

    const isGoogleAuth = user?.identities?.some((identity: any) => identity.provider === 'google');

    // For Google users, we force them to enter name manually (empty default).
    // For Email users, we pre-fill with what they signed up with (if available).
    const initialModalName = isGoogleAuth ? '' : (user?.user_metadata?.full_name || '');

    const gender = applicationData?.personal_details?.gender?.toLowerCase();
    const illustrationImage = gender === 'female' ? femaleForm : maleForm;

    const isSubmitted = applicationData?.status === 'submitted';

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div
                className="relative overflow-hidden rounded-2xl shadow-xl"
                style={{ background: 'linear-gradient(90deg, #d35933ff 0%, #f0854cff 100%)' }}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCIvPjwvc3ZnPg==')] opacity-20"></div>

                <div className="relative px-6 py-4 md:px-12 lg:py-0">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 h-full">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '40px', fontWeight: 600, lineHeight: 1.25 }}>
                                Welcome back, {userName}!
                            </h1>
                            <p className="text-white/90 text-lg md:text-xl font-sans mb-4">
                                Always stay updated in your student portal
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold font-sans hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default">
                                {isSubmitted ? (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        Application Submitted
                                    </>
                                ) : (
                                    <>
                                        <Clock className="h-5 w-5" />
                                        Application In Progress
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Illustration */}
                        <div className="relative w-52 h-52 lg:w-56 lg:h-56 flex-shrink-0">
                            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                            <img
                                src={illustrationImage}
                                alt="Student illustration"
                                className="relative w-full h-full object-contain  scale-[1.75] sm:scale-[1.75]
    md:scale-[2]
    lg:scale-[1.5] drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {navCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <button
                                key={card.path}
                                onClick={() => navigate(card.path)}
                                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1 text-left"
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} mb-4 group-hover:bg-white/20 transition-colors`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 font-sans transition-colors">
                                        {card.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 group-hover:text-white/90 mb-4 font-sans transition-colors">
                                        {card.description}
                                    </p>

                                    <div className="flex items-center text-sm font-semibold text-gray-900 group-hover:text-white transition-colors font-sans">
                                        Continue
                                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Application Status Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 font-sans">Application Status</h2>
                    {applicationData?.application_id && (
                        <span className="text-sm text-gray-600 font-mono font-sans">
                            ID: {applicationData.application_id.slice(0, 12)}...
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900 font-sans">Personal</span>
                        </div>
                        <p className="text-xs text-blue-700 font-sans">
                            {applicationData?.personal_details ? 'Completed' : 'Pending'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-900 font-sans">Academic</span>
                        </div>
                        <p className="text-xs text-purple-700 font-sans">
                            {applicationData?.academic_details ? 'Completed' : 'Pending'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-5 w-5 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-900 font-sans">Review</span>
                        </div>
                        <p className="text-xs text-emerald-700 font-sans">
                            {applicationData?.status === 'submitted' ? 'Completed' : 'Pending'}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Upload className="h-5 w-5 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-900 font-sans">Documents</span>
                        </div>
                        <p className="text-xs text-amber-700 font-sans">
                            {applicationData?.documents ? 'Uploaded' : 'Pending'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gender Selection Modal */}
            <GenderSelectionModal
                isOpen={!gender && (!applicationData?.personal_details?.gender || needsNameSetup)}
                askForName={needsNameSetup}
                onSelect={async (data) => {
                    // Update gender in application data
                    const currentDetails = applicationData?.personal_details || {
                        fullName: data.fullName || initialModalName || userName,
                        fatherName: '',
                        motherName: '',
                        dateOfBirth: '',
                        address: '',
                        category: '',
                    };

                    await updatePersonalDetails({
                        ...currentDetails,
                        gender: data.gender,
                        fullName: data.fullName || currentDetails.fullName // ensure name is saved in DB too
                    });

                    // If name was updated, update user metadata too
                    if (data.fullName && setFullName) {
                        await setFullName(data.fullName);
                    }
                }}
                userName={!needsNameSetup ? userName : ''} // If setting up name, don't show "Welcome, [Email]"
                initialName={initialModalName}
            />
        </div>
    );
}
