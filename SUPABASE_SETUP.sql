-- Supabase Database Setup for Academic Admission Portal
-- Run this SQL script in your Supabase SQL Editor

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID NOT NULL UNIQUE,
  "applicationId" TEXT UNIQUE,
  "personalDetails" JSONB,
  "academicDetails" JSONB,
  documents JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies (allow authenticated users to upload)
CREATE POLICY IF NOT EXISTS "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY IF NOT EXISTS "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON applications;

-- Create policies for applications
CREATE POLICY "Users can view their own applications"
ON applications FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "Users can insert their own applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Users can update their own applications"
ON applications FOR UPDATE
TO authenticated
USING (auth.uid() = "userId");

-- Create index on userId for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_userId ON applications("userId");

-- Create index on applicationId for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_applicationId ON applications("applicationId");
