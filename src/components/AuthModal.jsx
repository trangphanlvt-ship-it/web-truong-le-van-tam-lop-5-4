import React, { useState } from 'react';
import { loginUserWithSupabase, registerUserInSupabase } from '../lib/supabase';

export default function AuthModal({ onClose, students, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login');
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regFullname, setRegFullname] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regStudentId, setRegStudentId] = useState('');

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLoginSubmit(e) {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      setFeedback({ type: 'error', text: 'Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu!' });
      return;
    }

    setLoading(true);
    setFeedback({ type: 'info', text: 'Đang xác thực thông tin tài khoản với Supabase DB...' });

    const res = await loginUserWithSupabase({ username: loginUsername, password: loginPassword });
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
      alert(`🎉 Đăng nhập thành công!\nChào mừng ${res.user.name} (${res.user.role})!`);
    } else {
      // Fallback local student check
      const found = students.find(s => s.name.toLowerCase() === loginUsername.toLowerCase());
      if (found) {
        onLoginSuccess(found);
        onClose();
        alert(`🎉 Đăng nhập thành công!\nChào mừng em ${found.name}!`);
      } else {
        setFeedback({ type: 'error', text: res.error || 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
      }
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setFeedback({ type: 'error', text: 'Mật khẩu và Xác nhận mật khẩu không khớp nhau!' });
      return;
    }

    if (regPassword.length < 6) {
      setFeedback({ type: 'error', text: 'Mật khẩu phải có tối thiểu 6 ký tự!' });
      return;
    }

    setLoading(true);
    setFeedback({ type: 'info', text: 'Đang lưu tài khoản vào Supabase DB...' });

    const studentId = regStudentId ? parseInt(regStudentId) : null;
    const linkedStudent = studentId ? students.find(s => s.id === studentId) : null;
    const avatar = linkedStudent ? linkedStudent.avatar : '👦';

    const res = await registerUserInSupabase({
      username: regUsername,
      password: regPassword,
      fullName: regFullname,
      studentId,
      avatar
    });

    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
      alert(`🎉 Đăng ký tài khoản thành công!\nTài khoản "${regUsername}" đã lưu vào Supabase DB.`);
    } else {
      setFeedback({ type: 'error', text: res.error || 'Đăng ký thất bại, vui lòng kiểm tra lại!' });
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-green-dark)' }}>
            🔐 Cổng Tài Khoản Lớp 5/4
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div className="auth-tabs-nav">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setFeedback(null); }}
          >
            🔑 Đăng Nhập
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setFeedback(null); }}
          >
            📝 Đăng Ký Tài Khoản
          </button>
        </div>

        {feedback && (
          <div className={`auth-feedback-msg ${feedback.type === 'error' ? 'error' : 'success'}`}>
            {feedback.text}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Đăng nhập bằng <strong>Username (Tên tài khoản)</strong> và <strong>Mật khẩu</strong> của bạn.
            </p>

            <div className="form-group">
              <label className="form-label">Tên tài khoản (Username):</label>
              <input
                type="text" className="form-input" placeholder="Ví dụ: nguyenvanan hoặc cotiengtrang"
                value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu:</label>
              <input
                type="password" className="form-input" placeholder="Nhập mật khẩu..."
                value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required
              />
            </div>

            <button type="submit" className="btn-play-game" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
              {loading ? 'ĐANG XÁC THỰC...' : '🚀 ĐĂNG NHẬP'}
            </button>

            <div style={{ fontSize: '0.82rem', textAlign: 'center', marginTop: '12px', color: 'var(--ink-soft)' }}>
              💡 Mẫu sẵn: Username <strong>nguyenvanan</strong> / Mật khẩu: <strong>123456</strong>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '16px' }}>
              Tạo tài khoản mới được đồng bộ & lưu trực tiếp vào <strong>Supabase DB</strong>.
            </p>

            <div className="form-group">
              <label className="form-label">Tên đăng nhập (Username):</label>
              <input
                type="text" className="form-input" placeholder="Ví dụ: lehoangnam54"
                value={regUsername} onChange={e => setRegUsername(e.target.value)} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Họ và Tên hiển thị:</label>
              <input
                type="text" className="form-input" placeholder="Ví dụ: Lê Hoàng Nam"
                value={regFullname} onChange={e => setRegFullname(e.target.value)} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu:</label>
              <input
                type="password" className="form-input" placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu:</label>
              <input
                type="password" className="form-input" placeholder="Nhập lại mật khẩu..."
                value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} required minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Liên kết học sinh Lớp 5/4 (Tùy chọn):</label>
              <select className="form-select" value={regStudentId} onChange={e => setRegStudentId(e.target.value)}>
                <option value="">-- Tạo tài khoản học sinh mới --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.avatar} {s.name} ({s.group} - {s.role})</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-play-game" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px', background: 'var(--accent-purple)' }}>
              {loading ? 'ĐANG TẠO TÀI KHOẢN...' : '✨ TẠO TÀI KHOẢN SUPABASE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
