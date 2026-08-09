import React, { useState, useEffect } from 'react';
import { getAllProfiles, updateProfileRole, getClasses, getMaterials } from '../lib/supabase';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { Shield, Users, School, BookOpen, UserCheck, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [pData, cData, mData] = await Promise.all([
        getAllProfiles(),
        getClasses(),
        getMaterials()
      ]);
      setProfiles(pData || []);
      setClasses(cData || []);
      setMaterials(mData || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleRoleChange(userId, newRole) {
    setUpdatingId(userId);
    try {
      await updateProfileRole(userId, newRole);
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
      setMessage({ type: 'success', text: 'Cập nhật phân quyền thành công!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Lỗi khi cập nhật vai trò' });
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return <LoadingState message="Đang tải danh sách tài khoản & dữ liệu hệ thống từ Supabase DB..." />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(217, 119, 6, 0.2)',
            color: '#fbbf24',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            <Shield size={16} /> Bảng Điều Khiển Admin (Quản Trị Hệ Thống)
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Quản Lý Người Dùng & Phân Quyền RLS</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Bảng dữ liệu thực tế từ Supabase Postgres (`public.profiles`, `public.classes`, `public.materials`)
          </p>
        </div>

        <button
          onClick={loadAdminData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: '#d97706',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} /> Làm mới dữ liệu
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={32} style={{ color: '#2563eb' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{profiles.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tổng số tài khoản</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <School size={32} style={{ color: '#d97706' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{classes.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Lớp học đang tạo</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={32} style={{ color: '#16a34a' }} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{materials.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Tài liệu / Trò chơi</div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Profiles Table Section */}
      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
            Danh Sách Tài Khoản Người Dùng (`public.profiles`)
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{profiles.length} người dùng</span>
        </div>

        {profiles.length === 0 ? (
          <EmptyState
            title="Chưa có người dùng nào"
            description="Bảng `profiles` trong Supabase chưa chứa bản ghi nào. Vui lòng đăng ký tài khoản mới qua form Đăng Ký."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px' }}>Họ & Tên</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Vai Trò Hiện Tại</th>
                  <th style={{ padding: '12px 16px' }}>Thay Đổi Vai Trò</th>
                  <th style={{ padding: '12px 16px' }}>Ngày Tạo</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>
                      {p.full_name || 'Chưa đặt tên'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      {p.email}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        backgroundColor: p.role === 'admin' ? '#fef3c7' : p.role === 'teacher' ? '#dbeafe' : '#f1f5f9',
                        color: p.role === 'admin' ? '#b45309' : p.role === 'teacher' ? '#1d4ed8' : '#475569'
                      }}>
                        {p.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={p.role}
                        disabled={updatingId === p.id}
                        onChange={e => handleRoleChange(p.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.8rem' }}>
                      {new Date(p.created_at).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
