import React from 'react';
import { HCM_SPACE_DATA } from '../data/classData';

export default function HCMCulturalSpace() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '30px',
        alignItems: 'center',
        marginBottom: '30px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <span style={{
            background: 'var(--accent-gold)',
            color: '#7f1d1d',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            textTransform: 'uppercase'
          }}>
            Không Gian Văn Hóa Hồ Chí Minh
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginTop: '10px' }}>
            {HCM_SPACE_DATA.title}
          </h2>
          <p style={{ opacity: 0.95, fontSize: '0.98rem', marginTop: '8px', lineHeight: '1.6' }}>
            {HCM_SPACE_DATA.intro}
          </p>
        </div>
        <div>
          <img
            src="assets/images/ho_chi_minh_art.jpg"
            alt="Bác Hồ Với Thiếu Nhi"
            style={{ width: '100%', borderRadius: '16px', border: '3px solid var(--accent-gold)' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-green-dark)' }}>
          ⭐ 5 ĐIỀU BÁC HỒ DẠY THIẾU NIÊN, NHI ĐỒNG
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        {HCM_SPACE_DATA.rules5.map(rule => (
          <div key={rule.num} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '5px solid var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2',
              color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '1.2rem'
            }}>
              {rule.num}
            </div>
            <div style={{ fontWeight: '700', color: 'var(--ink-dark)' }}>
              {rule.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-green-dark)' }}>
          📖 CÂU CHUYỆN VỀ BÁC HỒ VỚI THIẾU NHI
        </h3>
      </div>

      <div className="games-grid">
        {HCM_SPACE_DATA.stories.map((st, i) => (
          <div key={i} className="game-card">
            <div className="game-thumb-box">
              <img src={st.image} alt={st.title} className="game-thumb-img" />
              <span className="game-tag">Tư tưởng Bác Hồ</span>
            </div>
            <div className="game-info">
              <h4 className="game-title">{st.title}</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>{st.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
