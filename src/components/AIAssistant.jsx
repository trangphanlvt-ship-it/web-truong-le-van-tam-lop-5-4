import React, { useState, useRef, useEffect } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🤖 Chào em! Tớ là <strong>Trợ lý AI Lớp 5/4</strong>. Em cần hỗ trợ bài tập môn Toán, Tiếng Việt, Khoa học hay Lịch sử - Địa lý nào không?' }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      const qLower = userText.toLowerCase();
      let botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Chào em! Rất vui được hỗ trợ em học tập. Em có câu hỏi gì về các môn học Toán, Tiếng Việt, Khoa học hay Lịch sử không?";

      if (qLower.includes("toán") || qLower.includes("hỗn số") || qLower.includes("tỉ số")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Trong chương trình Toán lớp 5, để đổi hỗn số ra phân số em lấy Phần nguyên × Mẫu số + Tử số. Còn tính Tỉ số phần trăm của A và B em lấy (A : B) × 100!";
      } else if (qLower.includes("bác hồ") || qLower.includes("văn hóa")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Bác Hồ dành tình yêu thương bao la cho thiếu nhi! 5 điều Bác Hồ dạy là kim chỉ nam giúp các em rèn luyện thành con ngoan trò giỏi!";
      } else if (qLower.includes("lớp 5/4") || qLower.includes("cô trang")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Lớp 5/4 Trường TH Lê Văn Tám năm học 2025-2026 do cô PHAN THỊ DIỄM TRANG làm GVCN. Lớp có 35 bạn học sinh rất chăm ngoan!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
    }, 600);
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold) 0%, #d97706 100%)',
          color: 'white', border: 'none', fontSize: '1.8rem', cursor: 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        🤖
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '75px', right: '0', width: '350px', background: 'white',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid #cbd5e1', overflow: 'hidden'
        }}>
          <div style={{ background: 'var(--primary-green-dark)', color: 'white', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>🤖 LÊ VĂN TÁM AI</div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ height: '280px', padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? 'var(--primary-green)' : 'white',
                  color: m.sender === 'user' ? 'white' : 'var(--ink-dark)',
                  padding: '10px 14px', borderRadius: '14px', maxWidth: '85%', fontSize: '0.88rem',
                  boxShadow: 'var(--shadow-sm)', border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0'
                }}
                dangerouslySetInnerHTML={{ __html: m.text }}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '10px', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Hỏi AI bài tập..."
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ padding: '8px 12px', fontSize: '0.88rem' }}
            />
            <button className="btn-play-game" onClick={handleSend} style={{ padding: '8px 14px' }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
