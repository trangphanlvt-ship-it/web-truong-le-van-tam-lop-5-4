import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Shield, School, GraduationCap, User, Megaphone, Trophy, Sparkles } from 'lucide-react';

export default function Header({ activeSection, setActiveSection }) {
  const { user, profile, role, isAdmin, isTeacher, isStudent, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[now.getDay()];
      const dateStr = String(now.getDate()).padStart(2, '0');
      const monthStr = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');

      setTimeStr(`${dayName}, ngày ${dateStr}/${monthStr}/${year} ${hours}:${mins}:${secs}`);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: '🏠 Trang Chủ' },
    { id: 'subjects', label: '📚 7 Môn SGK Lớp 5' },
    { id: 'activities', label: '🎨 Hoạt Động Lớp' },
    { id: 'hcm-space', label: '🇻🇳 VH Hồ Chí Minh' },
    { id: 'leaderboard', label: '🏆 Vinh Danh' },
    { id: 'announcements', label: '📢 Dặn Dò Cô Trang' },
    { id: 'class-list', label: '👥 Sơ Đồ Lớp 5/4' }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin-dashboard', label: '🛡️ QL Admin & RLS' });
  }
  if (isTeacher) {
    navItems.push({ id: 'teacher-dashboard', label: '👩‍🏫 QL Lớp & Học Liệu' });
  }
  if (user || profile) {
    navItems.push({ id: 'student-dashboard', label: '🎓 Góc Học Sinh' });
  }

  return (
    <header className="main-header">
      {/* Top Banner Bar */}
      <div className="header-top-bar" style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="school-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveSection('home')}>
          <div className="school-logo-emblem">🇻🇳</div>
          <div>
            <div className="school-title">TRƯỜNG TIỂU HỌC LÊ VĂN TÁM</div>
            <div className="school-subtitle">
              LỚP 5/4 • NĂM HỌC 2025-2026 • GVCN: PHAN THỊ DIỄM TRANG
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
              📍 S15 đường Tân Phú, phường Tân Mỹ, Thành phố Hồ Chí Minh
            </div>
          </div>
        </div>

        {profile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.95)',
              padding: '6px 16px',
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{profile?.avatar_url || '👦'}</span>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>
                  {profile?.full_name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: '800', textTransform: 'uppercase' }}>
                  {role === 'admin' ? '🛡️ Admin' : role === 'teacher' ? '👩‍🏫 Giáo Viên' : `🎓 Học Sinh ⭐ ${profile.stars || 0}`}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        ) : (
          <button
            className="user-auth-badge"
            onClick={() => setActiveSection('auth')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: 'white',
              borderRadius: '20px',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
            }}
          >
            <LogIn size={16} /> Đăng nhập / Đăng ký
          </button>
        )}
      </div>

      {/* Live Date-Time Bar under Banner */}
      <div className="live-clock-banner">
        <div className="clock-scroll-text">
          🕒 <strong>{timeStr}</strong> | 🏫 Trường TH Lê Văn Tám - Lớp 5/4 (2025-2026) | GVCN: Cô PHAN THỊ DIỄM TRANG | Địa chỉ: S15 đường Tân Phú, P. Tân Mỹ, TP.HCM | Supabase PostgreSQL DB & RLS Active!
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-container">
          <ul className="nav-links-list">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
