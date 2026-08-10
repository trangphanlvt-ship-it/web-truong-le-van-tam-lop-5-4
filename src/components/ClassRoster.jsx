import React, { useState } from 'react';

export default function ClassRoster({ students }) {
  const [selectedGroup, setSelectedGroup] = useState('all');

  const groups = ['all', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'];

  const filteredStudents = selectedGroup === 'all'
    ? students
    : students.filter(s => s.group === selectedGroup);

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: '700', color: 'var(--ink-dark)' }}>Lọc theo Tổ:</span>
        {groups.map(g => (
          <button
            key={g}
            className={`subj-tab-btn ${selectedGroup === g ? 'active' : ''}`}
            onClick={() => setSelectedGroup(g)}
          >
            {g === 'all' ? `Tất cả (${students.length})` : g}
          </button>
        ))}
      </div>

      <div className="students-grid">
        {filteredStudents.map(s => (
          <div key={s.id} className="student-card">
            <div className="student-avatar">{s.avatar_url || s.avatar || '👦'}</div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontWeight: '800', color: 'var(--ink-dark)', fontSize: '1.05rem' }}>{s.full_name || s.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>📅 Ngày sinh: {s.dob || '2015'}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>🏷️ {s.group || 'Lớp 5/4'} - {s.role || 'Thành viên'}</div>
              <span style={{
                display: 'inline-block',
                marginTop: '6px',
                background: '#f1f5f9',
                color: 'var(--primary-green-dark)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: '700'
              }}>
                {s.badge || 'Học sinh Lớp 5/4'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
