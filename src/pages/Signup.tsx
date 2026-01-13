import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import folkDancer from '../assets/fold dancer.png';
import foldDancer2 from '../assets/fold dancer 2.png';
import nsdLogo from '../assets/NSDLOGO.png';
import bgmind from '../assets/bgmind.png';
import akamLogo from '../assets/Azadi-Ka-Amrit-Mahotsav-Logo.png';

export default function Signup() {
    const [view, setView] = useState<'signup' | 'verify'>('signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');

    const { signUpWithOtp, signUpWithGoogle, verifyOtp, resendOtp } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignup = async () => {
        setError('');
        setResendMessage('');
        setLoading(true);
        try {
            await signUpWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google signup failed');
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            setError('Please accept the terms & policy to continue');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setResendMessage('');
        setLoading(true);
        try {
            // Pass empty string for fullName (will be collected on Dashboard)
            await signUpWithOtp(email, '', password);
            setView('verify');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResendMessage('');
        setLoading(true);
        try {
            if (verifyOtp) {
                await verifyOtp(email, otp);
                navigate('/dashboard/personal-details');
            } else {
                throw new Error("Verification method not implemented in context");
            }

        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setResendMessage('');
        setLoading(true);
        try {
            if (resendOtp) {
                await resendOtp(email);
                setResendMessage('Verification code sent successfully!');
            } else {
                throw new Error("Resend function not available");
            }
        } catch (err: any) {
            setError(err.message || 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative">
            {/* Left Side - Folk Dancer Full Image (42%) */}
            <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.2)] z-10">
                <img
                    src={folkDancer}
                    alt="Folk Dancer"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            {/* Right Side - Form Section (58%) */}
            <div className="w-full lg:w-[58%] flex flex-col items-center lg:justify-center bg-nsd-beige relative overflow-hidden">
                {/* Mobile Top Image - Relative Block */}
                <div className="w-full h-72 lg:hidden relative shrink-0">
                    <img src={foldDancer2} alt="Folk Dancer" className="w-full h-full object-cover opacity-60 min-[742px]:hidden" />
                    <img src={folkDancer} alt="Folk Dancer" className="w-full h-full object-cover opacity-60 hidden min-[742px]:block" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-nsd-beige to-transparent"></div>
                </div>

                {/* Logos */}
                <div className="hidden lg:block absolute left-4 top-4">
                    <img src={bgmind} alt="Government Emblem" className="w-24 h-28 object-contain opacity-90" />
                </div>
                <div className="hidden lg:block absolute right-4 top-2">
                    <img src={akamLogo} alt="Azadi Ka Amrit Mahotsav" className="w-28 h-32 object-contain opacity-90" />
                </div>

                <div className="w-full max-w-lg flex flex-col items-center p-4 lg:p-0 relative z-10 -mt-8 lg:mt-12">
                    <div className="text-center mb-6">
                        <img src={nsdLogo} alt="NSD Logo" className="w-20 h-20 object-contain mx-auto mb-2" />
                        <h1 className="text-2xl font-bold text-[#0d1b3e] mb-1 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                            National School of Drama
                        </h1>
                        <p className="text-[#d84315] font-semibold text-base" style={{ fontFamily: "'Cinzel', serif" }}>
                            Join the community
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-sans">
                            {error}
                        </div>
                    )}

                    {view === 'signup' && (
                        <form onSubmit={handleEmailSignup} className="space-y-4 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

                            <div>
                                <label className="block text-sm font-bold text-[#d84315] mb-1 font-sans">Email address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nsd-orange focus:border-transparent outline-none bg-white font-sans"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#d84315] mb-1 font-sans">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nsd-orange focus:border-transparent outline-none bg-white font-sans"
                                        placeholder="Password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#d84315] mb-1 font-sans">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nsd-orange focus:border-transparent outline-none bg-white font-sans"
                                        placeholder="Confirm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 text-nsd-orange border-gray-300 rounded focus:ring-nsd-orange"
                                />
                                <label htmlFor="terms" className="ml-2 text-sm text-gray-700 font-sans">
                                    I agree to the <a href="#" className="text-nsd-orange hover:underline">terms & policy</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#d84315] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#bf360c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-sans"
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-nsd-beige px-2 text-sm text-gray-500 font-sans">or</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors font-sans"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign up with Google
                            </button>

                            <p className="text-center text-sm text-gray-600 mt-6 font-sans">
                                Have an account?{' '}
                                <Link
                                    to="/"
                                    className="text-[#d84315] font-semibold hover:underline font-sans"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    )}

                    {view === 'verify' && (
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-nsd-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                                <p className="text-sm text-gray-600 mt-2">
                                    We sent a verification code to <span className="font-semibold text-gray-900">{email}</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full text-center text-3xl tracking-[0.5em] font-bold px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-nsd-orange focus:border-nsd-orange outline-none"
                                    placeholder="• • • • • •"
                                    maxLength={6}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setView('signup')}
                                    className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-sans"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#d84315] text-white rounded-lg font-bold hover:bg-[#bf360c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d84315] disabled:opacity-50 disabled:cursor-not-allowed font-sans relative"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : 'Verify Code'}
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={loading}
                                    className="text-[#d84315] hover:text-[#bf360c] text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50"
                                >
                                    Didn't receive code? Resend
                                </button>
                                {resendMessage && (
                                    <p className="mt-2 text-green-600 text-sm font-medium animate-fade-in">
                                        {resendMessage}
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
