import { useState, useEffect } from 'react';
import { useApplication } from '../context/ApplicationContext';
import { PersonalDetails } from '../types';
import { CheckCircle, Sparkles } from 'lucide-react';
import maleForm from '../assets/maleform.png';
import femaleForm from '../assets/femaleform.png';

export default function PersonalDetailsPage() {
  const { applicationData, updatePersonalDetails, saveDraft, loading } =
    useApplication();
  const [formData, setFormData] = useState<PersonalDetails>({
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    address: '',
    category: 'General',
    gender: 'Male',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetails, string>>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (applicationData?.personal_details) {
      const hasExistingData = Object.values(applicationData.personal_details).some(val => val && val !== '');
      if (!formData.fullName && hasExistingData) {
        setFormData(applicationData.personal_details);
      }
    }
  }, [applicationData?.personal_details]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalDetails, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof PersonalDetails,
    value: string
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    // Auto-save to context (persists in database)
    updatePersonalDetails(updatedData).catch(err => {
      console.error('Auto-save failed:', err);
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSaveProgress = async () => {
    if (!validate()) return;
    await updatePersonalDetails(formData);
    await saveDraft();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isSubmitted = applicationData?.status === 'submitted';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card-elegant p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gov-indigo border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Personal Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step 1 of 4 • Let's start with your basic information</p>
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="relative mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="progress-step" style={{ width: '25%' }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className="font-semibold text-gov-indigo">Personal</span>
          <span>Academic</span>
          <span>Review</span>
          <span>Documents</span>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-accent-emerald rounded-xl animate-slide-down shadow-soft">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-accent-emerald flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Progress saved successfully!</p>
              <p className="text-sm text-emerald-700">Your data has been securely saved and will be preserved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Form */}
        <div className="lg:col-span-2">
          {/* Main Form Card */}
          <div className="card-elegant p-8 sm:p-10 animate-slide-up">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProgress();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    disabled={isSubmitted}
                    className={`input-elegant ${errors.fullName ? '!border-red-300 !ring-red-100' : ''
                      }`}
                    placeholder="Enter your complete name"
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Father's Name */}
                <div>
                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fatherName"
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                    disabled={isSubmitted}
                    className={`input-elegant ${errors.fatherName ? '!border-red-300 !ring-red-100' : ''
                      }`}
                    placeholder="Father's full name"
                  />
                  {errors.fatherName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.fatherName}
                    </p>
                  )}
                </div>

                {/* Mother's Name */}
                <div>
                  <label
                    htmlFor="motherName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="motherName"
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => handleChange('motherName', e.target.value)}
                    disabled={isSubmitted}
                    className={`input-elegant ${errors.motherName ? '!border-red-300 !ring-red-100' : ''
                      }`}
                    placeholder="Mother's full name"
                  />
                  {errors.motherName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.motherName}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    disabled={isSubmitted}
                    max={new Date().toISOString().split('T')[0]}
                    className={`input-elegant ${errors.dateOfBirth ? '!border-red-300 !ring-red-100' : ''
                      }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    value={formData.gender || 'Male'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    disabled={isSubmitted}
                    className="input-elegant"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    disabled={isSubmitted || !!applicationData?.personal_details?.category}
                    className="input-elegant"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                  {applicationData?.personal_details?.category && (
                    <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-amber-600 rounded-full"></span>
                      Category cannot be changed after initial selection
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    disabled={isSubmitted}
                    rows={4}
                    className={`input-elegant resize-none ${errors.address ? '!border-red-300 !ring-red-100' : ''
                      }`}
                    placeholder="Enter your complete residential address"
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Auto-save info & Save Button */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></div>
                    <p>Changes save automatically as you type</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProgress}
                    disabled={isSubmitted}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <CheckCircle className="inline h-5 w-5 mr-2" />
                    Save Progress
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Pro Tip:</span> You can safely navigate between pages - your progress is automatically saved!
            </p>
          </div>
        </div>

        {/* Right Side - Illustration Preview */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24">
            <div className="card-elegant p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preview</h3>
              <div className="relative w-full aspect-square bg-gradient-to-br from-[#fff8f0] to-white rounded-xl overflow-hidden border-2 border-gray-100">
                <img
                  src={formData.gender === 'Female' ? femaleForm : maleForm}
                  alt={`${formData.gender || 'Male'} illustration`}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {formData.gender || 'Male'} applicant representation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
