import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { ApplicationData, PersonalDetails, AcademicDetails } from '../types';

interface ApplicationContextType {
  applicationData: ApplicationData | null;
  loading: boolean;
  updatePersonalDetails: (data: PersonalDetails) => Promise<void>;
  updateAcademicDetails: (data: AcademicDetails) => Promise<void>;
  updateDocument: (
    type: 'classXMarksheet' | 'classXIIMarksheet',
    url: string
  ) => Promise<void>;
  saveDraft: () => Promise<void>;
  finalSubmit: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined
);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD APPLICATION ---------------- */

  const loadApplicationData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        // No row yet → normal for first-time users
        if (error.code === 'PGRST116') {
          setLoading(false);
          return;
        }

        console.error('Error loading application:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setApplicationData(data);
      }
    } catch (err) {
      console.error('Unexpected load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicationData();
  }, [user]);

  /* ---------------- SAVE / UPSERT ---------------- */

  const saveToSupabase = async (data: ApplicationData) => {
    if (!user) return;

    const payload: ApplicationData = {
      user_id: user.id,
      application_id: data.application_id,
      personal_details: data.personal_details,
      academic_details: data.academic_details,
      documents: data.documents,
      status: data.status,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('applications')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error('❌ Supabase save failed:', error);
      throw error;
    }
  };

  /* ---------------- UPDATE SECTIONS ---------------- */

  const updatePersonalDetails = async (details: PersonalDetails) => {
    const updated: ApplicationData = {
      ...(applicationData ?? {
        user_id: user!.id,
        application_id: `APP${Date.now()}`,
        status: 'draft',
      }),
      personal_details: details,
      updated_at: new Date().toISOString(),
    };

    await saveToSupabase(updated);
    setApplicationData(updated);
  };

  const updateAcademicDetails = async (details: AcademicDetails) => {
    if (!applicationData) return;

    const updated: ApplicationData = {
      ...applicationData,
      academic_details: details,
      updated_at: new Date().toISOString(),
    };

    await saveToSupabase(updated);
    setApplicationData(updated);
  };

  const updateDocument = async (
    type: 'classXMarksheet' | 'classXIIMarksheet',
    url: string
  ) => {
    if (!applicationData) return;

    const updated: ApplicationData = {
      ...applicationData,
      documents: {
        ...(applicationData.documents ?? {}),
        [type]: url,
      },
      updated_at: new Date().toISOString(),
    };

    await saveToSupabase(updated);
    setApplicationData(updated);
  };

  /* ---------------- ACTIONS ---------------- */

  const saveDraft = async () => {
    if (!applicationData) return;
    await saveToSupabase(applicationData);
  };

  const finalSubmit = async () => {
    if (!applicationData) return;

    const submitted: ApplicationData = {
      ...applicationData,
      status: 'submitted',
      updated_at: new Date().toISOString(),
    };

    await saveToSupabase(submitted);
    setApplicationData(submitted);
  };

  return (
    <ApplicationContext.Provider
      value={{
        applicationData,
        loading,
        updatePersonalDetails,
        updateAcademicDetails,
        updateDocument,
        saveDraft,
        finalSubmit,
        refreshData: loadApplicationData,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      'useApplication must be used within an ApplicationProvider'
    );
  }
  return context;
}
