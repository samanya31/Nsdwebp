import { useState } from 'react';
import maleForm from '../assets/maleform.png';
import femaleForm from '../assets/femaleform.png';

interface GenderSelectionModalProps {
    isOpen: boolean;
    onSelect: (data: { gender: string; fullName?: string }) => Promise<void>;
    userName?: string;
    askForName?: boolean;
    initialName?: string;
}

export default function GenderSelectionModal({ isOpen, onSelect, userName, askForName = false, initialName }: GenderSelectionModalProps) {
    const [loading, setLoading] = useState(false);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    // Use initialName if provided, otherwise try to be smart about userName (though Dashboard now handles smarts mostly)
    const [fullName, setFullName] = useState(initialName ?? ((userName === 'Student' || userName?.includes('@')) ? '' : userName || ''));
    const [nameError, setNameError] = useState('');

    if (!isOpen) return null;

    const handleSelect = async (gender: string) => {
        if (askForName) {
            if (!fullName.trim() || fullName.length < 3) {
                setNameError('Please enter your full name first');
                return;
            }
            setNameError('');
        }

        try {
            setLoading(true);
            setSelectedGender(gender);
            await onSelect({
                gender,
                fullName: askForName ? fullName : undefined
            });
        } catch (error) {
            console.error('Error saving profile:', error);
            setSelectedGender(null); // Reset on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden scale-100 animate-scale-up">

                {/* Header */}
                <div className="text-center p-8 bg-gradient-to-r from-[#FFF8F0] to-white border-b border-orange-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
                        Welcome{askForName ? '' : `, ${userName}`}!
                    </h2>
                    <p className="text-gray-600 text-lg">
                        {askForName
                            ? "Let's set up your profile to get started"
                            : "Please select your avatar to personalize your dashboard"
                        }
                    </p>
                </div>

                {/* Selection Area */}
                <div className="p-8">

                    <p className="text-center text-gray-500 mb-6 font-medium">Select your Avatar</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                        {/* Male Option */}
                        <button
                            onClick={() => {
                                setSelectedGender('Male');
                                if (!askForName) handleSelect('Male'); // Auto-submit if no name needed
                            }}
                            disabled={loading}
                            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl
                ${selectedGender === 'Male'
                                    ? 'border-[#d84315] bg-orange-50 ring-2 ring-[#d84315] ring-offset-2'
                                    : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                                }
              `}
                        >
                            <div className="aspect-square relative mb-4 bg-white rounded-full p-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <img src={maleForm} alt="Male" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#d84315] transition-colors">Male</h3>
                        </button>

                        {/* Female Option */}
                        <button
                            onClick={() => {
                                setSelectedGender('Female');
                                if (!askForName) handleSelect('Female'); // Auto-submit if no name needed
                            }}
                            disabled={loading}
                            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl
                ${selectedGender === 'Female'
                                    ? 'border-[#d84315] bg-orange-50 ring-2 ring-[#d84315] ring-offset-2'
                                    : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                                }
              `}
                        >
                            <div className="aspect-square relative mb-4 bg-white rounded-full p-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                <img src={femaleForm} alt="Female" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#d84315] transition-colors">Female</h3>
                        </button>

                    </div>

                    {askForName && (
                        <div className="mb-8 max-w-md mx-auto animate-fade-in">
                            <label className="block text-sm font-bold text-[#d84315] mb-2 text-center">
                                {selectedGender ? `Great choice! Now, what should we call you?` : 'Enter your Full Name to continue'}
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 border rounded-xl text-center text-lg focus:ring-2 focus:ring-[#d84315] outline-none transition-all ${nameError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="e.g. Rahul Sharma"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    if (nameError) setNameError('');
                                }}
                            />
                            {nameError && <p className="text-red-500 text-sm mt-2 text-center">{nameError}</p>}

                            <button
                                type="button"
                                onClick={() => {
                                    if (!selectedGender) {
                                        setNameError('Please select an Avatar above first');
                                        return;
                                    }
                                    handleSelect(selectedGender);
                                }}
                                disabled={loading}
                                className="w-full mt-4 bg-[#d84315] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#bf360c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Setting up...' : 'Get Started'}
                            </button>
                        </div>
                    )}

                    {!askForName && (
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                onClick={() => handleSelect('Other')}
                                className="text-gray-500 hover:text-[#d84315] text-sm font-medium transition-colors"
                            >
                                Prefer not to say (Default to Male avatar)
                            </button>
                        </div>
                    )}
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-[#d84315] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[#d84315] font-semibold animate-pulse">Setting up your profile...</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
