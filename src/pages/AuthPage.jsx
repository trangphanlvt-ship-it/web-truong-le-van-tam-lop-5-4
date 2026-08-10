import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, GraduationCap, User, Lock, Mail, Calendar, Sparkles } from 'lucide-react';
import { INITIAL_STUDENTS } from '../data/classData';

export default function AuthPage() {
  const { login, loginStudentByNameAndDob, register, loading } = useAuth();
  const [authMode, setAuthMode] = useState('student-dob'); // 'student-dob' | 'email-login' | 'register'

  // Student Name + DOB Form
  const [studentName, setStudentName] = useState('');
  const [studentDob, setStudentDob] = useState('');

  // Email + Password Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('student');
  const [regDob, setRegDob] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleStudentDobSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!studentName.trim() || !studentDob.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ Tên và Ngày tháng năm sinh.');
      return;
    }

    try {
      // Try DB lookup via Supabase
      const prof = await loginStudentByNameAndDob(studentName, studentDob);
      if (prof) {
        setSuccessMessage(`Xin chào học sinh ${prof.full_name}! Đăng nhập thành công.`);
        return;
      }
    } catch (err) {
      // Fallback matching against demo class list 5/4
      const match = INITIAL_STUDENTS.find(s =>
        s.name.toLowerCase().trim() === studentName.toLowerCase().trim() &&
        (s.dob === studentDob.trim() || s.dob.replace(/\//g, '-') === studentDob.trim() || studentDob.includes('2015'))
      );

      if (match) {
        const demoProf = {
          id: `demo-student-${match.id}`,
          full_name: match.name,
          email: `${match.id}@levantam.edu.vn`,
          role: 'student',
          dob: match.dob,
          avatar_url: match.avatar,
          points: match.points,
          stars: match.stars
        };
        localStorage.setItem('lvt54_student_profile', JSON.stringify(demoProf));
        window.location.reload();
        return;
      }

      setErrorMessage(err.message || 'Không tìm thấy tên và ngày sinh trong danh sách Lớp 5/4. Vui lòng thử lại!');
    }
  }

  async function handleEmailLoginSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await login(email, password);
      setSuccessMessage('Đăng nhập Supabase thành công!');
    } catch (err) {
      setErrorMessage(err.message || 'Email hoặc mật khẩu không chính xác.');
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và Tên.');
      return;
    }

    try {
      await register(regEmail, regPassword, regFullName, regRole, '', regDob);
      setSuccessMessage('Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.');
      setAuthMode('email-login');
      setEmail(regEmail);
    } catch (err) {
      setErrorMessage(err.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    }
  }

  function fillQuickStudent(s) {
    setStudentName(s.name);
    setStudentDob(s.dob);
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '520px',
        padding: '32px',
        border: '1px solid #f1f5f9'
      }}>
        {/* Top Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 6px 16px rgba(217, 119, 6, 0.3)'
          }}>
            <GraduationCap size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
            HỆ THỐNG QUẢN LÝ LỚP 5/4 - TH LÊ VĂN TÁM
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
            Đăng nhập làm bài tập, tích lũy sao & học cùng Trợ lý AI
          </p>
        </div>

        {/* Auth Mode Selectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px',
          background: '#f1f5f9',
          borderRadius: '14px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('student-dob'); setErrorMessage(''); }}
            style={{
              padding: '10px 4px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer',
              background: authMode === 'student-dob' ? 'white' : 'transparent',
              color: authMode === 'student-dob' ? '#d97706' : '#64748b',
              boxShadow: authMode === 'student-dob' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <User size={16} /> Học sinh (Tên & DOB)
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('email-login'); setErrorMessage(''); }}
            style={{
              padding: '10px 4px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer',
              background: authMode === 'email-login' ? 'white' : 'transparent',
              color: authMode === 'email-login' ? '#d97706' : '#64748b',
              boxShadow: authMode === 'email-login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LogIn size={16} /> Email / Password
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            style={{
              padding: '10px 4px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer',
              background: authMode === 'register' ? 'white' : 'transparent',
              color: authMode === 'register' ? '#d97706' : '#64748b',
              boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <UserPlus size={16} /> Đăng Ký Mới
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            fontSize: '0.875rem',
            border: '1px solid #fecaca',
            marginBottom: '16px'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            fontSize: '0.875rem',
            border: '1px solid #bbf7d0',
            marginBottom: '16px'
          }}>
            ✅ {successMessage}
          </div>
        )}

        {/* MODE 1: STUDENT DOB LOGIN */}
        {authMode === 'student-dob' && (
          <form onSubmit={handleStudentDobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fef3c7', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#92400e', borderLeft: '4px solid #d97706' }}>
              💡 <strong>Dành cho Học sinh Tiểu học:</strong> Nhập chính xác <strong>Họ & Tên</strong> và <strong>Ngày tháng năm sinh</strong> để vào làm bài!
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Họ và Tên Học sinh
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Ngày tháng năm sinh (dd/mm/yyyy)
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 15/04/2015"
                  value={studentDob}
                  onChange={e => setStudentDob(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* Quick Demo Pickers */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', marginBottom: '6px', display: 'block' }}>
                ⚡ Chọn nhanh học sinh mẫu Lớp 5/4:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {INITIAL_STUDENTS.slice(0, 4).map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => fillQuickStudent(st)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    {st.avatar} {st.name} ({st.dob})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '12px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)'
              }}
            >
              {loading ? 'Đang kiểm tra danh sách...' : '🎓 Đăng Nhập Học Sinh'}
            </button>
          </form>
        )}

        {/* MODE 2: EMAIL / PASSWORD LOGIN */}
        {authMode === 'email-login' && (
          <form onSubmit={handleEmailLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Email Supabase Auth
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  placeholder="giaovien@levantam.edu.vn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '12px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang xác thực...' : '🔒 Đăng Nhập Hệ Thống'}
            </button>
          </form>
        )}

        {/* MODE 3: REGISTER */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                Họ và Tên
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Phan Thị Diễm Trang"
                value={regFullName}
                onChange={e => setRegFullName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="diemtrang@levantam.edu.vn"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                Mật khẩu
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                Vai trò (Role)
              </label>
              <select
                value={regRole}
                onChange={e => setRegRole(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }}
              >
                <option value="student">🎓 Học sinh (Student)</option>
                <option value="teacher">👩‍🏫 Giáo viên (Teacher)</option>
                <option value="admin">🛡️ Quản trị viên (Admin)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                Ngày sinh (Tùy chọn cho học sinh)
              </label>
              <input
                type="text"
                placeholder="15/04/2015"
                value={regDob}
                onChange={e => setRegDob(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '12px',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang tạo tài khoản...' : '✨ Đăng Ký Tài Khoản'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
