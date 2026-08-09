import React from 'react';
import { Calendar, CheckCircle2, Clock, FileCheck, Award } from 'lucide-react';
import MaterialCard from './MaterialCard';

export default function AssignmentCard({ assignment, progress = null, onSubmitProgress = null, isTeacher = false }) {
  const material = assignment.material;
  const status = progress?.status || 'not_started';
  const score = progress?.score || 0;

  function getStatusBadge() {
    switch (status) {
      case 'completed':
        return { label: 'Đã hoàn thành', icon: <CheckCircle2 size={16} />, bg: '#dcfce7', color: '#15803d' };
      case 'submitted':
        return { label: 'Đã nộp bài', icon: <FileCheck size={16} />, bg: '#dbeafe', color: '#1d4ed8' };
      case 'in_progress':
        return { label: 'Đang làm bài', icon: <Clock size={16} />, bg: '#fef3c7', color: '#b45309' };
      default:
        return { label: 'Chưa làm', icon: <Clock size={16} />, bg: '#f1f5f9', color: '#64748b' };
    }
  }

  const badge = getStatusBadge();
  const dueDateStr = assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('vi-VN') : 'Không giới hạn';

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600',
          backgroundColor: badge.bg,
          color: badge.color
        }}>
          {badge.icon}
          {badge.label}
        </span>

        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} /> Hạn nộp: <strong>{dueDateStr}</strong>
        </span>
      </div>

      {material && <MaterialCard material={material} />}

      {/* Progress & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px dashed #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <Award size={18} style={{ color: '#d97706' }} />
          <span>Điểm số: <strong style={{ color: '#d97706', fontSize: '1rem' }}>{score} / 100</strong></span>
        </div>

        {onSubmitProgress && !isTeacher && status !== 'completed' && (
          <button
            onClick={() => onSubmitProgress(assignment, 'completed', 100)}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)'
            }}
          >
            Nộp bài & Đạt 100 điểm
          </button>
        )}
      </div>
    </div>
  );
}
