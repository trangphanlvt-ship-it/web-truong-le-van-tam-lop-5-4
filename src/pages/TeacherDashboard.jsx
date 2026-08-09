import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClasses, createClass, getMaterials, createMaterial, createAssignment, getClassMembers } from '../lib/supabase';
import ClassCard from '../components/ClassCard';
import MaterialCard from '../components/MaterialCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { PlusCircle, School, BookOpen, Send, Users, FileText, Gamepad2, Video, Globe } from 'lucide-react';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes'); // 'classes' | 'materials' | 'assign'

  // Form states for creating class
  const [className, setClassName] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Form states for creating material
  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matType, setMatType] = useState('document');
  const [matPublic, setMatPublic] = useState(true);
  const [isCreatingMat, setIsCreatingMat] = useState(false);

  // Form states for assigning
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedMatId, setSelectedMatId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Roster View Modal
  const [selectedClassForRoster, setSelectedClassForRoster] = useState(null);
  const [rosterMembers, setRosterMembers] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const [feedback, setFeedback] = useState(null);

  async function loadTeacherData() {
    setLoading(true);
    try {
      const [cData, mData] = await Promise.all([
        getClasses(),
        getMaterials()
      ]);
      setClasses(cData || []);
      setMaterials(mData || []);
    } catch (err) {
      console.error('Error loading teacher data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeacherData();
  }, []);

  function generateClassCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'LVT';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async function handleCreateClass(e) {
    e.preventDefault();
    setFeedback(null);
    try {
      const code = generateClassCode();
      const newClass = await createClass({
        name: className,
        description: classDesc,
        code,
        teacherId: profile.id
      });

      setClasses(prev => [newClass, ...prev]);
      setClassName('');
      setClassDesc('');
      setIsCreatingClass(false);
      setFeedback({ type: 'success', text: `Tạo lớp "${newClass.name}" thành công với Mã Lớp: ${newClass.code}` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi khi tạo lớp học' });
    }
  }

  async function handleCreateMaterial(e) {
    e.preventDefault();
    setFeedback(null);
    try {
      const newMat = await createMaterial({
        title: matTitle,
        description: matDesc,
        fileUrl: matUrl,
        type: matType,
        authorId: profile.id,
        isPublic: matPublic
      });

      setMaterials(prev => [newMat, ...prev]);
      setMatTitle('');
      setMatDesc('');
      setMatUrl('');
      setIsCreatingMat(false);
      setFeedback({ type: 'success', text: `Đã thêm tài liệu / trò chơi "${newMat.title}" thành công!` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi khi thêm bài học' });
    }
  }

  async function handleCreateAssignment(e) {
    e.preventDefault();
    if (!selectedClassId || !selectedMatId) {
      setFeedback({ type: 'error', text: 'Vui lòng chọn Lớp học và Bài học để giao!' });
      return;
    }

    try {
      await createAssignment({
        classId: selectedClassId,
        materialId: selectedMatId,
        dueDate: dueDate || null
      });

      setFeedback({ type: 'success', text: 'Đã giao bài học tới lớp học thành công!' });
      setSelectedClassId('');
      setSelectedMatId('');
      setDueDate('');
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi khi giao bài học' });
    }
  }

  async function handleViewRoster(cls) {
    setSelectedClassForRoster(cls);
    setLoadingRoster(true);
    try {
      const members = await getClassMembers(cls.id);
      setRosterMembers(members);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoster(false);
    }
  }

  if (loading) {
    return <LoadingState message="Đang tải danh sách Lớp học và Học liệu từ Supabase DB..." />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Teacher Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
          👩‍🏫 Góc Giáo Viên / Quản Lý Bài Học Lớp 5/4
        </h1>
        <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>
          Tạo lớp học, đăng tải tài liệu / trò chơi (IFrame, HTML5, Video) và giao bài cho học sinh.
        </p>
      </div>

      {feedback && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          backgroundColor: feedback.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: feedback.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${feedback.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {feedback.text}
        </div>
      )}

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', pb: '12px' }}>
        <button
          onClick={() => setActiveTab('classes')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'classes' ? '3px solid #d97706' : '3px solid transparent',
            background: 'transparent',
            fontWeight: '700',
            cursor: 'pointer',
            color: activeTab === 'classes' ? '#d97706' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <School size={18} /> Danh Sách Lớp Học ({classes.length})
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'materials' ? '3px solid #d97706' : '3px solid transparent',
            background: 'transparent',
            fontWeight: '700',
            cursor: 'pointer',
            color: activeTab === 'materials' ? '#d97706' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <BookOpen size={18} /> Kho Học Liệu & Trò Chơi ({materials.length})
        </button>

        <button
          onClick={() => setActiveTab('assign')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'assign' ? '3px solid #d97706' : '3px solid transparent',
            background: 'transparent',
            fontWeight: '700',
            cursor: 'pointer',
            color: activeTab === 'assign' ? '#d97706' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Send size={18} /> Giao Bài Cho Học Sinh
        </button>
      </div>

      {/* TAB 1: CLASSES */}
      {activeTab === 'classes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Các Lớp Học Thuộc Quản Lý</h2>
            <button
              onClick={() => setIsCreatingClass(!isCreatingClass)}
              style={{
                padding: '10px 18px',
                background: '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PlusCircle size={18} /> {isCreatingClass ? 'Hủy Bỏ' : 'Tạo Lớp Học Mới'}
            </button>
          </div>

          {/* Form Create Class */}
          {isCreatingClass && (
            <form onSubmit={handleCreateClass} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #cbd5e1',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Tạo Lớp Học Mới</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Tên Lớp Học</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lớp 5/4 - TH Lê Văn Tám"
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Mô Tả Lớp Học</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nơi học sinh thực hành Toán, Tiếng Việt và chơi STEM"
                    value={classDesc}
                    onChange={e => setClassDesc(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
              <button type="submit" style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                Lưu Lớp Học (Tự Động Tạo Mã Lớp)
              </button>
            </form>
          )}

          {classes.length === 0 ? (
            <EmptyState
              title="Chưa có lớp học nào"
              description="Bạn chưa tạo lớp học nào trong bảng `classes`. Hãy nhấn vào nút 'Tạo Lớp Học Mới' ở trên để khởi tạo lớp học đầu tiên!"
              actionLabel="Tạo Lớp Học Mới"
              onAction={() => setIsCreatingClass(true)}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {classes.map(c => (
                <ClassCard
                  key={c.id}
                  classData={c}
                  onViewMembers={cls => handleViewRoster(cls)}
                  onAssignMaterial={() => { setSelectedClassId(c.id); setActiveTab('assign'); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MATERIALS */}
      {activeTab === 'materials' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Kho Bài Học, Document, Video & Trò Chơi</h2>
            <button
              onClick={() => setIsCreatingMat(!isCreatingMat)}
              style={{
                padding: '10px 18px',
                background: '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PlusCircle size={18} /> {isCreatingMat ? 'Hủy Bỏ' : 'Thêm Bài Học Mới'}
            </button>
          </div>

          {/* Form Create Material */}
          {isCreatingMat && (
            <form onSubmit={handleCreateMaterial} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #cbd5e1',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Thêm Bài Học / Trò Chơi Mới</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Tiêu Đề Bài Học</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Ôn tập Hình học & Trò chơi Đố vui Lớp 5"
                    value={matTitle}
                    onChange={e => setMatTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Loại Học Liệu (`type` enum)</label>
                  <select
                    value={matType}
                    onChange={e => setMatType(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
                  >
                    <option value="document">📄 Document (Tài liệu PDF / Word)</option>
                    <option value="video">🎥 Video (Bài giảng YouTube / Mp4)</option>
                    <option value="game_iframe">🎮 Game IFrame (Nhúng trò chơi)</option>
                    <option value="game_html5">🌐 Game HTML5 (Trò chơi tương tác)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Đường Dẫn File URL / Video Link / Iframe Source</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/game-iframe hoặc https://youtube.com/watch?v=..."
                  value={matUrl}
                  onChange={e => setMatUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>Mô Tả Bài Học</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả nội dung bài học..."
                  value={matDesc}
                  onChange={e => setMatDesc(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <button type="submit" style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                Đăng Bài Học Lên Supabase DB
              </button>
            </form>
          )}

          {materials.length === 0 ? (
            <EmptyState
              title="Chưa có học liệu nào"
              description="Bảng `materials` trong Supabase chưa có bài học nào. Hãy đăng tải bài học hoặc trò chơi đầu tiên!"
              actionLabel="Thêm Bài Học Mới"
              onAction={() => setIsCreatingMat(true)}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {materials.map(m => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  onAssign={mat => { setSelectedMatId(mat.id); setActiveTab('assign'); }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ASSIGN */}
      {activeTab === 'assign' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '28px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px' }}>Giao Bài Học Cho Lớp Học</h2>
          <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Chọn Lớp Học</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }}
              >
                <option value="">-- Chọn lớp học --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Mã: {c.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Chọn Bài Học / Trò Chơi</label>
              <select
                value={selectedMatId}
                onChange={e => setSelectedMatId(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }}
              >
                <option value="">-- Chọn bài học --</option>
                {materials.map(m => (
                  <option key={m.id} value={m.id}>{m.title} ({m.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '6px' }}>Hạn Nộp Bài (Tùy chọn)</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              🚀 Xác Nhận Giao Bài Học
            </button>
          </form>
        </div>
      )}

      {/* Roster Modal */}
      {selectedClassForRoster && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                Danh Sách Học Sinh: {selectedClassForRoster.name}
              </h3>
              <button
                onClick={() => setSelectedClassForRoster(null)}
                style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕ Đóng
              </button>
            </div>

            {loadingRoster ? (
              <LoadingState message="Đang tải danh sách học sinh từ class_members..." />
            ) : rosterMembers.length === 0 ? (
              <EmptyState
                title="Chưa có học sinh tham gia"
                description={`Lớp học có mã ${selectedClassForRoster.code} chưa có học sinh nào tham gia.`}
              />
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px' }}>Họ & Tên</th>
                      <th style={{ padding: '10px' }}>Email</th>
                      <th style={{ padding: '10px' }}>Ngày Tham Gia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rosterMembers.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px', fontWeight: '600' }}>{m.student?.full_name || 'Học sinh'}</td>
                        <td style={{ padding: '10px', color: '#64748b' }}>{m.student?.email}</td>
                        <td style={{ padding: '10px', color: '#94a3b8', fontSize: '0.8rem' }}>
                          {new Date(m.joined_at).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
