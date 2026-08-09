import React, { useState } from 'react';
import { insertQuestionToSupabase } from '../lib/supabase';

export default function QuestionBuilder({ subjects, onAddQuestion }) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'toan');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [answerIdx, setAnswerIdx] = useState(0);
  const [hintText, setHintText] = useState('');
  const [msg, setMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setMsg({ type: 'error', text: 'Vui lòng điền đầy đủ câu hỏi và 4 phương án!' });
      return;
    }

    const newQ = {
      subjectId,
      q: questionText.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      answer: parseInt(answerIdx),
      hint: hintText.trim() || 'Hãy suy nghĩ kỹ kiến thức đã học trong SGK Lớp 5.'
    };

    onAddQuestion(newQ);
    await insertQuestionToSupabase(newQ);

    setMsg({ type: 'success', text: '✅ Đã thêm câu hỏi mới thành công và lưu vào Supabase DB!' });
    setQuestionText('');
    setOptA(''); setOptB(''); setOptC(''); setOptD('');
    setHintText('');
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--primary-green-dark)', marginBottom: '10px' }}>
        ✏️ TẠO CÂU HỎI TRẮC NGHIỆM MỚI (DÀNH CHO GIÁO VIÊN)
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', marginBottom: '20px' }}>
        Thêm câu hỏi trắc nghiệm chuẩn SGK Lớp 5 mới. Dữ liệu sẽ tự động lưu và đồng bộ lên <strong>Supabase Database</strong>.
      </p>

      {msg && (
        <div className={`auth-feedback-msg ${msg.type === 'error' ? 'error' : 'success'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Chọn Môn học SGK Lớp 5:</label>
          <select className="form-select" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Nội dung Câu hỏi:</label>
          <textarea
            className="form-input"
            rows="3"
            placeholder="Nhập câu hỏi trắc nghiệm ở đây..."
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Phương án A:</label>
            <input type="text" className="form-input" placeholder="Phương án A" value={optA} onChange={e => setOptA(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phương án B:</label>
            <input type="text" className="form-input" placeholder="Phương án B" value={optB} onChange={e => setOptB(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phương án C:</label>
            <input type="text" className="form-input" placeholder="Phương án C" value={optC} onChange={e => setOptC(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phương án D:</label>
            <input type="text" className="form-input" placeholder="Phương án D" value={optD} onChange={e => setOptD(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phương án Đáp án Đúng:</label>
          <select className="form-select" value={answerIdx} onChange={e => setAnswerIdx(e.target.value)}>
            <option value="0">Phương án A</option>
            <option value="1">Phương án B</option>
            <option value="2">Phương án C</option>
            <option value="3">Phương án D</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Gợi ý của Trợ lý AI (Hint):</label>
          <input type="text" className="form-input" placeholder="Gợi ý hướng dẫn làm bài..." value={hintText} onChange={e => setHintText(e.target.value)} />
        </div>

        <button type="submit" className="btn-play-game" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
          💾 LƯU CÂU HỎI VÀO SUPABASE DB
        </button>
      </form>
    </div>
  );
}
