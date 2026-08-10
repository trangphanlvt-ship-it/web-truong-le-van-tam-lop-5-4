import React, { useState, useEffect } from 'react';
import { getMaterials } from '../lib/supabase';
import { Play, BookOpen, ExternalLink, Gamepad2, FileText, Video } from 'lucide-react';

export default function SubjectLearning({ subjects, onLaunchGame }) {
  const [selectedSubjId, setSelectedSubjId] = useState(subjects[0]?.id || 'toan');
  const [dbMaterials, setDbMaterials] = useState([]);
  const [activeIframeModal, setActiveIframeModal] = useState(null);

  const currentSubj = subjects.find(s => s.id === selectedSubjId) || subjects[0];

  useEffect(() => {
    async function loadMaterials() {
      try {
        const mats = await getMaterials();
        setDbMaterials(mats || []);
      } catch (e) {
        console.warn('DB materials fetch note:', e);
      }
    }
    loadMaterials();
  }, []);

  // Filter DB materials matching current subject key
  const matchedDbMaterials = dbMaterials.filter(m => {
    const subjTag = (m.subject || '').toLowerCase();
    const curId = selectedSubjId.toLowerCase();
    return subjTag.includes(curId) || curId.includes(subjTag);
  });

  return (
    <div style={{ padding: '8px 0' }}>
      {/* 7 Subjects Tab Bar */}
      <div className="subj-tabs-row" style={{ overflowX: 'auto', paddingBottom: '12px' }}>
        {subjects.map(subj => (
          <button
            key={subj.id}
            className={`subj-tab-btn ${selectedSubjId === subj.id ? 'active' : ''}`}
            onClick={() => setSelectedSubjId(subj.id)}
            style={{ whiteSpace: 'nowrap' }}
          >
            <span>{subj.icon}</span> {subj.name}
          </button>
        ))}
      </div>

      {currentSubj && (
        <div>
          {/* Subject Intro Card */}
          <div style={{
            marginBottom: '24px',
            background: 'white',
            padding: '20px 24px',
            borderRadius: '16px',
            borderLeft: `6px solid ${currentSubj.color}`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#0f172a', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{currentSubj.icon}</span> Môn {currentSubj.name} - SGK Lớp 5 (Năm học 2025-2026)
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px', lineHeight: 1.5 }}>
              {currentSubj.description}
            </p>
          </div>

          {/* Interactive Built-in Games Grid */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎮 Trò Chơi Tương Tác SGK Lớp 5 ({currentSubj.games.length})
            </h4>

            <div className="games-grid">
              {currentSubj.games.map(game => (
                <div key={game.id} className="game-card">
                  <div className="game-thumb-box">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="game-thumb-img"
                      onError={(e) => { e.target.src = '/assets/images/subject_learning_art.jpg'; }}
                    />
                    <span className="game-tag">{currentSubj.name}</span>
                    <span style={{
                      position: 'absolute',
                      top: '12px', right: '12px',
                      background: 'var(--accent-gold)',
                      color: 'var(--primary-green-dark)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '800'
                    }}>
                      {game.level}
                    </span>
                  </div>
                  <div className="game-info">
                    <h4 className="game-title">{game.title}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '16px', flexGrow: 1 }}>
                      {game.desc}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-green-dark)' }}>
                        ❓ {game.questions.length} câu hỏi
                      </span>
                      <button className="btn-play-game" onClick={() => onLaunchGame(game)}>
                        ▶ CHƠI NGAY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Supabase DB Materials & Embedded Games */}
          {matchedDbMaterials.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌐 Học Liệu & Game Nhúng Từ Giáo Viên ({matchedDbMaterials.length})
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {matchedDbMaterials.map(m => (
                  <div key={m.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{
                          background: '#fef3c7',
                          color: '#d97706',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          textTransform: 'uppercase'
                        }}>
                          {m.type === 'game_iframe' ? '🎮 Embed Game' : m.type === 'game_html5' ? '🌐 HTML5 Game' : m.type === 'video' ? '🎥 Video' : '📄 Document'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{m.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>{m.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (m.type === 'game_iframe' || m.type === 'game_html5') {
                          setActiveIframeModal(m);
                        } else if (m.file_url) {
                          window.open(m.file_url, '_blank');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#d97706',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {m.type.includes('game') ? <Gamepad2 size={16} /> : <ExternalLink size={16} />}
                      {m.type.includes('game') ? 'Mở Trò Chơi' : 'Xem Học Liệu'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Embedded Game IFrame Modal */}
      {activeIframeModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '900px',
            height: '80vh',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>🎮 {activeIframeModal.title}</h3>
              <button
                onClick={() => setActiveIframeModal(null)}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕ Đóng
              </button>
            </div>
            <iframe
              src={activeIframeModal.file_url}
              title={activeIframeModal.title}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
