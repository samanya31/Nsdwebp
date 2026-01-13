import { useApplication } from '../context/ApplicationContext';
import { useNavigate } from 'react-router-dom';
import { Edit, User, GraduationCap, CheckCircle, Calendar, MapPin, BookOpen, FileText, ExternalLink, Upload } from 'lucide-react';

export default function ReviewDetailsPage() {
  const { applicationData, finalSubmit } = useApplication();
  const navigate = useNavigate();

  const isSubmitted = applicationData?.status === 'submitted';

  const handleEdit = (section: string) => {
    if (section === 'personal') {
      navigate('/dashboard/personal-details');
    } else if (section === 'academic') {
      navigate('/dashboard/academic-details');
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your application? You will not be able to make changes after submission.')) {
      await finalSubmit();
      alert('Application submitted successfully!');
    }
  };

  const renderDetailRow = (icon: React.ReactNode, label: string, value: any) => {
    if (!value || value === '') return null;

    return (
      <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
        <div className="mt-1 text-gov-indigo">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-base text-gray-900 font-medium break-words">{String(value)}</p>
        </div>
      </div>
    );
  };

  const renderSection = (
    title: string,
    section: 'personal' | 'academic',
    data: any,
    icon: React.ReactNode
  ) => {
    if (!data) {
      return (
        <div className="card-elegant p-8 mb-6 animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
            {!isSubmitted && (
              <button
                onClick={() => handleEdit(section)}
                className="flex items-center gap-2 px-4 py-2 text-gov-indigo hover:bg-gov-light-blue rounded-lg transition-colors font-medium"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm">No data available. Please fill this section.</p>
        </div>
      );
    }

    return (
      <div className="card-elegant p-8 mb-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          {!isSubmitted && (
            <button
              onClick={() => handleEdit(section)}
              className="flex items-center gap-2 px-4 py-2 text-gov-indigo hover:bg-gov-light-blue rounded-lg transition-all duration-300 font-medium hover:shadow-soft"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
        <div className="space-y-1">
          {Object.entries(data).map(([key, value]) => {
            if (key === 'percentage' || value === null || value === undefined || value === '') return null;

            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())
              .trim();

            const iconMap: any = {
              'Full Name': <User className="h-4 w-4" />,
              'Date Of Birth': <Calendar className="h-4 w-4" />,
              'Address': <MapPin className="h-4 w-4" />,
              'Category': <BookOpen className="h-4 w-4" />,
            };

            return renderDetailRow(
              iconMap[label] || <CheckCircle className="h-4 w-4" />,
              label,
              value
            );
          })}
        </div>
      </div>
    );
  };

  const renderAcademicSection = (title: string, data: any, subtitle: string) => {
    if (!data) {
      return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 border border-indigo-100">
          <h4 className="font-semibold text-indigo-900 mb-2">{title}</h4>
          <p className="text-indigo-600 text-sm">{subtitle}</p>
          <p className="text-gray-500 text-sm mt-2">No data available</p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-4 border border-indigo-100">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          <div>
            <h4 className="font-semibold text-indigo-900">{title}</h4>
            <p className="text-indigo-600 text-xs">{subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(data).map(([key, value]) => {
            if (value === null || value === undefined || value === '') return null;

            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())
              .trim();

            const displayValue = key === 'percentage' ? `${value}%` : String(value);

            return (
              <div key={key} className="flex flex-col">
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">{label}</span>
                <span className="text-sm font-semibold text-indigo-900 mt-1">{displayValue}</span>
              </div>
            );
          })}
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
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Review Your Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step 3 of 4 • Review and verify your information</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="progress-step" style={{ width: '75%' }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-accent-emerald font-semibold">✓ Personal</span>
          <span className="text-accent-emerald font-semibold">✓ Academic</span>
          <span className="font-semibold text-gov-indigo">Review</span>
          <span className="text-gray-500">Documents</span>
        </div>
      </div>

      {/* Submitted Alert */}
      {isSubmitted && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-gov-indigo rounded-xl shadow-soft animate-slide-down">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-gov-indigo flex-shrink-0" />
            <div>
              <p className="font-semibold text-indigo-900">Application Submitted</p>
              <p className="text-sm text-indigo-700">Your application has been submitted and cannot be edited.</p>
            </div>
          </div>
        </div>
      )}

      {/* Personal Details Section */}
      {renderSection(
        'Personal Details',
        'personal',
        applicationData?.personal_details,
        <User className="h-5 w-5 text-white" />
      )}

      {/* Academic Details Section */}
      <div className="card-elegant p-8 mb-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Academic Details</h3>
          </div>
          {!isSubmitted && applicationData?.academic_details && (
            <button
              onClick={() => handleEdit('academic')}
              className="flex items-center gap-2 px-4 py-2 text-gov-indigo hover:bg-gov-light-blue rounded-lg transition-all duration-300 font-medium hover:shadow-soft"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
        {applicationData?.academic_details ? (
          <div>
            {renderAcademicSection('Class X Details', applicationData.academic_details.classX, 'Secondary education')}
            {renderAcademicSection('Class XII Details', applicationData.academic_details.classXII, 'Higher secondary education')}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No data available. Please fill this section.</p>
        )}
      </div>

      {/* Documents Review Section */}
      <div className="card-elegant p-8 mb-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Uploaded Documents</h3>
          </div>
          {!isSubmitted && (
            <button
              onClick={() => navigate('/dashboard/upload-documents')}
              className="flex items-center gap-2 px-4 py-2 text-gov-indigo hover:bg-gov-light-blue rounded-lg transition-all duration-300 font-medium hover:shadow-soft"
            >
              <Edit className="h-4 w-4" />
              <span>Manage</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class X Marksheet */}
          <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${applicationData?.documents?.classXMarksheet
              ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50'
              : 'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${applicationData?.documents?.classXMarksheet
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                  : 'bg-gray-300'
                }`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1">Class X Marksheet</h4>
                {applicationData?.documents?.classXMarksheet ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">Document uploaded successfully</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={applicationData.documents.classXMarksheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </a>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Uploaded
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-amber-600 font-medium">⚠️ Not uploaded yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Class XII Marksheet */}
          <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${applicationData?.documents?.classXIIMarksheet
              ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50'
              : 'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${applicationData?.documents?.classXIIMarksheet
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                  : 'bg-gray-300'
                }`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1">Class XII Marksheet</h4>
                {applicationData?.documents?.classXIIMarksheet ? (
                  <>
                    <p className="text-sm text-gray-600 mb-3">Document uploaded successfully</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={applicationData.documents.classXIIMarksheet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </a>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Uploaded
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-amber-600 font-medium">⚠️ Not uploaded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Warning if documents missing */}
        {(!applicationData?.documents?.classXMarksheet || !applicationData?.documents?.classXIIMarksheet) && !isSubmitted && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">⚠️ Missing Documents:</span> Please upload all required documents before final submission.
            </p>
          </div>
        )}
      </div>

      {/* Submit Section */}
      {!isSubmitted && (
        <div className="card-elegant p-8 text-center animate-slide-up">
          <div className="max-w-md mx-auto">
            <CheckCircle className="h-12 w-12 text-gov-indigo mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Submit?</h3>
            <p className="text-gray-600 mb-6">
              Please review all information carefully. Once submitted, you won't be able to make changes.
            </p>
            <button
              onClick={handleSubmit}
              className="btn-primary w-full"
            >
              <CheckCircle className="inline h-5 w-5 mr-2" />
              Final Submit Application
            </button>
          </div>
        </div>
      )}

      {/* Submitted Confirmation */}
      {isSubmitted && applicationData?.application_id && (
        <div className="card-elegant p-8 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Successfully Submitted!</h3>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mt-4 inline-block">
            <p className="text-sm text-indigo-600 font-medium">Application ID</p>
            <p className="text-2xl font-bold text-indigo-900">{applicationData.application_id}</p>
          </div>
          {applicationData.created_at && (
            <p className="text-sm text-gray-500 mt-4">
              Submitted on: {new Date(applicationData.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
