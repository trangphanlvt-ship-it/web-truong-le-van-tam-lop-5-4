import React from 'react';
import { CLASS_INFO, CLASS_ACTIVITIES } from '../data/classData';

export default function HeroBanner({ activeUser }) {
  return (
    <div>
      <div className="hero-welcome-card">
        <div>
          <span style={{
            background: 'var(--primary-green-light)',
            color: 'var(--primary-green-dark)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: '800'
          }}>
            Năm học {CLASS_INFO.academicYear}
          </span>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.8rem',
            color: 'var(--primary-green-dark)',
            marginTop: '10px'
          }}>
            Chào mừng các em đến với Không gian Học tập Lớp 5/4!
          </h2>

          <p style={{ color: 'var(--ink-soft)', marginTop: '8px' }}>
            Nơi hội tụ tri thức 7 môn học chuẩn SGK Lớp 5 mới 2025-2026, sân chơi tương tác thông minh, Không gian văn hóa Hồ Chí Minh và Trợ lý AI đồng hành 24/7!
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '16px',
            background: '#f8fafc',
            padding: '12px 16px',
            borderRadius: '12px',
            borderLeft: '4px solid var(--primary-green)'
          }}>
            <div style={{ fontSize: '2rem' }}>👩‍🏫</div>
            <div>
              <div style={{ fontWeight: '800', color: 'var(--primary-green-dark)', fontSize: '1rem' }}>
                GVCN: {CLASS_INFO.teacher}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                {CLASS_INFO.schoolName} - {CLASS_INFO.address}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textContent: 'center' }}>
          <img
            src="assets/images/school_banner.jpg"
            alt="Lớp 5/4 Lê Văn Tám"
            style={{
              width: '100%',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid var(--primary-green-light)'
            }}
          />
        </div>
      </div>

      <div className="quick-stats-grid">
        <div className="stat-card">
          <div className="stat-num">{CLASS_INFO.totalStudents}</div>
          <div className="stat-label">Học sinh Lớp 5/4</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-num">7 Môn</div>
          <div className="stat-label">Chương trình SGK 2025-2026</div>
        </div>
        <div className="stat-card red">
          <div className="stat-num">100+</div>
          <div className="stat-label">Thử thách & Trò chơi</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-num">24/7</div>
          <div className="stat-label">Trợ lý AI Hỗ trợ</div>
        </div>
      </div>

      {activeUser && (
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)',
          borderLeft: '6px solid var(--accent-gold)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2.5rem' }}>🤖</div>
            <div style={{ flexGrow: 1 }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-green-dark)', fontSize: '1.2rem' }}>
                QUY TRÌNH HỌC TẬP CÁ NHÂN HÓA AI - HỌC SINH: {activeUser.name.toUpperCase()}
              </h4>
              <div style={{ marginTop: '6px', fontSize: '0.95rem', color: 'var(--ink-dark)' }}>
                🤖 <strong>Trợ lý AI Lê Văn Tám đồng hành:</strong> Chào em {activeUser.name}! AI đã chuẩn bị các nhiệm vụ rèn luyện thích hợp nhất cho em hôm nay.
              </div>
              <div style={{
                marginTop: '14px',
                background: '#f8fafc',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0'
              }}>
                <strong style={{ color: 'var(--accent-purple)' }}>📌 Nhiệm vụ AI giao riêng cho em hôm nay:</strong>
                <ul style={{ marginTop: '6px', paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  <li>1. Hoàn thành 1 bài trắc nghiệm Toán Hỗn số & Tỉ số phần trăm</li>
                  <li>2. Đọc câu chuyện Bác Hồ tại Không gian Văn hóa Hồ Chí Minh</li>
                  <li>3. Đạt thêm +20 điểm thưởng để vươn lên Bảng Vinh Danh Tuần này</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-green-dark)' }}>
          🎨 HOẠT ĐỘNG NỔI BẬT LỚP 5/4
        </h3>
      </div>

      <div className="games-grid">
        {CLASS_ACTIVITIES.map(act => (
          <div key={act.id} className="game-card">
            <div className="game-thumb-box">
              <img src={act.image} alt={act.title} className="game-thumb-img" />
              <span className="game-tag">{act.date}</span>
            </div>
            <div className="game-info">
              <h4 className="game-title">{act.title}</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
