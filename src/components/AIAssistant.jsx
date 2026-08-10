import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Bot, Send, RefreshCw, CheckCircle, BookOpen } from 'lucide-react';

export default function AIAssistant() {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'recommendations'
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `🤖 Chào ${profile?.full_name || 'em'}! Tớ là <strong>Trợ lý AI Lớp 5/4 Trường TH Lê Văn Tám</strong>. Em cần hỗ trợ bài tập môn Toán, Tiếng Việt, Khoa học, Lịch sử - Địa lý, Công nghệ hay Đạo đức nào không?`
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  function handleSend() {
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    setTimeout(() => {
      const qLower = userText.toLowerCase();
      let botAnswer = `🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Chào ${profile?.full_name || 'em'}! Rất vui được hỗ trợ em. Em có thắc mắc gì về 7 môn học SGK Lớp 5 không?`;

      if (qLower.includes("toán") || qLower.includes("hỗn số") || qLower.includes("tỉ số") || qLower.includes("phần trăm") || qLower.includes("diện tích")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám (Toán):</strong> Đổi hỗn số ra phân số = (Phần nguyên × Mẫu số + Tử số) / Mẫu số. Tính Tỉ số phần trăm của A và B = (A ÷ B) × 100%. Diện tích tam giác = (Đáy × Chiều cao) ÷ 2!";
      } else if (qLower.includes("tiếng việt") || qLower.includes("so sánh") || qLower.includes("đồng nghĩa")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám (Tiếng Việt):</strong> Biện pháp So sánh sử dụng các từ nối như 'như', 'tựa như'. Các cặp quan hệ từ thông dụng: Tuy... nhưng... (biểu thị sự tương phản), Vì... nên... (nguyên nhân - kết quả).";
      } else if (qLower.includes("khoa học") || qLower.includes("năng lượng") || qLower.includes("hóa học")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám (Khoa học):</strong> Năng lượng mặt trời là năng lượng tái tạo sạch. Sự biến đổi hóa học tạo ra chất mới hoàn toàn (như đốt cháy giấy thành tro)!";
      } else if (qLower.includes("lịch sử") || qLower.includes("địa lý") || qLower.includes("tp.hcm")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám (Lịch sử & Địa lý):</strong> Bác Hồ đọc Bản Tuyên ngôn Độc lập ngày 2/9/1945 tại Ba Đình. TP. Hồ Chí Minh là trung tâm kinh tế - văn hóa lớn nhất vùng Đông Nam Bộ!";
      } else if (qLower.includes("bác hồ") || qLower.includes("văn hóa")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> 5 điều Bác Hồ dạy dành cho thiếu niên nhi đồng: 1. Yêu tổ quốc, yêu đồng bào. 2. Học tập tốt, lao động tốt. 3. Đoàn kết tốt, kỷ luật tốt. 4. Giữ gìn vệ sinh thật tốt. 5. Khiêm tốn, thật thà, dũng cảm!";
      } else if (qLower.includes("cô trang") || qLower.includes("5/4") || qLower.includes("lớp")) {
        botAnswer = "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Lớp 5/4 Trường TH Lê Văn Tám năm học 2025-2026 do cô PHAN THỊ DIỄM TRANG làm GVCN tại địa chỉ S15 đường Tân Phú, P. Tân Mỹ, TP.HCM!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
    }, 500);
  }

  // Dynamic AI Learning Task Recommendations tailored for individual student profile
  const aiRecommendations = [
    {
      id: 1,
      subject: '📐 TOÁN HỌC (SGK Lớp 5)',
      title: 'Luyện tập Hỗn số & Tỉ số phần trăm',
      reason: 'Dựa trên kết quả bài trước, AI nhận thấy em cần củng cố cách tính tỉ số phần trăm và thể tích hình khối.',
      task: 'Hoàn thành 3 câu đố Toán học mức độ Nâng cao',
      reward: '+30 Điểm 🌟'
    },
    {
      id: 2,
      subject: '📖 TIẾNG VIỆT (SGK Lớp 5)',
      title: 'Hành trình Từ đồng nghĩa & Biện pháp so sánh',
      reason: 'AI gợi ý rèn luyện kĩ năng Luyện từ và câu để nâng cao vốn từ cho bài tập làm văn.',
      task: 'Thực hành phân biệt quan hệ từ trong trò chơi Tiếng Việt',
      reward: '+20 Điểm 🌟'
    },
    {
      id: 3,
      subject: '🇻🇳 KHÔNG GIAN VH HỒ CHÍ MINH',
      title: 'Học tập 5 Điều Bác Hồ Dạy',
      reason: 'Hoàn thành nhiệm vụ văn hóa để tích lũy huy hiệu Bông hoa Điểm 10 Lớp 5/4.',
      task: 'Đọc câu chuyện Bác Hồ và thực hiện 1 việc tốt trong tuần',
      reward: '+25 Điểm 🌟'
    }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
          color: 'white',
          border: '3px solid white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(217, 119, 6, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease'
        }}
        title="Trợ lý AI & Gợi ý nhiệm vụ học tập"
      >
        🤖
      </button>

      {/* Main AI Drawer / Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '75px',
          right: '0',
          width: '380px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.95rem' }}>
              <span>🤖</span> TRỢ LÝ AI LÊ VĂN TÁM
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontWeight: '700' }}
            >
              ✕
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === 'chat' ? 'white' : 'transparent',
                color: activeTab === 'chat' ? '#d97706' : '#64748b',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'chat' ? '2px solid #d97706' : 'none'
              }}
            >
              💬 Hỏi Đáp AI
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === 'recommendations' ? 'white' : 'transparent',
                color: activeTab === 'recommendations' ? '#d97706' : '#64748b',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                borderBottom: activeTab === 'recommendations' ? '2px solid #d97706' : 'none'
              }}
            >
              ✨ AI Gợi Ý Nhiệm Vụ
            </button>
          </div>

          {/* TAB 1: CHAT INTERFACE */}
          {activeTab === 'chat' && (
            <>
              <div style={{ height: '300px', padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      background: m.sender === 'user' ? '#0d8a52' : 'white',
                      color: m.sender === 'user' ? 'white' : '#0f172a',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      maxWidth: '88%',
                      fontSize: '0.88rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                      lineHeight: 1.4
                    }}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '10px', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', background: 'white' }}>
                <input
                  type="text"
                  placeholder="Hỏi AI bài tập Toán, Tiếng Việt..."
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '0.88rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1'
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    padding: '8px 14px',
                    background: '#d97706',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}

          {/* TAB 2: AI RECOMMENDATIONS ENGINE */}
          {activeTab === 'recommendations' && (
            <div style={{ height: '350px', padding: '14px', overflowY: 'auto', background: '#f8fafc' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px', fontSize: '0.8rem', color: '#92400e', marginBottom: '12px' }}>
                🎯 <strong>Phân tích AI theo thời gian thực:</strong> Dựa vào lịch sử học tập của em <strong>{profile?.full_name || 'Học sinh'}</strong>, AI đề xuất các nhiệm vụ luyện tập cá nhân hóa sau:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {aiRecommendations.map(rec => (
                  <div key={rec.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    borderLeft: '4px solid #d97706',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderTop: '1px solid #f1f5f9',
                    borderRight: '1px solid #f1f5f9',
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#d97706', textTransform: 'uppercase' }}>
                      {rec.subject}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                      {rec.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                      💡 {rec.reason}
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#16a34a' }}>
                        {rec.reward}
                      </span>
                      <button style={{
                        padding: '4px 10px',
                        background: '#0d8a52',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}>
                        Làm Ngay ▶
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
