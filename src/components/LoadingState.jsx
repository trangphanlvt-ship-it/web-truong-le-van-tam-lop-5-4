import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Đang tải dữ liệu từ Supabase...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      minHeight: '200px',
      textAlign: 'center'
    }}>
      <Loader2 className="animate-spin" size={40} style={{ color: '#d97706', marginBottom: '16px' }} />
      <p style={{ color: '#4b5563', fontSize: '1rem', fontWeight: '500' }}>{message}</p>
    </div>
  );
}
