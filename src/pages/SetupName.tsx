import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SetupName() {
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setFullName: updateFullName, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!fullName.trim()) {
            setError('Full Name is required');
            return;
        }

        if (fullName.length < 3) {
            setError('Full Name must be at least 3 characters long');
            return;
        }

        setLoading(true);
        try {
            await updateFullName(fullName);
            navigate('/dashboard/personal-details');
        } catch (err: any) {
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gov-gray flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo/Institution Name */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gov-blue rounded-lg mb-4">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gov-navy">
                        Academic Admission Portal
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Complete Your Profile
                    </p>
                </div>

                {/* Setup Card */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-semibold text-gov-navy mb-2 text-center">
                        Welcome! One Last Step
                    </h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Hi {user?.email}! Please enter your full name to continue.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                minLength={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gov-blue focus:border-transparent outline-none"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gov-blue text-white py-2.5 px-4 rounded-md font-medium hover:bg-gov-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Continue to Dashboard'}
                        </button>
                    </form>
                </div>

                {/* Footer Disclaimer */}
                <p className="text-xs text-gray-500 text-center mt-6">
                    Your account information is secure and protected by government data security standards.
                </p>
            </div>
        </div>
    );
}
