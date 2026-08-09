import React from 'react';

export default function HonorBoard({ students, activeUser }) {
  const sorted = [...students].sort((a, b) => b.points - a.points);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  return (
    <div>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '30px'
      }}>
        <h3 style={{
          textAlign: 'center',
          fontFamily: 'var(--font-heading)',
          color: 'var(--primary-green-dark)',
          fontSize: '1.6rem',
          marginBottom: '24px'
        }}>
          🏆 BẢNG VINH DANH NGÔI SAO LỚP 5/4 - NĂM HỌC 2025-2026
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '20px', minHeight: '220px' }}>
          {top2 && (
            <div style={{ textAlign: 'center', width: '110px' }}>
              <div style={{ fontSize: '2rem' }}>{top2.avatar}</div>
              <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{top2.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{top2.points} pts</div>
              <div style={{
                height: '90px', background: '#cbd5e1', borderRadius: '12px 12px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem', color: '#475569', marginTop: '10px'
              }}>
                2
              </div>
            </div>
          )}

          {top1 && (
            <div style={{ textAlign: 'center', width: '120px' }}>
              <div style={{ color: '#eab308', fontSize: '1.5rem' }}>👑</div>
              <div style={{ fontSize: '2.5rem' }}>{top1.avatar}</div>
              <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary-green-dark)' }}>{top1.name}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-gold)' }}>{top1.points} pts</div>
              <div style={{
                height: '120px', background: 'linear-gradient(180deg, #fef08a 0%, #eab308 100%)', borderRadius: '12px 12px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '2rem', color: '#854d0e', marginTop: '10px'
              }}>
                1
              </div>
            </div>
          )}

          {top3 && (
            <div style={{ textAlign: 'center', width: '110px' }}>
              <div style={{ fontSize: '2rem' }}>{top3.avatar}</div>
              <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{top3.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{top3.points} pts</div>
              <div style={{
                height: '70px', background: '#fed7aa', borderRadius: '12px 12px 0 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.5rem', color: '#9a3412', marginTop: '10px'
              }}>
                3
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-green-dark)' }}>
          📜 BẢNG XẾP HẠNG CHI TIẾT TẤT CẢ HỌC SINH
        </h3>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Họ và Tên</th>
            <th>Tổ / Nhóm</th>
            <th>Danh hiệu</th>
            <th>Số Ngôi sao ⭐</th>
            <th>Điểm tích lũy</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((st, idx) => (
            <tr
              key={st.id || idx}
              style={activeUser && activeUser.id === st.id ? { background: '#f0fdf4', fontWeight: 'bold' } : {}}
            >
              <td><strong>#{idx + 1}</strong></td>
              <td>{st.avatar} {st.name}</td>
              <td>{st.group}</td>
              <td>
                <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700' }}>
                  {st.badge}
                </span>
              </td>
              <td>⭐ {st.stars}</td>
              <td style={{ color: 'var(--primary-green-dark)', fontWeight: '800' }}>{st.points} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
