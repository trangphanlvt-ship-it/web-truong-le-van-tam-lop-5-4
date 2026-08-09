import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClasses, joinClassByCode, getAssignments, getStudentProgress, upsertStudentProgress } from '../lib/supabase';
import ClassCard from '../components/ClassCard';
import AssignmentCard from '../components/AssignmentCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { GraduationCap, Key, BookOpen, Award, CheckCircle2, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join class input
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const [feedback, setFeedback] = useState(null);

  async function loadStudentData() {
    setLoading(true);
    try {
      const [cData, aData, pData] = await Promise.all([
        getClasses(),
        getAssignments(),
        getStudentProgress(profile.id)
      ]);
      setClasses(cData || []);
      setAssignments(aData || []);
      setProgressList(pData || []);
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile?.id) {
      loadStudentData();
    }
  }, [profile?.id]);

  async function handleJoinClass(e) {
    e.preventDefault();
    setFeedback(null);
    if (!joinCode.trim()) return;

    setIsJoining(true);
    try {
      const res = await joinClassByCode(joinCode, profile.id);
      setFeedback({ type: 'success', text: `Chúc mừng! Bạn đã tham gia thành công vào lớp "${res.className}"` });
      setJoinCode('');
      await loadStudentData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi khi tham gia lớp học' });
    } finally {
      setIsJoining(false);
    }
  }

  async function handleSubmitProgress(assignment, status, score) {
    try {
      const updated = await upsertStudentProgress({
        assignmentId: assignment.id,
        studentId: profile.id,
        status: status,
        score: score
      });

      setProgressList(prev => {
        const idx = prev.findIndex(p => p.assignment_id === assignment.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [...prev, updated];
      });

      setFeedback({ type: 'success', text: `Đã hoàn thành bài học và ghi nhận ${score} điểm!` });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi khi ghi nhận kết quả' });
    }
  }

  if (loading) {
    return <LoadingState message="Đang tải Lớp học & Bài tập của bạn từ Supabase DB..." />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Student Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
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
            <GraduationCap size={16} /> Góc Học Sinh Lớp 5/4
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Xin chào, {profile?.full_name || 'Học sinh'}! 🎒
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Tham gia lớp học bằng Mã Lớp, xem tài liệu bài giảng và làm bài tập tương tác.
          </p>
        </div>

        {/* Join Class Form Pill */}
        <form onSubmit={handleJoinClass} style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '6px',
          borderRadius: '14px',
          backdropFilter: 'blur(8px)'
        }}>
          <input
            type="text"
            required
            placeholder="Nhập mã lớp (VD: LVT54A)"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              width: '200px'
            }}
          />
          <button
            type="submit"
            disabled={isJoining}
            style={{
              padding: '10px 18px',
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: isJoining ? 'wait' : 'pointer'
            }}
          >
            {isJoining ? 'Đang vào...' : 'Tham Gia Lớp'}
          </button>
        </form>
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

      {/* SECTION 1: JOINED CLASSES */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          🏫 Các Lớp Học Đã Tham Gia (`classes` & `class_members`)
        </h2>

        {classes.length === 0 ? (
          <EmptyState
            title="Bạn chưa tham gia lớp học nào"
            description="Hãy nhập Mã Lớp do giáo viên cung cấp vào ô phía trên để tham gia lớp học và nhận bài tập!"
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {classes.map(c => (
              <ClassCard key={c.id} classData={c} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: ASSIGNMENTS & PROGRESS */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
          📝 Bài Tập & Học Liệu Cần Hoàn Thành (`assignments` & `student_progress`)
        </h2>

        {assignments.length === 0 ? (
          <EmptyState
            title="Chưa có bài tập nào được giao"
            description="Giáo viên chưa giao bài tập nào trong các lớp học của bạn. Khi có bài mới, chúng sẽ xuất hiện ở đây!"
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {assignments.map(a => {
              const prog = progressList.find(p => p.assignment_id === a.id);
              return (
                <AssignmentCard
                  key={a.id}
                  assignment={a}
                  progress={prog}
                  onSubmitProgress={handleSubmitProgress}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
