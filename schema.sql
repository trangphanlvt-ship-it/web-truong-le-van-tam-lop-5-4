-- ==========================================================================
-- SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) MIGRATION SCRIPT
-- Trường: TRƯỜNG TIỂU HỌC LÊ VĂN TÁM - LỚP 5/4 (NĂM HỌC 2025-2026)
-- GVCN: PHAN THỊ DIỄM TRANG - Địa chỉ: S15 đường Tân Phú, P. Tân Mỹ, TP.HCM
-- Hướng dẫn: Sao chép toàn bộ nội dung script này và chạy 1-click tại:
-- Supabase Dashboard -> SQL Editor -> Run.
-- ==========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------------
-- 1. CLEANUP PREVIOUS TABLES (If re-initializing)
-- --------------------------------------------------------------------------
DROP TABLE IF EXISTS public.class_activities CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
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
    dob TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    avatar_url TEXT DEFAULT '',
    points INT DEFAULT 0,
    stars INT DEFAULT 0,
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

-- 2.4 Materials Table (Documents, Videos, iFrame Games & HTML5 Games)
CREATE TABLE public.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    file_url TEXT DEFAULT '',
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'game_iframe', 'game_html5')),
    subject TEXT DEFAULT 'toan',
    grade INT DEFAULT 5,
    tags TEXT[] DEFAULT '{}',
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
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
    completion_time INT DEFAULT 0,
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_student_assignment UNIQUE (assignment_id, student_id)
);

-- 2.7 Announcements Table (Dặn dò cô chủ nhiệm)
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2.8 Class Activities Table (Hoạt động nổi bật của Lớp 5/4)
CREATE TABLE public.class_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    event_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------------
-- 3. PERFORMANCE INDEXES
-- --------------------------------------------------------------------------
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_dob ON public.profiles(dob);
CREATE INDEX idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX idx_classes_code ON public.classes(code);
CREATE INDEX idx_class_members_class ON public.class_members(class_id);
CREATE INDEX idx_class_members_student ON public.class_members(student_id);
CREATE INDEX idx_materials_author ON public.materials(author_id);
CREATE INDEX idx_materials_type ON public.materials(type);
CREATE INDEX idx_materials_subject ON public.materials(subject);
CREATE INDEX idx_assignments_class ON public.assignments(class_id);
CREATE INDEX idx_assignments_material ON public.assignments(material_id);
CREATE INDEX idx_student_progress_assignment ON public.student_progress(assignment_id);
CREATE INDEX idx_student_progress_student ON public.student_progress(student_id);
CREATE INDEX idx_student_progress_status ON public.student_progress(status);

-- --------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) SETUP
-- --------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_activities ENABLE ROW LEVEL SECURITY;

-- Helper functions to check auth status safely
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
-- 5. RLS POLICIES
-- --------------------------------------------------------------------------

-- 5.1 PROFILES POLICIES
CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admin or user insert profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin delete profile" ON public.profiles FOR DELETE USING (public.is_admin());

-- 5.2 CLASSES POLICIES
CREATE POLICY "Allow public view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow teacher create class" ON public.classes FOR INSERT WITH CHECK (public.is_teacher());
CREATE POLICY "Allow teacher update class" ON public.classes FOR UPDATE USING (public.is_teacher());
CREATE POLICY "Allow teacher delete class" ON public.classes FOR DELETE USING (public.is_teacher());

-- 5.3 CLASS MEMBERS POLICIES
CREATE POLICY "Allow view class members" ON public.class_members FOR SELECT USING (true);
CREATE POLICY "Allow join class" ON public.class_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow remove member" ON public.class_members FOR DELETE USING (public.is_teacher() OR student_id = auth.uid());

