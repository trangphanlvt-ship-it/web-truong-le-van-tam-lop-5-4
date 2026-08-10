import React, { useState, useEffect } from 'react';
import { getAnnouncements } from '../lib/supabase';
import { Bell, Calendar, UserCheck, BookOpen, MessageSquare, AlertCircle } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: '📢 Nhắc nhở Chuẩn bị Hội thao STEM & Robotics Lớp 5/4',
      content: 'Các em học sinh Lớp 5/4 nhớ mang theo dụng cụ học tập môn Công nghệ và sản phẩm nhóm để hoàn thiện dự án xe tự hành STEM trước Thứ Sáu tuần này nhé! Cô đã chuẩn bị sân đua mô hình tại lớp.',
      created_at: new Date().toISOString(),
      teacher: 'Cô PHAN THỊ DIỄM TRANG'
    },
    {
      id: 2,
      title: '📚 Dặn dò ôn tập môn Toán Hỗn Số & Tỉ Số Phần Trăm',
      content: 'Cô đã giao 2 bài trắc nghiệm tương tác mới trên hệ thống. Các em truy cập vào mục "Bài Học Học Sinh" hoặc bấm vào danh mục Toán Học để hoàn thành và tích lũy điểm sao đổi quà tuần tới!',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      teacher: 'Cô PHAN THỊ DIỄM TRANG'
    },
    {
      id: 3,
      title: '🇻🇳 Đọc bài báo về Bác Hồ tại Không gian Văn hóa Hồ Chí Minh',
      content: 'Nhiệm vụ tuần này: Các bạn tìm đọc 5 Điều Bác Hồ Dạy và 1 câu chuyện trong Không gian Văn hóa Hồ Chí Minh của lớp để chuẩn bị cho buổi sinh hoạt Sao Nhi Đồng đầu tuần sau.',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      teacher: 'Cô PHAN THỊ DIỄM TRANG'
    }
  ]);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const sbData = await getAnnouncements();
        if (sbData && sbData.length > 0) {
          setAnnouncements(sbData);
        }
      } catch (err) {
        console.warn('Announcements note:', err.message);
      }
    }
    loadAnnouncements();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            <Bell size={16} /> Thông Báo & Bài Tập Về Nhà
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            📢 DẶN DÒ CÔ DIỄM TRANG - LỚP 5/4
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>
            Cập nhật dặn dò học tập, lịch kiểm tra và thông báo phong trào lớp 5/4 năm học 2025-2026.
          </p>
        </div>

        <div style={{ fontSize: '3rem' }}>
          👩‍🏫 📌
        </div>
      </div>

      {/* Announcements Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {announcements.map(ann => (
          <div
            key={ann.id}
            style={{
              background: 'white',
              borderRadius: '18px',
              padding: '24px',
              borderLeft: '6px solid #d97706',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              borderTop: '1px solid #f1f5f9',
              borderRight: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                {ann.title}
              </h3>
              <span style={{
                background: '#f8fafc',
                color: '#64748b',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Calendar size={13} /> {new Date(ann.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {ann.content}
            </p>

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#d97706', fontWeight: '700' }}>
              <UserCheck size={16} /> GVCN: PHAN THỊ DIỄM TRANG (Trường TH Lê Văn Tám)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
