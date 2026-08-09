import { createClient } from '@supabase/supabase-js';

// Environment variables or default fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sysvyvgradzmglvuxuam.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5c3Z5dmdyYWR6bWdsdnV4dWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTQxMTgsImV4cCI6MjEwMTYzMDExOH0.KDkhrOirRslJHgFkcnIedN_0UeZryr9Rp7I4hbwDLuk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// 1. AUTHENTICATION HELPERS (Supabase Auth & Profiles)
// ============================================================================

export async function signUpUser({ email, password, fullName, role = 'student', avatarUrl = '' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
        avatar_url: avatarUrl
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signInUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateProfileRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// 2. CLASSES HELPERS
// ============================================================================

export async function getClasses() {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      teacher:profiles!teacher_id (full_name, email),
      class_members (count)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createClass({ name, description, code, teacherId }) {
  const { data, error } = await supabase
    .from('classes')
    .insert([{
      name,
      description,
      code: code.trim().toUpperCase(),
      teacher_id: teacherId
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinClassByCode(code, studentId) {
  const cleanCode = code.trim().toUpperCase();

  // Find class by code
  const { data: classData, error: findErr } = await supabase
    .from('classes')
    .select('id, name')
    .eq('code', cleanCode)
    .single();

  if (findErr || !classData) {
    throw new Error('Mã lớp không tồn tại. Vui lòng kiểm tra lại!');
  }

  // Insert into class_members
  const { data, error } = await supabase
    .from('class_members')
    .insert([{
      class_id: classData.id,
      student_id: studentId
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Bạn đã tham gia lớp học này rồi!');
    }
    throw error;
  }

  return { member: data, className: classData.name };
}

export async function getClassMembers(classId) {
  const { data, error } = await supabase
    .from('class_members')
    .select(`
      id,
      joined_at,
      student:profiles!student_id (id, full_name, email, role, avatar_url)
    `)
    .eq('class_id', classId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============================================================================
// 3. MATERIALS HELPERS
// ============================================================================

export async function getMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select(`
      *,
      author:profiles!author_id (full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMaterial({ title, description, fileUrl, type, authorId, isPublic = false }) {
  const { data, error } = await supabase
    .from('materials')
    .insert([{
      title,
      description,
      file_url: fileUrl,
      type,
      author_id: authorId,
      is_public: isPublic
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// 4. ASSIGNMENTS HELPERS
// ============================================================================

export async function getAssignments(classId = null) {
  let query = supabase
    .from('assignments')
    .select(`
      *,
      material:materials!material_id (*),
      class:classes!class_id (name, code)
    `)
    .order('created_at', { ascending: false });

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createAssignment({ materialId, classId, dueDate }) {
  const { data, error } = await supabase
    .from('assignments')
    .insert([{
      material_id: materialId,
      class_id: classId,
      due_date: dueDate || null
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// 5. STUDENT PROGRESS HELPERS
// ============================================================================

export async function getStudentProgress(studentId) {
  const { data, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      assignment:assignments!assignment_id (
        id, due_date,
        material:materials!material_id (title, type, file_url, description),
        class:classes!class_id (name, code)
      )
    `)
    .eq('student_id', studentId);

  if (error) throw error;
  return data || [];
}

export async function upsertStudentProgress({ assignmentId, studentId, status, score }) {
  const payload = {
    assignment_id: assignmentId,
    student_id: studentId,
    status: status,
    score: score !== undefined ? score : 0,
    completed_at: status === 'completed' || status === 'submitted' ? new Date().toISOString() : null
  };

  const { data, error } = await supabase
    .from('student_progress')
    .upsert([payload], { onConflict: 'assignment_id,student_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllProgressForClass(classId) {
  const { data, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      student:profiles!student_id (full_name, email),
      assignment:assignments!assignment_id (
        id,
        material:materials!material_id (title, type)
      )
    `);

  if (error) throw error;
  return data || [];
}
