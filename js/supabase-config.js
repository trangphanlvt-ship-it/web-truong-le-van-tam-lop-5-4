/* ==========================================================================
   SUPABASE INTEGRATION CONFIGURATION & AUTHENTICATION CLIENT
   Website Lớp 5/4 - Trường TH Lê Văn Tám
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: "https://sysvyvgradzmglvuxuam.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5c3Z5dmdyYWR6bWdsdnV4dWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTQxMTgsImV4cCI6MjEwMTYzMDExOH0.KDkhrOirRslJHgFkcnIedN_0UeZryr9Rp7I4hbwDLuk"
};

let supabaseClient = null;

// Initialize Supabase Client
function initSupabaseClient() {
  if (typeof window.supabase !== "undefined") {
    if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.url.startsWith("https://") && !SUPABASE_CONFIG.url.includes("your-project-ref")) {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        console.log("✅ Supabase Client initialized successfully!");
        return true;
      } catch (err) {
        console.warn("⚠️ Failed to initialize Supabase client:", err);
      }
    }
  }
  console.log("ℹ️ Supabase credentials not set yet or offline. Running in local fallback mode.");
  return false;
}

// Client-side SHA-256 Hashing for Passwords
async function hashPassword(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback simple string transform if Web Crypto API is unavailable
    return btoa(password);
  }
}

// 1. REGISTER NEW USER IN SUPABASE
async function registerUserInSupabase({ username, password, fullName, studentId, avatar }) {
  if (!supabaseClient) return { success: false, offline: true, error: "Chưa kết nối Supabase" };

  try {
    const cleanUsername = username.trim().toLowerCase();
    
    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabaseClient
      .from("user_accounts")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: "Tên đăng nhập (username) này đã tồn tại! Vui lòng chọn tên khác." };
    }

    const passwordHash = await hashPassword(password);
    const userRole = cleanUsername.includes("gv") || cleanUsername.includes("teacher") || cleanUsername.includes("trang") ? "teacher" : "student";

    const { data: newUser, error: insertError } = await supabaseClient
      .from("user_accounts")
      .insert([{
        username: cleanUsername,
        password_hash: passwordHash,
        full_name: fullName,
        role: userRole,
        student_id: studentId || null,
        avatar: avatar || "👦"
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting user:", insertError);
      return { success: false, error: insertError.message || "Lỗi khi đăng ký tài khoản" };
    }

    // Link student profile if selected
    let studentData = null;
    if (studentId) {
      const { data: stData } = await supabaseClient
        .from("students")
        .select("*")
        .eq("id", studentId)
        .maybeSingle();
      if (stData) studentData = stData;
    }

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.full_name,
        role: newUser.role,
        avatar: newUser.avatar,
        studentId: newUser.student_id,
        points: studentData ? studentData.points : 0,
        stars: studentData ? studentData.stars : 0,
        badge: studentData ? studentData.badge : 'Học sinh Mới',
        group: studentData ? studentData.group_name : 'Lớp 5/4'
      }
    };
  } catch (err) {
    console.error("Register exception:", err);
    return { success: false, error: err.message || "Lỗi hệ thống khi đăng ký" };
  }
}

// 2. LOGIN USER WITH SUPABASE (USERNAME & PASSWORD)
async function loginUserWithSupabase({ username, password }) {
  if (!supabaseClient) return { success: false, offline: true, error: "Chưa kết nối Supabase" };

  try {
    const cleanUsername = username.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabaseClient
      .from("user_accounts")
      .select("*")
      .eq("username", cleanUsername)
      .eq("password_hash", passwordHash)
      .maybeSingle();

    if (error || !user) {
      return { success: false, error: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
    }

    // Get linked student data
    let studentData = null;
    if (user.student_id) {
      const { data: st } = await supabaseClient
        .from("students")
        .select("*")
        .eq("id", user.student_id)
        .maybeSingle();
      if (st) studentData = st;
    }

    return {
      success: true,
      user: {
        id: user.student_id || user.id,
        username: user.username,
        name: user.full_name,
        role: user.role === 'teacher' ? 'GVCN Lớp 5/4' : (studentData ? studentData.role : 'Học sinh'),
        avatar: user.avatar || (studentData ? studentData.avatar : '👦'),
        studentId: user.student_id,
        points: studentData ? studentData.points : 0,
        stars: studentData ? studentData.stars : 0,
        badge: studentData ? studentData.badge : 'Học sinh Tích cực',
        group: studentData ? studentData.group_name : 'Lớp 5/4'
      }
    };
  } catch (err) {
    console.error("Login exception:", err);
    return { success: false, error: err.message || "Lỗi khi đăng nhập" };
  }
}

// 3. FETCH ALL STUDENTS FROM SUPABASE
async function fetchStudentsFromSupabase() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("students")
      .select("*")
      .order("points", { ascending: false });

    if (error) {
      console.error("Error fetching students:", error);
      return null;
    }
    
    return data.map(s => ({
      id: s.id,
      name: s.name,
      dob: s.dob,
      gender: s.gender,
      role: s.role,
      avatar: s.avatar,
      points: s.points,
      stars: s.stars,
      badge: s.badge,
      group: s.group_name || s.group
    }));
  } catch (err) {
    console.error("Supabase exception (fetchStudents):", err);
    return null;
  }
}

// 4. UPDATE STUDENT POINTS & STARS IN SUPABASE
async function updateStudentPointsInSupabase(studentId, points, stars) {
  if (!supabaseClient || !studentId) return false;
  try {
    const { data, error } = await supabaseClient
      .from("students")
      .update({
        points: points,
        stars: stars,
        updated_at: new Date().toISOString()
      })
      .eq("id", studentId);

    if (error) {
      console.error("Error updating points in Supabase:", error);
      return false;
    }
    console.log(`✅ Updated student #${studentId} points (${points} pts) on Supabase!`);
    return true;
  } catch (err) {
    console.error("Supabase exception (updatePoints):", err);
    return false;
  }
}

// 5. FETCH CUSTOM QUESTIONS FROM SUPABASE
async function fetchCustomQuestionsFromSupabase() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("custom_questions")
      .select("*");

    if (error) return null;
    return data.map(q => ({
      subjectId: q.subject_id,
      q: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      answer: q.answer,
      hint: q.hint
    }));
  } catch (err) {
    return null;
  }
}

// 6. INSERT QUESTION TO SUPABASE
async function insertQuestionToSupabase(qObj) {
  if (!supabaseClient) return false;
  try {
    const { data, error } = await supabaseClient
      .from("custom_questions")
      .insert([{
        subject_id: qObj.subjectId,
        question: qObj.q,
        option_a: qObj.options[0],
        option_b: qObj.options[1],
        option_c: qObj.options[2],
        option_d: qObj.options[3],
        answer: qObj.answer,
        hint: qObj.hint
      }]);
    return !error;
  } catch (err) {
    return false;
  }
}

// 7. FETCH ACTIVITIES FROM SUPABASE
async function fetchActivitiesFromSupabase() {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("class_activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return null;
    return data.map(a => ({
      id: a.id,
      title: a.title,
      date: a.activity_date,
      image: a.image_url,
      desc: a.description
    }));
  } catch (err) {
    return null;
  }
}