-- 5.4 MATERIALS POLICIES
CREATE POLICY "Allow reading materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Allow teacher create material" ON public.materials FOR INSERT WITH CHECK (public.is_teacher());
CREATE POLICY "Allow teacher update material" ON public.materials FOR UPDATE USING (public.is_teacher());
CREATE POLICY "Allow teacher delete material" ON public.materials FOR DELETE USING (public.is_teacher());

-- 5.5 ASSIGNMENTS POLICIES
CREATE POLICY "Allow reading assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Allow teacher create assignment" ON public.assignments FOR INSERT WITH CHECK (public.is_teacher());
CREATE POLICY "Allow teacher update assignment" ON public.assignments FOR UPDATE USING (public.is_teacher());
CREATE POLICY "Allow teacher delete assignment" ON public.assignments FOR DELETE USING (public.is_teacher());

-- 5.6 STUDENT PROGRESS POLICIES
CREATE POLICY "Allow reading progress" ON public.student_progress FOR SELECT USING (true);
CREATE POLICY "Allow student update progress" ON public.student_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow student save progress" ON public.student_progress FOR UPDATE USING (true);
CREATE POLICY "Allow teacher delete progress" ON public.student_progress FOR DELETE USING (public.is_teacher());

-- 5.7 ANNOUNCEMENTS & ACTIVITIES POLICIES
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Teacher create announcements" ON public.announcements FOR INSERT WITH CHECK (public.is_teacher());
CREATE POLICY "Public read activities" ON public.class_activities FOR SELECT USING (true);
CREATE POLICY "Teacher create activities" ON public.class_activities FOR INSERT WITH CHECK (public.is_teacher());

-- --------------------------------------------------------------------------
-- 6. AUTOMATED TRIGGER: SYNC AUTH.USERS TO PUBLIC.PROFILES
-- --------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, dob)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'dob', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = COALESCE(EXCLUDED.role, profiles.role),
    dob = COALESCE(EXCLUDED.dob, profiles.dob);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------------
-- 7. INITIAL DEMO SEED DATA (TRƯỜNG LE VAN TAM - LỚP 5/4)
-- --------------------------------------------------------------------------
-- Insert Announcements (Dặn dò cô chủ nhiệm)
INSERT INTO public.announcements (title, content) VALUES
('📢 Nhắc nhở Chuẩn bị Hội thao STEM & Robotics Lớp 5/4', 'Các em học sinh Lớp 5/4 nhớ mang theo dụng cụ học tập môn Công nghệ và sản phẩm nhóm để hoàn thiện dự án xe tự hành STEM trước Thứ Sáu tuần này nhé! - Cô Phan Thị Diễm Trang'),
('📚 Dặn dò ôn tập môn Toán Hỗn Số & Tỉ Số Phần Trăm', 'Cô đã giao 2 bài trắc nghiệm tương tác mới trên hệ thống. Các em truy cập vào mục "Bài Học Học Sinh" để hoàn thành và tích lũy điểm sao đổi quà! - Cô Phan Thị Diễm Trang');

-- Insert Class Activities (Hoạt động nổi bật)
INSERT INTO public.class_activities (title, description, image_url, event_date) VALUES
('Chương trình Trải nghiệm STEM & Robot Lớp 5/4', 'Các bạn học sinh Lớp 5/4 hào hứng lắp ráp và lập trình mô hình xe tự hành thông minh tại phòng Lab trường TH Lê Văn Tám.', '/assets/images/subject_learning_art.jpg', '2025-10-15'),
('Hành trình Địa chỉ đỏ & Sinh hoạt Sao Nhi Đồng', 'Lớp 5/4 dâng hoa tại di tích lịch sử và tham quan Không gian Văn hóa Hồ Chí Minh.', '/assets/images/school_banner.jpg', '2025-11-20'),
('Hội thao Phù Đổng Trường TH Lê Văn Tám 2025-2026', 'Lớp 5/4 xuất sắc giành giải Nhất môn Kéo co và giải Nhì môn Bóng đá nam cấp trường.', '/assets/images/school_banner.jpg', '2025-12-12');
