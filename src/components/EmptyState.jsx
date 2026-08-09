import React from 'react';
import { Database, Inbox } from 'lucide-react';

export default function EmptyState({ 
  title = 'Chưa có dữ liệu', 
  description = 'Cơ sở dữ liệu Supabase hiện đang trống hoặc chưa có bản ghi nào.',
  actionLabel = null,
  onAction = null 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      margin: '20px 0',
      background: 'white',
      borderRadius: '16px',
      border: '2px dashed #cbd5e1',
      textAlign: 'center'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#fef3c7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
      }}>
        <Inbox size={32} style={{ color: '#d97706' }} />
      </div>
      <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{title}</h4>
      <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', marginBottom: '20px', lineHeight: '1.5' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
