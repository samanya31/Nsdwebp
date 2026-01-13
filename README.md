# Academic Admission Portal

A clean, professional government academic admission portal built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Secure Authentication**:
  - Google OAuth signup for new accounts
  - Username and password login for existing accounts
  - Automatic password setup flow after Google signup
- **Multi-step Application Form**:
  1. Personal Details
  2. Academic Details (Class X & XII)
  3. Review Details
  4. Upload Documents
- **Draft Saving** - Save progress at any time
- **Document Upload** - Drag & drop file uploads
- **Auto-calculation** - Percentage automatically calculated
- **Responsive Design** - Works on desktop and mobile
- **Government-style UI** - Professional, trustworthy design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Supabase Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "userId" UUID NOT NULL,
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
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

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
```

### 4. Enable Authentication Providers in Supabase

1. Go to **Authentication > Providers** in Supabase Dashboard
2. **Enable Google Provider:**
   - Click on "Google" provider
   - Enable it
   - Add your Google OAuth credentials (Client ID and Client Secret)
   - Set the redirect URL to: `https://your-project-id.supabase.co/auth/v1/callback`
3. **Enable Email Provider:**
   - Click on "Email" provider
   - Enable it (for password-based login)

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── context/            # React contexts
│   ├── AuthContext.tsx
│   └── ApplicationContext.tsx
├── lib/                # Utilities
│   └── supabase.ts
├── pages/              # Page components
│   ├── Login.tsx
│   ├── PersonalDetails.tsx
│   ├── AcademicDetails.tsx
│   ├── ReviewDetails.tsx
│   └── UploadDocuments.tsx
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Design Principles

- **Clean & Minimal**: Plenty of white space, no clutter
- **Government Style**: Professional, trustworthy, formal
- **Accessibility**: High contrast, readable fonts, keyboard navigation
- **Responsive**: Works seamlessly on all screen sizes
- **Calm Colors**: Deep blue/navy primary colors with light grey accents

## Features in Detail

### Authentication
- Email-based OTP login
- Secure session management
- Auto-redirect to dashboard after login

### Personal Details
- Full name, father's name, mother's name
- Date of birth
- Address (multi-line)
- Category selection (read-only after initial selection)

### Academic Details
- Class X and Class XII details
- Board, year of passing, roll number
- Stream selection for Class XII
- Automatic percentage calculation
- Validation for marks (cannot exceed total)

### Review Details
- Read-only view of all entered data
- Edit buttons for each section
- Clear section-wise grouping

### Document Upload
- Drag & drop file upload
- Support for PDF, JPG, PNG
- File size validation (max 5MB)
- Upload status indicators

## Future Enhancements (Stage 2+)

- Application fee payment integration
- Document verification status
- Application status tracking
- Email notifications
- Print application form
- Admin dashboard

## License

This project is for educational purposes.
