import React from 'react';
import { CLASS_INFO } from '../data/classData';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div>
          <h3 style={{ color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '10px' }}>
            {CLASS_INFO.schoolName} - {CLASS_INFO.className}
          </h3>
          <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Năm học: {CLASS_INFO.academicYear} | GVCN: {CLASS_INFO.teacher}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>📍 Địa chỉ: {CLASS_INFO.address}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>✉️ Email: {CLASS_INFO.email}</p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '12px' }}>Các Môn Học Lớp 5</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>📐 Toán học & Hình học</li>
            <li>📖 Tiếng Việt & Luyện từ</li>
            <li>🔬 Khoa học & Môi trường</li>
            <li>🗺️ Lịch sử và Địa lý</li>
            <li>💻 Công nghệ 5.0</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '12px' }}>Góc Học Sinh</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>🇻🇳 Không gian VH Hồ Chí Minh</li>
            <li>🏆 Bảng Vinh danh Ngôi sao</li>
            <li>👥 Sơ đồ Lớp 5/4</li>
            <li>🤖 Trợ lý AI Hỗ trợ 24/7</li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '30px auto 0', padding: '20px 20px 0', borderTop: '1px solid #334155', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © 2025 - 2026 Website Lớp 5/4 - Trường Tiểu học Lê Văn Tám, TP. Hồ Chí Minh. Built with React & Supabase for Vercel Deployment.
      </div>
    </footer>
  );
}
