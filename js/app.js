/* ==========================================================================
   WEBSITE LỚP 5/4 - TRƯỜNG TIỂU HỌC LÊ VĂN TÁM (2025-2026)
   Application Core Logic & Interactive Game Engine
   ========================================================================== */

// Global State
let currentStudent = null;
let allStudents = [...INITIAL_STUDENTS];
let subjectsData = [...SUBJECTS_DATA];
let currentGame = null;
let currentQuestionIndex = 0;
let currentGameScore = 0;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorageData();
  initLiveClock();
  renderNavigation();
  renderHomeScreen();
  renderSubjectTabs();
  renderGamesList("toan");
  renderHCMCulturalSpace();
  renderLeaderboard();
  renderStudentsList();
  initAIAssistant();
  checkLoggedInUser();
});

/* Local Storage Persistence */
function loadLocalStorageData() {
  const savedStudents = localStorage.getItem("levantam_54_students");
  if (savedStudents) {
    try { allStudents = JSON.parse(savedStudents); } catch (e) {}
  }
  const savedCustomQuestions = localStorage.getItem("levantam_54_custom_q");
  if (savedCustomQuestions) {
    try {
      const customQs = JSON.parse(savedCustomQuestions);
      customQs.forEach(q => {
        const subj = subjectsData.find(s => s.id === q.subjectId);
        if (subj && subj.games.length > 0) {
          subj.games[0].questions.push(q);
        }
      });
    } catch (e) {}
  }
}

function saveStudentsData() {
  localStorage.setItem("levantam_54_students", JSON.stringify(allStudents));
}

/* 1. Real-time Live Clock Under Banner */
function initLiveClock() {
  const clockEl = document.getElementById("live-clock-text");
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayName = days[now.getDay()];
    const dateStr = String(now.getDate()).padStart(2, '0');
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');

    clockEl.innerHTML = `<strong>${dayName}, ngày ${dateStr}/${monthStr}/${year} ${hours}:${mins}:${secs}</strong> | Welcome to Website Lớp 5/4 Trường Tiểu học Lê Văn Tám - GVCN: Cô PHAN THỊ DIỄM TRANG | Địa chỉ: S15 đường Tân Phú, P. Tân Mỹ, TP. Hồ Chí Minh | Chúc các em học sinh học tốt & rèn luyện chăm!`;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* 2. Navigation Section Switcher */
function renderNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-section");
      
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      showSection(targetSection);
    });
  });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".view-section");
  sections.forEach(sec => sec.classList.remove("active"));
  
  const activeSec = document.getElementById(`section-${sectionId}`);
  if (activeSec) {
    activeSec.classList.add("active");
    window.scrollTo({ top: 320, behavior: 'smooth' });
  }
}

