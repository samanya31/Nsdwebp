import { useState, useEffect } from 'react';
import { useApplication } from '../context/ApplicationContext';
import { AcademicDetails, ClassDetails } from '../types';
import { GraduationCap, CheckCircle, TrendingUp } from 'lucide-react';

export default function AcademicDetailsPage() {
  const { applicationData, updateAcademicDetails, saveDraft } =
    useApplication();
  const [formData, setFormData] = useState<AcademicDetails>({
    classX: {
      board: '',
      yearOfPassing: '',
      rollNumber: '',
      totalMarks: '',
      marksObtained: '',
    },
    classXII: {
      board: '',
      yearOfPassing: '',
      rollNumber: '',
      stream: '',
      totalMarks: '',
      marksObtained: '',
    },
  });
  const [errors, setErrors] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (applicationData?.academic_details) {
      setFormData(applicationData.academic_details);
    }
  }, [applicationData]);

  const calculatePercentage = (obtained: string, total: string): number => {
    const obtainedNum = parseFloat(obtained);
    const totalNum = parseFloat(total);
    if (totalNum === 0) return 0;
    return Math.round((obtainedNum / totalNum) * 100 * 100) / 100;
  };

  const handleChange = (
    level: 'classX' | 'classXII',
    field: keyof ClassDetails,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [level]: {
          ...prev[level],
          [field]: value,
        },
      };

      // Auto-calculate percentage
      if (field === 'marksObtained' || field === 'totalMarks') {
        const levelData = updated[level];
        if (levelData.marksObtained && levelData.totalMarks) {
          levelData.percentage = calculatePercentage(
            levelData.marksObtained,
            levelData.totalMarks
          );
        } else {
          levelData.percentage = undefined;
        }
      }

      // Auto-save to context (persists in database)
      updateAcademicDetails(updated).catch(err => {
        console.error('Auto-save failed:', err);
      });

      return updated;
    });

    // Clear error for this field
    const errorKey = `${level}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: any = {};

    ['classX', 'classXII'].forEach((level) => {
      const data = formData[level as 'classX' | 'classXII'];
      if (!data.board) newErrors[`${level}.board`] = 'Board is required';
      if (!data.yearOfPassing) newErrors[`${level}.yearOfPassing`] = 'Year of passing is required';
      if (!data.rollNumber) newErrors[`${level}.rollNumber`] = 'Roll number is required';
      if (!data.totalMarks) newErrors[`${level}.totalMarks`] = 'Total marks is required';
      if (!data.marksObtained) newErrors[`${level}.marksObtained`] = 'Marks obtained is required';
      if (level === 'classXII' && !data.stream) newErrors[`${level}.stream`] = 'Stream is required';

      if (data.totalMarks && data.marksObtained) {
        const total = parseFloat(data.totalMarks);
        const obtained = parseFloat(data.marksObtained);
        if (obtained > total) {
          newErrors[`${level}.marksObtained`] = 'Marks obtained cannot exceed total marks';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProgress = async () => {
    if (!validate()) return;
    await updateAcademicDetails(formData);
    await saveDraft();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isSubmitted = applicationData?.status === 'submitted';

  const renderClassSection = (
    level: 'classX' | 'classXII',
    title: string,
    subtitle: string
  ) => {
    const data = formData[level];
    const levelErrors = errors;

    return (
      <div className="card-elegant p-8 mb-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Board */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Board <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.board}
              onChange={(e) => handleChange(level, 'board', e.target.value)}
              disabled={isSubmitted}
              className={`input-elegant ${levelErrors[`${level}.board`] ? '!border-red-300 !ring-red-100' : ''
                }`}
              placeholder="e.g., CBSE, State Board, ICSE"
            />
            {levelErrors[`${level}.board`] && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {levelErrors[`${level}.board`]}
              </p>
            )}
          </div>

          {/* Year of Passing */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year of Passing <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.yearOfPassing}
              onChange={(e) => handleChange(level, 'yearOfPassing', e.target.value)}
              disabled={isSubmitted}
              maxLength={4}
              className={`input-elegant ${levelErrors[`${level}.yearOfPassing`] ? '!border-red-300 !ring-red-100' : ''
                }`}
              placeholder="YYYY"
            />
            {levelErrors[`${level}.yearOfPassing`] && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {levelErrors[`${level}.yearOfPassing`]}
              </p>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.rollNumber}
              onChange={(e) => handleChange(level, 'rollNumber', e.target.value)}
              disabled={isSubmitted}
              className={`input-elegant ${levelErrors[`${level}.rollNumber`] ? '!border-red-300 !ring-red-100' : ''
                }`}
              placeholder="Enter roll number"
            />
            {levelErrors[`${level}.rollNumber`] && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {levelErrors[`${level}.rollNumber`]}
              </p>
            )}
          </div>

          {/* Stream (Class XII only) */}
          {level === 'classXII' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stream <span className="text-red-500">*</span>
              </label>
              <select
                value={data.stream || ''}
                onChange={(e) => handleChange(level, 'stream', e.target.value)}
                disabled={isSubmitted}
                className={`input-elegant ${levelErrors[`${level}.stream`] ? '!border-red-300 !ring-red-100' : ''
                  }`}
              >
                <option value="">Select Stream</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
              {levelErrors[`${level}.stream`] && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {levelErrors[`${level}.stream`]}
                </p>
              )}
            </div>
          )}

          {/* Total Marks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={data.totalMarks}
              onChange={(e) => handleChange(level, 'totalMarks', e.target.value)}
              disabled={isSubmitted}
              min="0"
              className={`input-elegant ${levelErrors[`${level}.totalMarks`] ? '!border-red-300 !ring-red-100' : ''
                }`}
              placeholder="Enter total marks"
            />
            {levelErrors[`${level}.totalMarks`] && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {levelErrors[`${level}.totalMarks`]}
              </p>
            )}
          </div>

          {/* Marks Obtained */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Marks Obtained <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={data.marksObtained}
              onChange={(e) => handleChange(level, 'marksObtained', e.target.value)}
              disabled={isSubmitted}
              min="0"
              className={`input-elegant ${levelErrors[`${level}.marksObtained`] ? '!border-red-300 !ring-red-100' : ''
                }`}
              placeholder="Enter marks obtained"
            />
            {levelErrors[`${level}.marksObtained`] && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {levelErrors[`${level}.marksObtained`]}
              </p>
            )}
          </div>

          {/* Percentage - Auto-calculated */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Percentage (Auto-calculated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.percentage !== undefined ? `${data.percentage}%` : ''}
                disabled
                className="input-elegant !bg-gradient-to-r from-indigo-50 to-purple-50 !border-indigo-200 !cursor-not-allowed"
                placeholder="Calculated automatically"
              />
              {data.percentage !== undefined && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <TrendingUp className="h-5 w-5 text-accent-emerald" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Academic Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step 2 of 4 • Share your educational qualifications</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="progress-step" style={{ width: '50%' }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className="text-accent-emerald font-semibold">✓ Personal</span>
          <span className="font-semibold text-gov-indigo">Academic</span>
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
              <p className="text-sm text-emerald-700">Your academic data has been securely saved.</p>
            </div>
          </div>
        </div>
      )}

      {/* Class Sections */}
      {renderClassSection('classX', 'Class X Details', 'Secondary education information')}
      {renderClassSection('classXII', 'Class XII Details', 'Higher secondary education information')}

      {/* Action Buttons */}
      <div className="card-elegant p-6 animate-slide-up">
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
    </div>
  );
}
