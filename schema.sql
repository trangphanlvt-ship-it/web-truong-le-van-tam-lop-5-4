-- ==========================================================================
-- SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) MIGRATION SCRIPT
-- Project: Truong Le Van Tam - Lop 5/4 Management & E-Learning System
-- Run this script in your Supabase SQL Editor (https://app.supabase.com -> SQL Editor)
-- ==========================================================================

-- Enable PGCrypto / UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------------
-- 1. DROP EXISTING TABLES IF NEEDED (Clean Initialization)
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS public.student_progress CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.materials CASCADE;
DROP TABLE IF EXISTS public.class_members CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- --------------------------------------------------------------------------
-- 2. CREATE SCHEMAS & TABLES
-- --------------------------------------------------------------------------

-- 2.1 Profiles Table (Linked to auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.2 Classes Table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    code TEXT UNIQUE NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.3 Class Members Table
CREATE TABLE public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_class_member UNIQUE (class_id, student_id)
);

-- 2.4 Materials Table
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    file_url TEXT DEFAULT '',
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'game_iframe', 'game_html5')),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.5 Assignments Table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.6 Student Progress Table
CREATE TABLE public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'completed')),
    score NUMERIC DEFAULT 0,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_student_assignment UNIQUE (assignment_id, student_id)
);

-- --------------------------------------------------------------------------
-- 3. PERFORMANCE INDEXES
-- --------------------------------------------------------------------------
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX idx_classes_code ON public.classes(code);
CREATE INDEX idx_class_members_class ON public.class_members(class_id);
CREATE INDEX idx_class_members_student ON public.class_members(student_id);
CREATE INDEX idx_materials_author ON public.materials(author_id);
CREATE INDEX idx_materials_type ON public.materials(type);
CREATE INDEX idx_materials_is_public ON public.materials(is_public);
CREATE INDEX idx_assignments_class ON public.assignments(class_id);
CREATE INDEX idx_assignments_material ON public.assignments(material_id);
CREATE INDEX idx_student_progress_assignment ON public.student_progress(assignment_id);
CREATE INDEX idx_student_progress_student ON public.student_progress(student_id);
CREATE INDEX idx_student_progress_status ON public.student_progress(status);

-- --------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) SETUP & HELPER FUNCTIONS
-- --------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Helper functions to avoid infinite recursion in RLS
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT (public.get_auth_role() = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
  SELECT (public.get_auth_role() IN ('admin', 'teacher'));
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- --------------------------------------------------------------------------
-- 5. RLS POLICIES FOR ALL TABLES
-- --------------------------------------------------------------------------

-- 5.1 PROFILES POLICIES
CREATE POLICY "Allow logged-in users to view profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update own profile or admin update all"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow insert own profile or admin insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow admin to delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- 5.2 CLASSES POLICIES
CREATE POLICY "Allow users to view enrolled/taught classes or public/admin"
  ON public.classes FOR SELECT
  USING (
    public.is_admin()
    OR teacher_id = auth.uid()
    OR id IN (SELECT class_id FROM public.class_members WHERE student_id = auth.uid())
  );

CREATE POLICY "Allow teachers and admins to create classes"
  ON public.classes FOR INSERT
  WITH CHECK (public.is_teacher());

CREATE POLICY "Allow class teacher or admin to update class"
  ON public.classes FOR UPDATE
  USING (public.is_admin() OR teacher_id = auth.uid())
  WITH CHECK (public.is_admin() OR teacher_id = auth.uid());

CREATE POLICY "Allow class teacher or admin to delete class"
  ON public.classes FOR DELETE
  USING (public.is_admin() OR teacher_id = auth.uid());

-- 5.3 CLASS MEMBERS POLICIES
CREATE POLICY "Allow members, teachers, and admins to view membership"
  ON public.class_members FOR SELECT
  USING (
    public.is_admin()
    OR student_id = auth.uid()
    OR class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Allow student to join class or teacher/admin to add student"
  ON public.class_members FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR public.is_teacher()
    OR student_id = auth.uid()
  );

CREATE POLICY "Allow student to leave class or teacher/admin to remove"
  ON public.class_members FOR DELETE
  USING (
    public.is_admin()
    OR student_id = auth.uid()
    OR class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

-- 5.4 MATERIALS POLICIES
CREATE POLICY "Allow reading public materials, author materials, assigned materials, or admin"
  ON public.materials FOR SELECT
  USING (
    is_public = true
    OR author_id = auth.uid()
    OR public.is_admin()
    OR id IN (
      SELECT material_id FROM public.assignments
      WHERE class_id IN (SELECT class_id FROM public.class_members WHERE student_id = auth.uid())
    )
  );

CREATE POLICY "Allow teachers and admins to create materials"
  ON public.materials FOR INSERT
  WITH CHECK (public.is_teacher());

CREATE POLICY "Allow author or admin to update materials"
  ON public.materials FOR UPDATE
  USING (public.is_admin() OR author_id = auth.uid())
  WITH CHECK (public.is_admin() OR author_id = auth.uid());

CREATE POLICY "Allow author or admin to delete materials"
  ON public.materials FOR DELETE
  USING (public.is_admin() OR author_id = auth.uid());

-- 5.5 ASSIGNMENTS POLICIES
CREATE POLICY "Allow viewing assignments for enrolled students, class teacher, or admin"
  ON public.assignments FOR SELECT
  USING (
    public.is_admin()
    OR class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
    OR class_id IN (SELECT class_id FROM public.class_members WHERE student_id = auth.uid())
  );

CREATE POLICY "Allow class teacher or admin to create assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Allow class teacher or admin to update assignments"
  ON public.assignments FOR UPDATE
  USING (
    public.is_admin()
    OR class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Allow class teacher or admin to delete assignments"
  ON public.assignments FOR DELETE
  USING (
    public.is_admin()
    OR class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

-- 5.6 STUDENT PROGRESS POLICIES
CREATE POLICY "Allow student owner, class teacher, or admin to view progress"
  ON public.student_progress FOR SELECT
  USING (
    public.is_admin()
    OR student_id = auth.uid()
    OR assignment_id IN (
      SELECT a.id FROM public.assignments a
      JOIN public.classes c ON a.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Allow student owner or teacher/admin to insert progress"
  ON public.student_progress FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    OR public.is_teacher()
  );

CREATE POLICY "Allow student owner or teacher/admin to update progress"
  ON public.student_progress FOR UPDATE
  USING (
    student_id = auth.uid()
    OR public.is_teacher()
  )
  WITH CHECK (
    student_id = auth.uid()
    OR public.is_teacher()
  );

CREATE POLICY "Allow teacher or admin to delete progress"
  ON public.student_progress FOR DELETE
  USING (public.is_teacher());

-- --------------------------------------------------------------------------
-- 6. AUTOMATED TRIGGER: SYNC SUPABASE AUTH USERS TO PUBLIC.PROFILES
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = COALESCE(EXCLUDED.role, profiles.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create Trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
