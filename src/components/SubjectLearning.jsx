import React, { useState } from 'react';

export default function SubjectLearning({ subjects, onLaunchGame }) {
  const [selectedSubjId, setSelectedSubjId] = useState(subjects[0]?.id || 'toan');
  const currentSubj = subjects.find(s => s.id === selectedSubjId) || subjects[0];

  return (
    <div>
      <div className="subj-tabs-row">
        {subjects.map(subj => (
          <button
            key={subj.id}
            className={`subj-tab-btn ${selectedSubjId === subj.id ? 'active' : ''}`}
            onClick={() => setSelectedSubjId(subj.id)}
          >
            <span>{subj.icon}</span> {subj.name}
          </button>
        ))}
      </div>

      {currentSubj && (
        <div>
          <div style={{
            marginBottom: '20px',
            background: 'white',
            padding: '18px 24px',
            borderRadius: 'var(--radius-md)',
            borderLeft: `5px solid ${currentSubj.color}`,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink-dark)', fontSize: '1.4rem' }}>
              {currentSubj.icon} Môn {currentSubj.name} - SGK Lớp 5 (2025-2026)
            </h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', marginTop: '4px' }}>
              {currentSubj.description}
            </p>
          </div>

          <div className="games-grid">
            {currentSubj.games.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-thumb-box">
                  <img src={game.image} alt={game.title} className="game-thumb-img" />
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
      )}
    </div>
  );
}
