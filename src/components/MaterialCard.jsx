import React, { useState } from 'react';
import { FileText, Video, Gamepad2, Globe, ExternalLink, Play, Eye } from 'lucide-react';

export default function MaterialCard({ material, onAssign = null }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  function getBadge() {
    switch (material.type) {
      case 'document':
        return { label: 'Tài liệu Document', icon: <FileText size={16} />, bg: '#dbeafe', color: '#1d4ed8' };
      case 'video':
        return { label: 'Bài giảng Video', icon: <Video size={16} />, bg: '#fce7f3', color: '#be185d' };
      case 'game_iframe':
        return { label: 'Trò chơi IFrame', icon: <Gamepad2 size={16} />, bg: '#fef3c7', color: '#b45309' };
      case 'game_html5':
        return { label: 'Trò chơi HTML5', icon: <Globe size={16} />, bg: '#dcfce7', color: '#15803d' };
      default:
        return { label: material.type, icon: <FileText size={16} />, bg: '#f3f4f6', color: '#374151' };
    }
  }

  const badge = getBadge();

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
          {material.is_public && (
            <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
              Công khai
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
          {material.title}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.5' }}>
          {material.description || 'Không có mô tả chi tiết.'}
        </p>

        {material.author?.full_name && (
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
            Tác giả: <strong>{material.author.full_name}</strong>
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        {material.file_url && (
          <button
            onClick={() => setIsPreviewOpen(true)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#f1f5f9',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <Eye size={16} /> Xem / Trải nghiệm
          </button>
        )}

        {onAssign && (
          <button
            onClick={() => onAssign(material)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Giao bài học
          </button>
        )}
      </div>

      {/* Modal Preview for Videos / IFrame Games / Documents */}
      {isPreviewOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{material.title}</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕ Đóng
              </button>
            </div>

            {material.type === 'video' ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden' }}>
                <iframe
                  src={material.file_url.includes('youtube.com') ? material.file_url.replace('watch?v=', 'embed/') : material.file_url}
                  title={material.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                />
              </div>
            ) : material.type === 'game_iframe' || material.type === 'game_html5' ? (
              <div style={{ height: '480px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <iframe
                  src={material.file_url}
                  title={material.title}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            ) : (
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                <FileText size={48} style={{ color: '#3b82f6', marginBottom: '12px' }} />
                <p style={{ marginBottom: '16px' }}>{material.description}</p>
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  <ExternalLink size={16} /> Tải / Mở tài liệu ở cửa sổ mới
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