/* 3. Render Home Screen */
function renderHomeScreen() {
  const homeContainer = document.getElementById("home-dynamic-content");
  if (!homeContainer) return;

  homeContainer.innerHTML = `
    <div class="hero-welcome-card">
      <div>
        <span class="banner-badge-year">Năm học 2025 - 2026</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--primary-green-dark); margin-top: 5px;">
          Chào mừng các em đến với Không gian Học tập Lớp 5/4!
        </h2>
        <p style="color: var(--ink-soft); margin-top: 8px;">
          Nơi hội tụ tri thức 7 môn học chuẩn SGK Lớp 5 mới 2025-2026, sân chơi tương tác thông minh, Không gian văn hóa Hồ Chí Minh và Trợ lý AI đồng hành 24/7!
        </p>
        
        <div class="teacher-profile-badge">
          <div class="teacher-avatar">👩‍🏫</div>
          <div>
            <div style="font-weight: 800; color: var(--primary-green-dark); font-size: 1.05rem;">Giáo viên Chủ nhiệm: PHAN THỊ DIỄM TRANG</div>
            <div style="font-size: 0.85rem; color: var(--ink-soft);">Trường TH Lê Văn Tám - Địa chỉ: S15 đường Tân Phú, P. Tân Mỹ, TP. Hồ Chí Minh</div>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <img src="assets/images/school_banner.jpg" alt="Lớp 5/4 Lê Văn Tám" style="width: 100%; border-radius: 14px; box-shadow: var(--shadow-md); border: 2px solid var(--primary-green-light);">
      </div>
    </div>

    <div class="quick-stats-grid">
      <div class="stat-card">
        <div class="stat-num">${CLASS_INFO.totalStudents}</div>
        <div class="stat-label">Học sinh Lớp 5/4</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-num">7 Môn</div>
        <div class="stat-label">Chương trình SGK 2025-2026</div>
      </div>
      <div class="stat-card red">
        <div class="stat-num">100+</div>
        <div class="stat-label">Thử thách & Trò chơi</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-num">24/7</div>
        <div class="stat-label">Trợ lý AI Hỗ trợ</div>
      </div>
    </div>

    <!-- Personal AI Recommended Tasks (Visible when student logs in) -->
    <div id="student-ai-tasks-box" style="display: none; background: white; border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md); border-left: 6px solid var(--accent-gold); margin-bottom: 30px;">
      <!-- Populated via JS upon student login -->
    </div>

    <div class="section-title-box">
      <h3 class="section-title">🎨 HOẠT ĐỘNG NỔI BẬT LỚP 5/4</h3>
    </div>
    
    <div class="games-grid">
      ${CLASS_ACTIVITIES.map(act => `
        <div class="game-card">
          <div class="game-thumb-box">
            <img src="${act.image}" alt="${act.title}" class="game-thumb-img">
            <span class="game-tag">${act.date}</span>
          </div>
          <div class="game-info">
            <h4 class="game-title">${act.title}</h4>
            <p class="game-desc">${act.desc}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* 4. Render Subject Tabs & Games */
function renderSubjectTabs() {
  const tabsContainer = document.getElementById("subject-tabs-list");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = subjectsData.map((subj, index) => `
    <button class="subj-tab-btn ${index === 0 ? 'active' : ''}" onclick="switchSubjectTab('${subj.id}', this)">
      <span>${subj.icon}</span> ${subj.name}
    </button>
  `).join('');
}

function switchSubjectTab(subjId, btnEl) {
  document.querySelectorAll(".subj-tab-btn").forEach(b => b.classList.remove("active"));
  btnEl.classList.add("active");
  renderGamesList(subjId);
}

function renderGamesList(subjId) {
  const container = document.getElementById("games-list-container");
  if (!container) return;

  const subj = subjectsData.find(s => s.id === subjId);
  if (!subj) return;

  container.innerHTML = `
    <div style="margin-bottom: 20px; background: white; padding: 18px 24px; border-radius: var(--radius-md); border-left: 5px solid ${subj.color}; box-shadow: var(--shadow-sm);">
      <h3 style="font-family: var(--font-heading); color: var(--ink-dark); font-size: 1.4rem;">
        ${subj.icon} Môn ${subj.name} - SGK Lớp 5 (2025-2026)
      </h3>
      <p style="color: var(--ink-soft); font-size: 0.92rem; margin-top: 4px;">${subj.description}</p>
    </div>
    
    <div class="games-grid">
      ${subj.games.map(game => `
        <div class="game-card">
          <div class="game-thumb-box">
            <img src="${game.image}" alt="${game.title}" class="game-thumb-img">
            <span class="game-tag">${subj.name}</span>
            <span class="game-level-badge">${game.level}</span>
          </div>
          <div class="game-info">
            <h4 class="game-title">${game.title}</h4>
            <p class="game-desc">${game.desc}</p>
            <div class="game-meta">
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary-green-dark);">
                ❓ ${game.questions.length} câu hỏi tương tác
              </span>
              <button class="btn-play-game" onclick="launchGame('${subj.id}', '${game.id}')">
                ▶ CHƠI NGAY
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* 5. Interactive Game Engine & Quiz Modal */
function launchGame(subjId, gameId) {
  const subj = subjectsData.find(s => s.id === subjId);
  if (!subj) return;
  
  const game = subj.games.find(g => g.id === gameId);
  if (!game) return;

  currentGame = game;
  currentQuestionIndex = 0;
  currentGameScore = 0;

  document.getElementById("modal-game-title").innerText = game.title;
  document.getElementById("game-modal").classList.add("active");

  renderCurrentQuestion();
}

function closeGameModal() {
  document.getElementById("game-modal").classList.remove("active");
  currentGame = null;
}

function renderCurrentQuestion() {
  const bodyEl = document.getElementById("modal-game-body");
  if (!currentGame || currentQuestionIndex >= currentGame.questions.length) {
    renderGameCompleteScreen(bodyEl);
    return;
  }

  const qData = currentGame.questions[currentQuestionIndex];
  const progressPct = ((currentQuestionIndex + 1) / currentGame.questions.length) * 100;

  bodyEl.innerHTML = `
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width: ${progressPct}%;"></div>
    </div>
    
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; color: var(--ink-soft); margin-bottom: 10px;">
      <span>Câu ${currentQuestionIndex + 1} / ${currentGame.questions.length}</span>
      <span>Điểm hiện tại: <strong style="color: var(--accent-gold);">${currentGameScore}</strong></span>
    </div>

    <div class="quiz-question-box">
      <div class="quiz-question-text">${qData.q}</div>
    </div>

    <div class="quiz-options-list">
      ${qData.options.map((opt, i) => `
        <button class="quiz-option-btn" onclick="selectAnswer(${i}, this)">
          <span style="width: 28px; height: 28px; border-radius: 50%; background: #e2e8f0; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
            ${String.fromCharCode(65 + i)}
          </span>
          ${opt}
        </button>
      `).join('')}
    </div>

    <div style="display: flex; gap: 10px; align-items: center;">
      <button onclick="askAIForHint()" style="background: var(--accent-gold-light); color: #854d0e; border: 1px solid var(--accent-gold); padding: 8px 16px; border-radius: var(--radius-full); font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
        🤖 Trợ lý AI gợi ý
      </button>
    </div>

    <div id="quiz-feedback" class="quiz-feedback-box"></div>
  `;
}

function selectAnswer(optionIndex, btnEl) {
  const qData = currentGame.questions[currentQuestionIndex];
  const allBtns = document.querySelectorAll(".quiz-option-btn");
  allBtns.forEach(b => b.disabled = true);

  const feedbackBox = document.getElementById("quiz-feedback");

  if (optionIndex === qData.answer) {
    btnEl.classList.add("correct");
    currentGameScore += 10;
    feedbackBox.style.background = "#dcfce7";
    feedbackBox.style.color = "#14532d";
    feedbackBox.innerHTML = `🎉 <strong>Chính xác xuất sắc!</strong> Em nhận được +10 điểm và 1 ⭐!`;
  } else {
    btnEl.classList.add("wrong");
    allBtns[qData.answer].classList.add("correct");
    feedbackBox.style.background = "#fee2e2";
    feedbackBox.style.color = "#7f1d1d";
    feedbackBox.innerHTML = `❌ <strong>Chưa chính xác!</strong> Gợi ý AI: ${qData.hint}`;
  }
  feedbackBox.classList.add("show");

  setTimeout(() => {
    currentQuestionIndex++;
    renderCurrentQuestion();
  }, 2200);
}

function renderGameCompleteScreen(container) {
  const maxScore = currentGame.questions.length * 10;
  const starsEarned = Math.round(currentGameScore / 10);

  // If student is logged in, record points
  if (currentStudent) {
    currentStudent.points += currentGameScore;
    currentStudent.stars += starsEarned;
    saveStudentsData();
    updateHeaderUserBadge();
    renderLeaderboard();
    generateAIPersonalizedTask(currentStudent, currentGame.title, currentGameScore, maxScore);
  }

  container.innerHTML = `
    <div style="text-align: center; padding: 30px 10px;">
      <div style="font-size: 4rem; margin-bottom: 10px;">🏆</div>
      <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--primary-green-dark);">
        Hoàn Thành Bài Tập!
      </h3>
      <p style="font-size: 1.1rem; margin-top: 8px;">
        Em đã đạt được <strong style="color: var(--accent-gold); font-size: 1.4rem;">${currentGameScore} / ${maxScore} điểm</strong>!
      </p>
      <div style="font-size: 2rem; margin: 15px 0;">
        ${"⭐".repeat(starsEarned)}
      </div>
      
      ${currentStudent ? `
        <div style="background: #f0fdf4; border: 1px solid var(--primary-green-light); padding: 14px; border-radius: var(--radius-md); font-weight: 600; color: var(--primary-green-dark); margin: 20px 0;">
          ✨ Đã cập nhật thành tích vào hồ sơ của học sinh <strong>${currentStudent.name}</strong>!
        </div>
      ` : `
        <div style="background: #fefce8; border: 1px solid var(--accent-gold); padding: 14px; border-radius: var(--radius-md); font-size: 0.9rem; color: #854d0e; margin: 20px 0;">
          💡 Đăng nhập tên và ngày sinh cá nhân để tích lũy điểm thưởng và nhận gợi ý bài tập riêng từ Trợ lý AI!
        </div>
      `}

      <button onclick="closeGameModal()" class="btn-play-game" style="margin: 0 auto; padding: 12px 30px; font-size: 1rem;">
        ✔ ĐÓNG VÀ TRỞ VỀ TRANG CHỦ
      </button>
    </div>
  `;
}

function askAIForHint() {
  if (!currentGame) return;
  const qData = currentGame.questions[currentQuestionIndex];
  alert(`🤖 TRỢ LÝ AI "LÊ VĂN TÁM":\n\n${qData.hint}`);
}

/* 6. HCM Cultural Space */
function renderHCMCulturalSpace() {
  const container = document.getElementById("hcm-space-dynamic");
  if (!container) return;

  container.innerHTML = `
    <div class="hcm-space-hero">
      <div>
        <span style="background: var(--accent-gold); color: #7f1d1d; font-weight: 800; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase;">
          Không Gian Văn Hóa Hồ Chí Minh
        </span>
        <h2 class="hcm-title">${HCM_SPACE_DATA.title}</h2>
        <p style="font-size: 0.98rem; opacity: 0.95; line-height: 1.6;">
          ${HCM_SPACE_DATA.intro}
        </p>
      </div>
      <div>
        <img src="assets/images/ho_chi_minh_art.jpg" alt="Bác Hồ Với Thiếu Nhi" style="width: 100%; border-radius: 16px; border: 3px solid var(--accent-gold); box-shadow: var(--shadow-md);">
      </div>
    </div>

    <div class="section-title-box">
      <h3 class="section-title">⭐ 5 ĐIỀU BÁC HỒ DẠY THIẾU NIÊN, NHI ĐỒNG</h3>
    </div>

    <div class="bac-ho-5-dieu-grid">
      ${HCM_SPACE_DATA.rules5.map(r => `
        <div class="dieu-card">
          <div class="dieu-num">${r.num}</div>
          <div class="dieu-text">${r.text}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* 7. Leaderboard Render */
function renderLeaderboard() {
  const container = document.getElementById("honor-board-dynamic");
  if (!container) return;

  const sorted = [...allStudents].sort((a, b) => b.points - a.points);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  container.innerHTML = `
    <div class="honor-podium-box">
      <h3 style="text-align: center; font-family: var(--font-heading); color: var(--primary-green-dark); font-size: 1.6rem; margin-bottom: 20px;">
        🏆 BẢNG VINH DANH NGÔI SAO LỚP 5/4 - NĂM HỌC 2025-2026
      </h3>

      <div class="podium-grid">
        ${top2 ? `
          <div class="podium-item podium-rank-2">
            <div class="podium-avatar">${top2.avatar}</div>
            <div style="font-weight: 800; font-size: 0.9rem;">${top2.name}</div>
            <div style="font-size: 0.8rem; color: var(--ink-soft);">${top2.points} điểm</div>
            <div class="podium-bar">2</div>
          </div>
        ` : ''}

        ${top1 ? `
          <div class="podium-item podium-rank-1">
            <div style="color: #eab308; font-size: 1.5rem;">👑</div>
            <div class="podium-avatar">${top1.avatar}</div>
            <div style="font-weight: 800; font-size: 1rem; color: var(--primary-green-dark);">${top1.name}</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-gold);">${top1.points} điểm</div>
            <div class="podium-bar">1</div>
          </div>
        ` : ''}

        ${top3 ? `
          <div class="podium-item podium-rank-3">
            <div class="podium-avatar">${top3.avatar}</div>
            <div style="font-weight: 800; font-size: 0.9rem;">${top3.name}</div>
            <div style="font-size: 0.8rem; color: var(--ink-soft);">${top3.points} điểm</div>
            <div class="podium-bar">3</div>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="section-title-box">
      <h3 class="section-title">📜 BẢNG XẾP HẠNG CHI TIẾT TẤT CẢ HỌC SINH</h3>
    </div>

    <table class="leaderboard-table">
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
        ${sorted.map((st, idx) => `
          <tr ${currentStudent && currentStudent.id === st.id ? 'style="background: #f0fdf4; font-weight: bold;"' : ''}>
            <td><strong>#${idx + 1}</strong></td>
            <td>${st.avatar} ${st.name}</td>
            <td>${st.group}</td>
            <td><span class="student-role-badge">${st.badge}</span></td>
            <td>⭐ ${st.stars}</td>
            <td style="color: var(--primary-green-dark); font-weight: 800;">${st.points} pts</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* 8. Render Class Directory & Student Roster */
function renderStudentsList() {
  const container = document.getElementById("students-list-dynamic");
  if (!container) return;

  container.innerHTML = `
    <div style="margin-bottom: 20px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <span style="font-weight: 700; color: var(--ink-dark);">Lọc theo Tổ:</span>
      <button class="subj-tab-btn active" onclick="filterStudents('all', this)">Tất cả (35)</button>
      <button class="subj-tab-btn" onclick="filterStudents('Tổ 1', this)">Tổ 1</button>
      <button class="subj-tab-btn" onclick="filterStudents('Tổ 2', this)">Tổ 2</button>
      <button class="subj-tab-btn" onclick="filterStudents('Tổ 3', this)">Tổ 3</button>
      <button class="subj-tab-btn" onclick="filterStudents('Tổ 4', this)">Tổ 4</button>
    </div>

    <div class="students-grid" id="students-cards-container">
      ${renderStudentCardsHTML(allStudents)}
    </div>
  `;
}

function renderStudentCardsHTML(list) {
  return list.map(s => `
    <div class="student-card">
      <div class="student-avatar">${s.avatar}</div>
      <div style="flex-grow: 1;">
        <div class="student-info-name">${s.name}</div>
        <div class="student-info-meta">📅 Ngày sinh: ${s.dob}</div>
        <div class="student-info-meta">🏷️ ${s.group} - ${s.role}</div>
        <span class="student-role-badge">${s.badge}</span>
      </div>
    </div>
  `).join('');
}

function filterStudents(groupName, btnEl) {
  document.querySelectorAll("#section-class-list .subj-tab-btn").forEach(b => b.classList.remove("active"));
  btnEl.classList.add("active");

  const cardsContainer = document.getElementById("students-cards-container");
  if (groupName === 'all') {
    cardsContainer.innerHTML = renderStudentCardsHTML(allStudents);
  } else {
    const filtered = allStudents.filter(s => s.group === groupName);
    cardsContainer.innerHTML = renderStudentCardsHTML(filtered);
  }
}

/* 9. Student Login & Authentication System */
function openLoginModal() {
  document.getElementById("login-modal").classList.add("active");
}

function closeLoginModal() {
  document.getElementById("login-modal").classList.remove("active");
}

function handleStudentLogin(e) {
  e.preventDefault();
  const nameInput = document.getElementById("login-name").value.trim();
  const dobInput = document.getElementById("login-dob").value.trim();

  if (!nameInput || !dobInput) {
    alert("Vui lòng nhập đầy đủ Họ tên và Ngày sinh!");
    return;
  }

  // Find matching student (case insensitive & dob match)
  const found = allStudents.find(s => 
    s.name.toLowerCase() === nameInput.toLowerCase() && 
    (s.dob === dobInput || s.dob.replaceAll('/', '-') === dobInput.replaceAll('/', '-'))
  );

  if (found) {
    currentStudent = found;
    localStorage.setItem("levantam_54_active_user", JSON.stringify(found));
    updateHeaderUserBadge();
    closeLoginModal();
    renderLeaderboard();
    
    // Show AI Personal Task Box
    generateAIPersonalizedTask(currentStudent, "Ôn tập tổng hợp", 0, 0);

    alert(`🎉 Đăng nhập thành công!\nChào mừng em ${currentStudent.name} (${currentStudent.role} - ${currentStudent.group})!`);
  } else {
    alert(`❌ Không tìm thấy thông tin học sinh "${nameInput}" có ngày sinh ${dobInput}.\nVui lòng kiểm tra lại chính xác danh sách Lớp 5/4!`);
  }
}

function checkLoggedInUser() {
  const savedUser = localStorage.getItem("levantam_54_active_user");
  if (savedUser) {
    try {
      currentStudent = JSON.parse(savedUser);
      updateHeaderUserBadge();
      generateAIPersonalizedTask(currentStudent, "Học tập hàng ngày", 0, 0);
    } catch(e) {}
  }
}

function updateHeaderUserBadge() {
  const btn = document.getElementById("user-auth-btn");
  if (!btn) return;

  if (currentStudent) {
    btn.innerHTML = `
      <span>${currentStudent.avatar} ${currentStudent.name} (⭐ ${currentStudent.stars})</span>
      <span onclick="event.stopPropagation(); logoutStudent();" style="margin-left: 8px; background: rgba(255,0,0,0.4); padding: 2px 6px; border-radius: 4px;">Thoát</span>
    `;
  } else {
    btn.innerHTML = `🔑 Đăng nhập Học sinh`;
  }
}

function logoutStudent() {
  currentStudent = null;
  localStorage.removeItem("levantam_54_active_user");
  updateHeaderUserBadge();
  document.getElementById("student-ai-tasks-box").style.display = "none";
  renderLeaderboard();
  alert("Đã đăng xuất tài khoản.");
}

/* 10. AI Personalized Learning Loop (Giao nhiệm vụ – Học tập – Hỗ trợ – Đánh giá – Phản hồi – Cá nhân hóa) */
function generateAIPersonalizedTask(student, lastGameTitle, score, maxScore) {
  const tasksBox = document.getElementById("student-ai-tasks-box");
  if (!tasksBox) return;

  tasksBox.style.display = "block";

  let feedbackMsg = "";
  let recSubject = "toan";

  if (score === maxScore && score > 0) {
    feedbackMsg = `🌟 <strong>Đánh giá AI:</strong> Xuất sắc! Em đã đạt điểm tối đa trong bài "${lastGameTitle}". Trình độ của em rất tốt!`;
    recSubject = "khoa-hoc";
  } else if (score > 0) {
    feedbackMsg = `👍 <strong>Đánh giá AI:</strong> Em đã cố gắng hoàn thành "${lastGameTitle}" với ${score} điểm. Hãy thử sức bài tập nâng cao tiếp theo nhé!`;
    recSubject = "tieng-viet";
  } else {
    feedbackMsg = `🤖 <strong>Trợ lý AI Lê Văn Tám đồng hành:</strong> Chào em ${student.name}! Dựa trên quy trình cá nhân hóa, AI đã chuẩn bị các nhiệm vụ rèn luyện thích hợp nhất cho em hôm nay.`;
  }

  tasksBox.innerHTML = `
    <div style="display: flex; gap: 15px; align-items: flex-start;">
      <div style="font-size: 2.5rem;">🤖</div>
      <div style="flex-grow: 1;">
        <h4 style="font-family: var(--font-heading); color: var(--primary-green-dark); font-size: 1.2rem;">
          QUY TRÌNH HỌC TẬP CÁ NHÂN HÓA AI - HỌC SINH: ${student.name.toUpperCase()}
        </h4>
        <div style="margin-top: 6px; font-size: 0.95rem; color: var(--ink-dark);">${feedbackMsg}</div>
        
        <div style="margin-top: 14px; background: #f8fafc; padding: 14px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
          <strong style="color: var(--accent-purple);">📌 Nhiệm vụ AI giao riêng cho em hôm nay:</strong>
          <ul style="margin-top: 6px; padding-left: 20px; font-size: 0.9rem; color: var(--ink-soft);">
            <li>1. Hoàn thành 1 bài trắc nghiệm Toán Hỗn số & Tỉ số phần trăm</li>
            <li>2. Đọc câu chuyện Bác Hồ tại Không gian Văn hóa Hồ Chí Minh</li>
            <li>3. Đạt thêm +20 điểm thưởng để vươn lên Bảng Vinh Danh Tuần này</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

/* 11. Teacher Question Builder Form Submission */
function handleAddQuestion(e) {
  e.preventDefault();

  const subjectId = document.getElementById("q-subject").value;
  const questionText = document.getElementById("q-text").value.trim();
  const optA = document.getElementById("q-opt-a").value.trim();
  const optB = document.getElementById("q-opt-b").value.trim();
  const optC = document.getElementById("q-opt-c").value.trim();
  const optD = document.getElementById("q-opt-d").value.trim();
  const answerIdx = parseInt(document.getElementById("q-correct").value);
  const hintText = document.getElementById("q-hint").value.trim();

  if (!questionText || !optA || !optB || !optC || !optD) {
    alert("Vui lòng điền đầy đủ câu hỏi và 4 phương án!");
    return;
  }

  const newQ = {
    subjectId: subjectId,
    q: questionText,
    options: [optA, optB, optC, optD],
    answer: answerIdx,
    hint: hintText || "Hãy suy nghĩ kỹ kiến thức đã học trong SGK Lớp 5."
  };

  // Add into subjectsData
  const subj = subjectsData.find(s => s.id === subjectId);
  if (subj && subj.games.length > 0) {
    subj.games[0].questions.push(newQ);
  }

  // Save to LocalStorage
  let customQs = [];
  try {
    customQs = JSON.parse(localStorage.getItem("levantam_54_custom_q")) || [];
  } catch(e) {}
  customQs.push(newQ);
  localStorage.setItem("levantam_54_custom_q", JSON.stringify(customQs));

  alert(`✅ Đã thêm câu hỏi mới thành công vào môn ${subj.name}!`);
  document.getElementById("add-question-form").reset();
  renderGamesList(subjectId);
}

/* 12. Floating AI Assistant Chat Widget */
function initAIAssistant() {
  const triggerBtn = document.getElementById("ai-widget-trigger");
  const chatBox = document.getElementById("ai-chat-box");
  if (!triggerBtn || !chatBox) return;

  triggerBtn.addEventListener("click", () => {
    chatBox.classList.toggle("active");
  });
}

function sendAIMessage() {
  const inputEl = document.getElementById("ai-chat-input");
  const bodyEl = document.getElementById("ai-chat-messages");
  const text = inputEl.value.trim();
  if (!text) return;

  // Render user message
  const userDiv = document.createElement("div");
  userDiv.className = "chat-msg user";
  userDiv.innerText = text;
  bodyEl.appendChild(userDiv);

  inputEl.value = "";
  bodyEl.scrollTop = bodyEl.scrollHeight;

  // Generate AI Response
  setTimeout(() => {
    const botDiv = document.createElement("div");
    botDiv.className = "chat-msg bot";
    botDiv.innerHTML = generateAIAnswer(text);
    bodyEl.appendChild(botDiv);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }, 600);
}

function generateAIAnswer(query) {
  const qLower = query.toLowerCase();
  if (qLower.includes("toán") || qLower.includes("hỗn số") || qLower.includes("tỉ số")) {
    return "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Trong chương trình Toán lớp 5, để đổi hỗn số ra phân số em lấy Phần nguyên × Mẫu số + Tử số. Còn tính Tỉ số phần trăm của A và B em lấy (A : B) × 100!";
  } else if (qLower.includes("bác hồ") || qLower.includes("văn hóa")) {
    return "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Bác Hồ dành tình yêu thương bao la cho thiếu nhi! 5 điều Bác Hồ dạy là kim chỉ nam giúp các em rèn luyện thành con ngoan trò giỏi!";
  } else if (qLower.includes("lớp 5/4") || qLower.includes("cô trang")) {
    return "🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Lớp 5/4 Trường TH Lê Văn Tám năm học 2025-2026 do cô PHAN THỊ DIỄM TRANG làm GVCN. Lớp có 35 bạn học sinh rất chăm ngoan!";
  } else {
    return `🤖 <strong>Trợ lý AI Lê Văn Tám:</strong> Chào em! Rất vui được hỗ trợ em học tập. Em có câu hỏi gì về các môn học Toán, Tiếng Việt, Khoa học, Lịch sử hay Đạo đức Lớp 5 không?`;
  }
}
