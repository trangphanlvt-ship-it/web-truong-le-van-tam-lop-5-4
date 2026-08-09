import React from 'react';
import { School, Users, Key, Calendar } from 'lucide-react';

export default function ClassCard({ classData, onViewMembers = null, onAssignMaterial = null }) {
  const memberCount = classData.class_members?.[0]?.count || 0;
  const teacherName = classData.teacher?.full_name || 'Chưa cập nhật';

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fffbe3',
            color: '#b45309',
            border: '1px solid #fef08a',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '700'
          }}>
            <School size={14} /> Lớp học
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#1e293b',
            background: '#f1f5f9',
            padding: '4px 8px',
            borderRadius: '8px'
          }}>
            <Key size={14} style={{ color: '#d97706' }} /> Mã: <code>{classData.code}</code>
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
          {classData.name}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.4' }}>
          {classData.description || 'Lớp học thuộc hệ thống Quản lý Lớp 5/4 Trường TH Lê Văn Tám.'}
        </p>

        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.85rem', color: '#475569' }}>
          <p style={{ marginBottom: '4px' }}>👨‍🏫 Giáo viên: <strong>{teacherName}</strong></p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={14} /> Sĩ số: <strong>{memberCount} học sinh</strong>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {onViewMembers && (
          <button
            onClick={() => onViewMembers(classData)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Danh sách học sinh
          </button>
        )}

        {onAssignMaterial && (
          <button
            onClick={() => onAssignMaterial(classData)}
            style={{
              padding: '8px 12px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Giao bài
          </button>
        )}
      </div>
    </div>
  );
}
