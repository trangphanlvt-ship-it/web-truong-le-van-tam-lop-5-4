import React, { useState } from 'react';

export default function QuizModal({ game, onClose, activeUser, onCompleteGame }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!game) return null;

  const currentQ = game.questions[qIndex];
  const progressPct = ((qIndex + 1) / game.questions.length) * 100;
  const maxScore = game.questions.length * 10;
  const starsEarned = Math.round(score / 10);

  function handleSelectAnswer(idx) {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setFeedback({
        type: 'correct',
        msg: '🎉 Chính xác xuất sắc! Em nhận được +10 điểm và 1 ⭐!'
      });
    } else {
      setFeedback({
        type: 'wrong',
        msg: `❌ Chưa chính xác! Gợi ý AI: ${currentQ.hint}`
      });
    }

    setTimeout(() => {
      setSelectedOpt(null);
      setFeedback(null);
      if (qIndex + 1 < game.questions.length) {
        setQIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
        const finalScore = isCorrect ? score + 10 : score;
        const finalStars = Math.round(finalScore / 10);
        onCompleteGame(finalScore, finalStars);
      }
    }, 2200);
  }

  function handleAskAI() {
    alert(`🤖 TRỢ LÝ AI "LÊ VĂN TÁM":\n\n${currentQ.hint}`);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--primary-green-dark)' }}>
            {game.title}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: '12px' }}>
              <span>Câu {qIndex + 1} / {game.questions.length}</span>
              <span>Điểm hiện tại: <strong style={{ color: 'var(--accent-gold)' }}>{score}</strong></span>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', fontWeight: '700' }}>
              {currentQ.q}
            </div>

            <div>
              {currentQ.options.map((opt, i) => {
                let btnClass = 'quiz-option-btn';
                if (selectedOpt !== null) {
                  if (i === currentQ.answer) btnClass += ' correct';
                  else if (i === selectedOpt) btnClass += ' wrong';
                }

                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => handleSelectAnswer(i)}
                    disabled={selectedOpt !== null}
                  >
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800'
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAskAI}
              style={{
                background: 'var(--accent-gold-light)', color: '#854d0e', border: '1px solid var(--accent-gold)',
                padding: '8px 16px', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px'
              }}
            >
              🤖 Trợ lý AI gợi ý
            </button>

            {feedback && (
              <div className={`auth-feedback-msg ${feedback.type === 'correct' ? 'success' : 'error'}`} style={{ marginTop: '16px' }}>
                {feedback.msg}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textContent: 'center', textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🏆</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--primary-green-dark)' }}>
              Hoàn Thành Bài Tập!
            </h3>
            <p style={{ fontSize: '1.1rem', marginTop: '8px' }}>
              Em đã đạt được <strong style={{ color: 'var(--accent-gold)', fontSize: '1.4rem' }}>{score} / {maxScore} điểm</strong>!
            </p>
            <div style={{ fontSize: '2rem', margin: '15px 0' }}>
              {'⭐'.repeat(starsEarned)}
            </div>

            {activeUser ? (
              <div style={{ background: '#f0fdf4', border: '1px solid var(--primary-green-light)', padding: '14px', borderRadius: '12px', color: 'var(--primary-green-dark)', margin: '20px 0', fontWeight: '600' }}>
                ✨ Đã tự động đồng bộ thành tích vào tài khoản <strong>{activeUser.name}</strong> trên Supabase DB!
              </div>
            ) : (
              <div style={{ background: '#fefce8', border: '1px solid var(--accent-gold)', padding: '14px', borderRadius: '12px', color: '#854d0e', margin: '20px 0', fontSize: '0.9rem' }}>
                💡 Đăng nhập tài khoản cá nhân để tích lũy điểm thưởng và vinh danh trên Bảng xếp hạng Lớp 5/4!
              </div>
            )}

            <button className="btn-play-game" onClick={onClose} style={{ margin: '0 auto', padding: '12px 30px' }}>
              ✔ ĐÓNG VÀ TRỞ VỀ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
