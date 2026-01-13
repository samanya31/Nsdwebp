export interface PersonalDetails {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  address: string;
  category: string;
  gender?: string;
}

export interface ClassDetails {
  board: string;
  yearOfPassing: string;
  rollNumber: string;
  stream?: string;
  totalMarks: string;
  marksObtained: string;
  percentage?: number;
}

export interface AcademicDetails {
  classX: ClassDetails;
  classXII: ClassDetails;
}

export interface ApplicationData {
  id?: string;
  application_id?: string;
  user_id?: string;
  personal_details?: PersonalDetails;
  academic_details?: AcademicDetails;
  documents?: {
    classXMarksheet?: string | null;
    classXIIMarksheet?: string | null;
  };
  status: 'draft' | 'submitted';
  created_at?: string;
  updated_at?: string;
}
