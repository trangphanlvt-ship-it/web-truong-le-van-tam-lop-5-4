/* ==========================================================================
   WEBSITE LỚP 5/4 - TRƯỜNG TIỂU HỌC LÊ VĂN TÁM (2025-2026)
   Database & SGK Grade 5 Curriculum Questions Bank
   ========================================================================== */

const CLASS_INFO = {
  schoolName: "TRƯỜNG TIỂU HỌC LÊ VĂN TÁM",
  className: "LỚP 5/4",
  academicYear: "2025 - 2026",
  teacher: "PHAN THỊ DIỄM TRANG",
  address: "S15 đường Tân Phú, Phường Tân Mỹ, Thành phố Hồ Chí Minh",
  email: "lephantam.tanmy@hcm.edu.vn",
  totalStudents: 35
};

// 35 Students of Class 5/4 (Names + Date of Birth + Roles + Achievements)
const INITIAL_STUDENTS = [
  { id: 1, name: "Nguyễn Văn An", dob: "15/04/2015", gender: "nam", role: "Lớp trưởng", avatar: "👦", points: 480, stars: 48, badge: "Hiệp sĩ Toán học", group: "Tổ 1" },
  { id: 2, name: "Trần Thị Mai", dob: "20/08/2015", gender: "nu", role: "Lớp phó Học tập", avatar: "👧", points: 495, stars: 49, badge: "Văn hay Chữ tốt", group: "Tổ 1" },
  { id: 3, name: "Lê Hoàng Nam", dob: "10/01/2015", gender: "nam", role: "Tổ trưởng Tổ 1", avatar: "👦", points: 420, stars: 42, badge: "Nhà Khoa học nhí", group: "Tổ 1" },
  { id: 4, name: "Phạm Quốc Bảo", dob: "05/11/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 390, stars: 39, badge: "Chiến sĩ Địa lý", group: "Tổ 1" },
  { id: 5, name: "Vũ Ngọc Ánh", dob: "12/03/2015", gender: "nu", role: "Lớp phó Phong trào", avatar: "👧", points: 460, stars: 46, badge: "Họa sĩ Thủy Mặc", group: "Tổ 1" },
  { id: 6, name: "Phan Mỹ Linh", dob: "18/09/2015", gender: "nu", role: "Tổ phó Tổ 1", avatar: "👧", points: 410, stars: 41, badge: "Tâm hồn Cao đẹp", group: "Tổ 1" },
  { id: 7, name: "Đặng Tuấn Kiệt", dob: "25/06/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 375, stars: 37, badge: "Kỹ sư Công nghệ", group: "Tổ 1" },
  { id: 8, name: "Bùi Thị Hải Yến", dob: "08/02/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 430, stars: 43, badge: "Ngôi sao Nỗ lực", group: "Tổ 1" },
  { id: 9, name: "Hồ Đức Anh", dob: "30/10/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 360, stars: 36, badge: "Dũng sĩ Thể thao", group: "Tổ 1" },
  
  { id: 10, name: "Đỗ Phương Thảo", dob: "14/05/2015", gender: "nu", role: "Tổ trưởng Tổ 2", avatar: "👧", points: 450, stars: 45, badge: "Bông hoa Điểm 10", group: "Tổ 2" },
  { id: 11, name: "Võ Minh Trí", dob: "22/07/2015", gender: "nam", role: "Tổ phó Tổ 2", avatar: "👦", points: 440, stars: 44, badge: "Đại sứ Văn hóa", group: "Tổ 2" },
  { id: 12, name: "Nông Khánh Hà", dob: "09/12/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 385, stars: 38, badge: "Chăm ngoan Học giỏi", group: "Tổ 2" },
  { id: 13, name: "Dương Quang Huy", dob: "03/04/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 415, stars: 41, badge: "Gia đình Công nghệ", group: "Tổ 2" },
  { id: 14, name: "Lý Thanh Vân", dob: "28/01/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 400, stars: 40, badge: "Tiên phong Trải nghiệm", group: "Tổ 2" },
  { id: 15, name: "Trịnh Gia Bảo", dob: "17/08/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 395, stars: 39, badge: "Tay bơi Cừ khôi", group: "Tổ 2" },
  { id: 16, name: "Ngô Hoàng Anh", dob: "02/11/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 370, stars: 37, badge: "Học sinh Tích cực", group: "Tổ 2" },
  { id: 17, name: "Lương Bích Ngọc", dob: "19/03/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 425, stars: 42, badge: "Nụ cười Thân thiện", group: "Tổ 2" },
  { id: 18, name: "Đinh Công Thành", dob: "21/09/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 380, stars: 38, badge: "Kiến trúc sư Nhí", group: "Tổ 2" },

  { id: 19, name: "Phùng Mỹ Duyên", dob: "04/06/2015", gender: "nu", role: "Tổ trưởng Tổ 3", avatar: "👧", points: 470, stars: 47, badge: "Hoa Khôi Tri Thức", group: "Tổ 3" },
  { id: 20, name: "Tô Minh Khoa", dob: "11/10/2015", gender: "nam", role: "Tổ phó Tổ 3", avatar: "👦", points: 435, stars: 43, badge: "Vua Giải Đố", group: "Tổ 3" },
  { id: 21, name: "Trương Hồng Nhung", dob: "27/02/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 405, stars: 40, badge: "Ngôi sao Âm nhạc", group: "Tổ 3" },
  { id: 22, name: "Châu Vĩnh Phú", dob: "16/07/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 390, stars: 39, badge: "Hiệp sĩ Xanh", group: "Tổ 3" },
  { id: 23, name: "Cao Thùy Trang", dob: "08/04/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 410, stars: 41, badge: "Thủ lĩnh Nhóm", group: "Tổ 3" },
  { id: 24, name: "Vương Minh Quân", dob: "23/09/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 365, stars: 36, badge: "Cầu thủ Nhí", group: "Tổ 3" },
  { id: 25, name: "Lại Bảo Quyên", dob: "12/01/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 415, stars: 41, badge: "Cây bút Trẻ", group: "Tổ 3" },
  { id: 26, name: "Tạ Việt Cường", dob: "05/08/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 375, stars: 37, badge: "Hiệp sĩ Môi trường", group: "Tổ 3" },
  { id: 27, name: "Khuất Kim Oanh", dob: "31/05/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 395, stars: 39, badge: "Nữ sinh Thanh lịch", group: "Tổ 3" },

  { id: 28, name: "Đoàn Tấn Phát", dob: "14/02/2015", gender: "nam", role: "Tổ trưởng Tổ 4", avatar: "👦", points: 465, stars: 46, badge: "Tài năng Sáng tạo", group: "Tổ 4" },
  { id: 29, name: "Thái Bảo Ngọc", dob: "07/11/2015", gender: "nu", role: "Tổ phó Tổ 4", avatar: "👧", points: 445, stars: 44, badge: "Người Bè Bạn Tốt", group: "Tổ 4" },
  { id: 30, name: "Châm Văn Nhật", dob: "24/03/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 385, stars: 38, badge: "Học giỏi Lịch sử", group: "Tổ 4" },
  { id: 31, name: "Mai Thu Hà", dob: "18/06/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 420, stars: 42, badge: "Đại sứ Đọc sách", group: "Tổ 4" },
  { id: 32, name: "Lâm Quốc Thắng", dob: "02/10/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 400, stars: 40, badge: "Siêu sao Lập trình", group: "Tổ 4" },
  { id: 33, name: "Nghiêm Kim Ngân", dob: "29/07/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 390, stars: 39, badge: "Bạn nhỏ Ngoan hiền", group: "Tổ 4" },
  { id: 34, name: "Khổng Tiến Đạt", dob: "13/04/2015", gender: "nam", role: "Thành viên", avatar: "👦", points: 370, stars: 37, badge: "Gương sáng Nỗ lực", group: "Tổ 4" },
  { id: 35, name: "Phan Yến Nhi", dob: "21/12/2015", gender: "nu", role: "Thành viên", avatar: "👧", points: 430, stars: 43, badge: "Hoa điểm 10 Đạo đức", group: "Tổ 4" }
];

// 7 Subjects SGK Grade 5 (2025-2026) Interactive Games & Quiz Bank
const SUBJECTS_DATA = [
  {
    id: "toan",
    name: "TOÁN HỌC",
    icon: "📐",
    color: "#0d8a52",
    description: "Khám phá Hỗn số, Tỉ số %, Hình học diện tích - thể tích & Toán chuyển động đều.",
    games: [
      {
        id: "toan-g1",
        title: "Thám Hiểm Hỗn Số & Phân Số 5/4",
        level: "Lớp 5 - Bài 1",
        image: "assets/images/subject_learning_art.jpg",
        desc: "Giải bài tập chuyển đổi hỗn số thành phân số và cộng trừ phân số khác mẫu.",
        questions: [
          {
            q: "Chuyển hỗn số 3 và 2/5 thành phân số ta được:",
            options: ["17/5", "15/5", "11/5", "13/5"],
            answer: 0,
            hint: "Lấy phần nguyên (3) nhân với mẫu số (5) rồi cộng với tử số (2): 3x5 + 2 = 17."
          },
          {
            q: "Tính diện tích hình tam giác có độ dài đáy 12cm và chiều cao 8cm:",
            options: ["48 cm²", "96 cm²", "20 cm²", "40 cm²"],
            answer: 0,
            hint: "Diện tích tam giác S = (Đáy x Chiều cao) / 2 = (12 x 8) / 2 = 48."
          },
          {
            q: "Một ô tô đi quãng đường 120km hết 2 giờ 30 phút. Vận tốc của ô tô là:",
            options: ["48 km/h", "50 km/h", "45 km/h", "60 km/h"],
            answer: 0,
            hint: "Đổi 2 giờ 30 phút = 2.5 giờ. Vận tốc v = S / t = 120 / 2.5 = 48 km/h."
          }
        ]
      },
      {
        id: "toan-g2",
        title: "Đấu Trí Tỉ Số Phần Trăm & Thể Tích",
        level: "Lớp 5 - Bài 2",
        image: "assets/images/subject_learning_art.jpg",
        desc: "Chinh phục các bài toán tính tỉ số phần trăm và thể tích hình lập phương, hình hộp chữ nhật.",
        questions: [
          {
            q: "Một lớp học có 40 học sinh, trong đó có 24 học sinh nữ. Tỉ số phần trăm của học sinh nữ là:",
            options: ["60%", "40%", "50%", "65%"],
            answer: 0,
            hint: "Tính tỉ số: (24 / 40) x 100 = 60%."
          },
          {
            q: "Tính thể tích hình lập phương có cạnh bằng 5 dm:",
            options: ["125 dm³", "25 dm³", "100 dm³", "150 dm³"],
            answer: 0,
            hint: "Thể tích hình lập phương V = a x a x a = 5 x 5 x 5 = 125 dm³."
          }
        ]
      }
    ]
  },
  {
    id: "tieng-viet",
    name: "TIẾNG VIỆT",
    icon: "📖",
    color: "#da251d",
    description: "Luyện từ & câu, biện pháp tu từ, mở rộng vốn từ quê hương đất nước & tập làm văn lớp 5.",
    games: [
      {
        id: "tv-g1",
        title: "Hành Trình Chắp Cánh Từ & Cụm Từ",
        level: "Lớp 5 - Việt Nam Quê Hương Tôi",
        image: "assets/images/school_banner.jpg",
        desc: "Luyện tập xác định đại từ, quan hệ từ và tìm các từ đồng nghĩa, trái nghĩa phong phú.",
        questions: [
          {
            q: "Trong câu 'Mặt trời đỏ rực như một quả cầu lửa', tác giả đã sử dụng biện pháp nghệ thuật nào?",
            options: ["So sánh", "Nhân hóa", "Ẩn dụ", "Điệp từ"],
            answer: 0,
            hint: "Dấu hiệu từ 'như' nối giữa 'mặt trời đỏ rực' và 'quả cầu lửa' chính là biện pháp so sánh."
          },
          {
            q: "Từ nào sau đây đồng nghĩa với từ 'bao la' trong câu 'Cánh đồng lúa bao la'?",
            options: ["Mênh mông", "Chật hẹp", "Nhỏ bé", "Hiểm trở"],
            answer: 0,
            hint: "'Bao la' và 'Mênh mông' đều miêu tả không gian rộng lớn không thấy bờ bến."
          },
          {
            q: "Quan hệ từ nào thích hợp điền vào chỗ trống: '... trời mưa to ... chúng em vẫn đến trường đúng giờ'?",
            options: ["Tuy ... nhưng ...", "Vì ... nên ...", "Nếu ... thì ...", "Chẳng những ... mà còn ..."],
            answer: 0,
            hint: "Cặp quan hệ từ chỉ sự tương phản biểu thị nỗ lực là 'Tuy... nhưng...'."
          }
        ]
      }
    ]
  },
  {
    id: "khoa-hoc",
    name: "KHOA HỌC",
    icon: "🔬",
    color: "#1e73be",
    description: "Tìm hiểu Năng lượng mặt trời, Đất & Sinh thái Việt Nam, Sự biến đổi hóa học & Sức khỏe.",
    games: [
      {
        id: "kh-g1",
        title: "Nhà Khoa Học Nhí Lớp 5/4",
        level: "Lớp 5 - Năng lượng & Biến đổi",
        image: "assets/images/subject_learning_art.jpg",
        desc: "Khám phá nguyên lý hoạt động của các nguồn năng lượng sạch và sự biến đổi của chất.",
        questions: [
          {
            q: "Nguồn năng lượng nào sau đây là năng lượng tái tạo, không gây ô nhiễm môi trường?",
            options: ["Năng lượng mặt trời", "Than đá", "Dầu mỏ", "Khí đốt tự nhiên"],
            answer: 0,
            hint: "Mặt trời chiếu sáng liên tục và vô tận, là nguồn năng lượng tái tạo sạch."
          },
          {
            q: "Hiện tượng nào sau đây là sự biến đổi hóa học?",
            options: ["Đốt cháy một tờ giấy thành tro", "Xé nhỏ một tờ giấy", "Hòa tan đường vào nước", "Nước đá tan thành nước lỏng"],
            answer: 0,
            hint: "Sự biến đổi hóa học tạo ra chất mới hoàn toàn (tro than từ tờ giấy)."
          }
        ]
      }
    ]
  },
  {
    id: "lich-su-dia-ly",
    name: "LỊCH SỬ VÀ ĐỊA LÝ",
    icon: "🗺️",
    color: "#7a3ee8",
    description: "Khám phá địa lý Việt Nam, Thành phố Hồ Chí Minh và các mốc lịch sử hào hùng.",
    games: [
      {
        id: "lsdl-g1",
        title: "Hành Trình Xuyên Việt & TP. Hồ Chí Minh",
        level: "Lớp 5 - Địa lý & Lịch sử",
        image: "assets/images/school_banner.jpg",
        desc: "Thử thách kiến thức về các danh lam thắng cảnh, các vùng địa lý và truyền thống lịch sử.",
        questions: [
          {
            q: "Thành phố Hồ Chí Minh thuộc vùng địa lý nào của Việt Nam?",
            options: ["Đông Nam Bộ", "Đồng bằng sông Cửu Long", "Tây Nguyên", "Duyên hải Nam Trung Bộ"],
            answer: 0,
            hint: "TP. Hồ Chí Minh là trung tâm kinh tế - văn hóa lớn nhất vùng Đông Nam Bộ."
          },
          {
            q: "Bác Hồ đọc Bản Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa vào ngày tháng năm nào?",
            options: ["2 tháng 9 năm 1945", "19 tháng 8 năm 1945", "30 tháng 4 năm 1975", "7 tháng 5 năm 1954"],
            answer: 0,
            hint: "Sự kiện lịch sử trọng đại tại Quảng trường Ba Đình ngày 2/9/1945."
          }
        ]
      }
    ]
  },
  {
    id: "cong-nghe",
    name: "CÔNG NGHỆ",
    icon: "💻",
    color: "#0284c7",
    description: "An toàn thông tin trên Internet, sử dụng công nghệ số 5.0 và tư duy thuật toán.",
    games: [
      {
        id: "cn-g1",
        title: "Kỹ Sư Công Nghệ 5.0",
        level: "Lớp 5 - Đời sống số",
        image: "assets/images/subject_learning_art.jpg",
        desc: "Học cách bảo vệ mật khẩu, ứng xử văn minh trên mạng và thiết kế mô hình công nghệ.",
        questions: [
          {
            q: "Hành động nào sau đây giúp em an toàn khi sử dụng Internet?",
            options: [
              "Không chia sẻ mật khẩu cá nhân cho người lạ",
              "Bấm vào tất cả các liên kết lạ gửi tới",
              "Kết bạn với người không quen biết trên mạng",
              "Cung cấp địa chỉ nhà riêng cho bất kỳ ai hỏi"
            ],
            answer: 0,
            hint: "Giữ kín thông tin cá nhân và mật khẩu là nguyên tắc vàng an toàn mạng."
          }
        ]
      }
    ]
  },
  {
    id: "dao-duc",
    name: "ĐẠO ĐỨC",
    icon: "❤️",
    color: "#e11d48",
    description: "Xây dựng tình bạn thắm thiết, lòng yêu nước, ý thức trách nhiệm và bảo vệ môi trường.",
    games: [
      {
        id: "dd-g1",
        title: "Hạt Giống Tâm Hồn Lớp 5/4",
        level: "Lớp 5 - Giá trị sống",
        image: "assets/images/school_banner.jpg",
        desc: "Xử lý các tình huống đạo đức đời sống, lan tỏa tinh thần sẻ chia và yêu thương.",
        questions: [
          {
            q: "Khi thấy bạn trong lớp gặp khó khăn trong học tập, hành động đúng đắn của em là gì?",
            options: [
              "Chủ động chia sẻ, hướng dẫn và cùng bạn tiến bộ",
              "Mặc kệ vì không phải việc của mình",
              "Chê bai bạn học yếu",
              "Báo với thầy cô để phạt bạn"
            ],
            answer: 0,
            hint: "Tình bạn chân thành thể hiện qua sự thấu hiểu và giúp đỡ nhau cùng nâng cao kiến thức."
          }
        ]
      }
    ]
  },
  {
    id: "hoat-dong-trai-nghiem",
    name: "HOẠT ĐỘNG TRẢI NGHIỆM",
    icon: "🌟",
    color: "#d97706",
    description: "Rèn luyện kỹ năng sống, làm việc nhóm, quản lý thời gian và lập kế hoạch cá nhân.",
    games: [
      {
        id: "hdtn-g1",
        title: "Thử Thách Kỹ Năng Sống 5.0",
        level: "Lớp 5 - Trải nghiệm sáng tạo",
        image: "assets/images/subject_learning_art.jpg",
        desc: "Thực hành phương pháp quản lý thời gian học tập - giải trí cân bằng và hợp lý.",
        questions: [
          {
            q: "Thời gian biểu học tập hiệu quả dành cho học sinh lớp 5 cần đảm bảo điều gì?",
            options: [
              "Cân bằng giữa giờ học, giờ vui chơi giải trí và ngủ đủ giấc",
              "Học liên tục không nghỉ ngơi",
              "Chỉ chơi game và xem TV",
              "Chỉ học vào ban đêm"
            ],
            answer: 0,
            hint: "Sức khỏe thể chất và tinh thần minh mẫn cần có sự cân bằng hợp lý."
          }
        ]
      }
    ]
  }
];

// Ho Chi Minh Cultural Space Content
const HCM_SPACE_DATA = {
  title: "KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - LỚP 5/4",
  intro: "Không gian tưởng niệm, học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh dành cho học sinh Lớp 5/4 Trường Tiểu học Lê Văn Tám.",
  rules5: [
    { num: 1, text: "Yêu tổ quốc, yêu đồng bào" },
    { num: 2, text: "Học tập tốt, lao động tốt" },
    { num: 3, text: "Đoàn kết tốt, kỷ luật tốt" },
    { num: 4, text: "Giữ gìn vệ sinh thật tốt" },
    { num: 5, text: "Khiêm tốn, thật thà, dũng cảm" }
  ],
  stories: [
    {
      title: "Bác Hồ với thiếu niên, nhi đồng",
      excerpt: "Bác Hồ luôn dành tình cảm thắm thiết, sâu sắc nhất cho các cháu thiếu niên, nhi đồng cả nước...",
      image: "assets/images/ho_chi_minh_art.jpg"
    },
    {
      title: "Chiếc áo ấm Bác tặng",
      excerpt: "Câu chuyện cảm động về sự quan tâm chu đáo từng nếp ăn, nếp mặc của Bác đối với thiếu nhi...",
      image: "assets/images/ho_chi_minh_art.jpg"
    }
  ]
};

// Class Activities Gallery Data
const CLASS_ACTIVITIES = [
  {
    id: 1,
    title: "Chương trình Trải nghiệm STEM & Robot Lớp 5/4",
    date: "15/10/2025",
    image: "assets/images/subject_learning_art.jpg",
    desc: "Các bạn học sinh Lớp 5/4 hào hứng lắp ráp và lập trình mô hình xe tự hành thông minh."
  },
  {
    id: 2,
    title: "Sinh hoạt Sao Nhi Đồng & Hành trình Địa chỉ đỏ",
    date: "20/11/2025",
    image: "assets/images/school_banner.jpg",
    desc: "Lớp 5/4 dâng hoa tại di tích lịch sử và tham quan Không gian Văn hóa Hồ Chí Minh."
  },
  {
    id: 3,
    title: "Hội thao Phù Đổng Trường TH Lê Văn Tám",
    date: "12/12/2025",
    image: "assets/images/school_banner.jpg",
    desc: "Lớp 5/4 xuất sắc giành giải Nhất môn Kéo co và giải Nhì Bóng đá nam."
  }
];
