// File này mô phỏng các biến môi trường để phát triển và tự host cục bộ.
// **QUAN TRỌNG:** KHÔNG commit file này vào git.
// Hãy thêm "env.js" vào file .gitignore của bạn.

// Thay thế "YOUR_API_KEY_HERE" bằng Gemini API Key thực của bạn.
const API_KEY = "AIzaSyB1GORdv4KTRyJ05N3Rxwaq-sRzVRKkbz8";

// Gắn các biến môi trường vào đối tượng window để chúng có thể truy cập toàn cục
// giống như process.env trong môi trường Node.js.
window.process = {
  env: {
    API_KEY: API_KEY,
  },
};
