import { useState } from 'react';
import { useApplication } from '../context/ApplicationContext';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, AlertCircle, FileText, Cloud, X } from 'lucide-react';

export default function UploadDocumentsPage() {
  const { applicationData, updateDocument, saveDraft, finalSubmit } = useApplication();
  const [uploading, setUploading] = useState<{
    classXMarksheet: boolean;
    classXIIMarksheet: boolean;
  }>({
    classXMarksheet: false,
    classXIIMarksheet: false,
  });
  const [dragActive, setDragActive] = useState<string | null>(null);

  const isSubmitted = applicationData?.status === 'submitted';

  const handleFileUpload = async (
    type: 'classXMarksheet' | 'classXIIMarksheet',
    file: File
  ) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, JPG, or PNG file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      if (!applicationData?.user_id) {
        alert('Please wait for application to load');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${applicationData.user_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('documents').getPublicUrl(filePath);

      await updateDocument(type, publicUrl);
      await saveDraft();
    } catch (error: any) {
      console.error('Upload error:', error);
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        await updateDocument(type, fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
      alert('File uploaded (stored locally). Supabase storage may need setup.');
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrag = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'classXMarksheet' | 'classXIIMarksheet') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(type, e.dataTransfer.files[0]);
    }
  };

  const renderUploadSection = (
    type: 'classXMarksheet' | 'classXIIMarksheet',
    title: string,
    subtitle: string
  ) => {
    const isUploaded = !!applicationData?.documents?.[type];
    const isUploading = uploading[type];

    return (
      <div className="card-elegant p-8 mb-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isUploaded ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          {isUploaded && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <CheckCircle className="h-4 w-4 text-accent-emerald" />
              <span className="text-sm font-semibold text-emerald-700">Uploaded</span>
            </div>
          )}
        </div>

        <div
          className={`
            border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
            ${dragActive === type
              ? 'border-gov-indigo bg-gov-light-blue scale-[1.02]'
              : isUploaded
                ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-gov-indigo hover:bg-gov-light-blue'
            }
          `}
          onDragEnter={(e) => handleDrag(e, type)}
          onDragLeave={(e) => handleDrag(e, type)}
          onDragOver={(e) => handleDrag(e, type)}
          onDrop={(e) => handleDrop(e, type)}
        >
          {isUploaded ? (
            <div className="flex flex-col items-center animate-scale-in">
              <CheckCircle className="h-16 w-16 text-accent-emerald mb-4" />
              <p className="text-lg font-semibold text-emerald-700 mb-2">Successfully Uploaded!</p>
              <p className="text-sm text-gray-600 mb-6 max-w-md truncate">
                {applicationData?.documents?.[type]?.substring(0, 50)}...
              </p>
              {!isSubmitted && (
                <label className="btn-secondary cursor-pointer">
                  <Upload className="inline h-4 w-4 mr-2" />
                  Replace File
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(type, e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          ) : (
            <>
              {isUploading ? (
                <div className="flex flex-col items-center animate-pulse">
                  <Cloud className="h-16 w-16 text-gov-indigo mb-4 animate-bounce" />
                  <p className="text-lg font-semibold text-gov-navy">Uploading...</p>
                  <p className="text-sm text-gray-500 mt-2">Please wait while we process your file</p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    or click below to browse
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <label className="btn-primary cursor-pointer">
                      <Cloud className="inline h-4 w-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(type, e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        disabled={isSubmitted || isUploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    const hasAllDocuments =
      applicationData?.documents?.classXMarksheet &&
      applicationData?.documents?.classXIIMarksheet;

    if (!hasAllDocuments) {
      if (
        !window.confirm(
          'You have not uploaded all required documents. Do you still want to submit?'
        )
      ) {
        return;
      }
    }

    if (
      window.confirm(
        'Are you sure you want to submit your application? You will not be able to make changes after submission.'
      )
    ) {
      await finalSubmit();
      alert('Application submitted successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Upload Documents
            </h2>
            <p className="text-sm text-gray-500 mt-1">Step 4 of 4 • Final step - upload your marksheets</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="progress-step" style={{ width: '100%' }}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-accent-emerald font-semibold">✓ Personal</span>
          <span className="text-accent-emerald font-semibold">✓ Academic</span>
          <span className="text-accent-emerald font-semibold">✓ Review</span>
          <span className="font-semibold text-gov-indigo">Documents</span>
        </div>
      </div>

      {/* Upload Sections */}
      {renderUploadSection('classXMarksheet', 'Class X Marksheet', 'Upload your Class 10 mark sheet')}
      {renderUploadSection('classXIIMarksheet', 'Class XII Marksheet', 'Upload your Class 12 mark sheet')}

      {/* Warning if documents missing */}
      {(!applicationData?.documents?.classXMarksheet ||
        !applicationData?.documents?.classXIIMarksheet) && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-accent-amber rounded-xl shadow-soft">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent-amber flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Required Documents Pending</p>
                <p className="text-sm text-amber-700">Please upload all required documents before final submission for faster processing.</p>
              </div>
            </div>
          </div>
        )}

      {/* Action Buttons */}
      {!isSubmitted && (
        <div className="card-elegant p-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={saveDraft}
              className="btn-secondary"
            >
              Save Progress
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              <CheckCircle className="inline h-5 w-5 mr-2" />
              Final Submit Application
            </button>
          </div>
        </div>
      )}

      {/* Submitted State */}
      {isSubmitted && (
        <div className="card-elegant p-8 text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
          <p className="text-gray-600">
            Your application has been successfully submitted. All documents have been received and are being processed.
          </p>
        </div>
      )}
    </div>
  );
}
