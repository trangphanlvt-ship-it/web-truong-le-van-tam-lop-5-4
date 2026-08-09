import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Shield, GraduationCap, User, Lock, Mail } from 'lucide-react';

export default function AuthPage() {
  const { login, register, loading } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isLoginTab) {
        await login(email, password);
        setSuccessMessage('Đăng nhập thành công!');
      } else {
        if (!fullName.trim()) {
          setErrorMessage('Vui lòng nhập họ và tên.');
          return;
        }
        await register(email, password, fullName, role, avatarUrl);
        setSuccessMessage('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        setIsLoginTab(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Thao tác không thành công. Vui lòng thử lại!');
    }
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
        maxWidth: '480px',
        padding: '32px',
        border: '1px solid #f1f5f9'
      }}>
        {/* Top Header */}
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
            Hệ Thống Lớp 5/4 - TH Lê Văn Tám
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            Xác thực tài khoản với Supabase Auth
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              background: isLoginTab ? 'white' : 'transparent',
              color: isLoginTab ? '#d97706' : '#64748b',
              boxShadow: isLoginTab ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={16} /> Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              background: !isLoginTab ? 'white' : 'transparent',
              color: !isLoginTab ? '#d97706' : '#64748b',
              boxShadow: !isLoginTab ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={16} /> Đăng Ký
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLoginTab && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Họ và Tên
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
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
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Email Supabase
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input
                type="email"
                required
                placeholder="hocsinh@levantam.edu.vn"
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

          {!isLoginTab && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Vai trò (Role)
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.95rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="student">🎓 Học sinh (Student)</option>
                <option value="teacher">👩‍🏫 Giáo viên (Teacher)</option>
                <option value="admin">🛡️ Quản trị viên (Admin)</option>
              </select>
            </div>
          )}

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
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Đang xử lý...' : (isLoginTab ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
          </button>
        </form>
      </div>
    </div>
  );
}
