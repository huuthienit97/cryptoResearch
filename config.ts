/**
 * DÀNH CHO NHÀ PHÁT TRIỂN:
 * -----------------------------------------------------------------------------
 * CẤU HÌNH API KEY
 *
 * Hướng dẫn cấu hình các API key cần thiết cho ứng dụng.
 * -----------------------------------------------------------------------------
 * 
 * **1. GEMINI API KEY (Bắt buộc)**
 * 
 * **CẢNH BÁO BẢO MẬT:** Việc lưu API key trực tiếp trong mã nguồn không được 
 * khuyến nghị cho các ứng dụng chính thức (production). Hãy xem xét sử dụng 
 * biến môi trường để bảo mật tốt hơn.
 * 
 * HƯỚNG DẪN:
 *  a. Lấy API key của bạn từ Google AI Studio: https://makersuite.google.com/
 *  b. Dán key của bạn vào đây, thay thế cho "YOUR_GEMINI_API_KEY_HERE".
 */
export const GEMINI_API_KEY = "AIzaSyB1GORdv4KTRyJ05N3Rxwaq-sRzVRKkbz8"; // <-- DÁN GEMINI API KEY CỦA BẠN VÀO ĐÂY

/**
 * -----------------------------------------------------------------------------
 * **2. GOOGLE SHEETS API CONFIGURATION (Tùy chọn)**
 * 
 * Để sử dụng tính năng tích hợp Google Sheets, bạn cần cung cấp
 * Google API Key và OAuth 2.0 Client ID từ Google Cloud Console.
 *
 * HƯỚNG DẪN:
 *  a. Tới Google Cloud Console: https://console.cloud.google.com/
 *  b. Tạo một dự án mới hoặc chọn một dự án có sẵn.
 *  c. Bật các API sau: "Google Sheets API", "Google Picker API".
 *  d. Tới "APIs & Services" -> "Credentials":
 *     i. TẠO API KEY: Nhấp "Create Credentials" -> "API key". Sao chép và dán vào `GOOGLE_API_KEY`.
 *     ii. TẠO OAUTH CLIENT ID: Nhấp "Create Credentials" -> "OAuth client ID".
 *        - Chọn "Web application".
 *        - Trong "Authorized JavaScript origins", thêm URL bạn đang host ứng dụng (ví dụ: http://localhost:8080).
 *        - Sao chép "Your Client ID" và dán vào `GOOGLE_CLIENT_ID`.
 * -----------------------------------------------------------------------------
 */
export const GOOGLE_API_KEY = "AIzaSyDO9FGGLjIl4iXbQbjhlnx2WK0QUTynUsM"; // <-- DÁN GOOGLE API KEY (cho Sheets, Picker)
export const GOOGLE_CLIENT_ID = "885745592637-6hqd03qh8qsrbis5cserclsk93svm6jr.apps.googleusercontent.com"; // <-- DÁN GOOGLE OAUTH 2.0 CLIENT ID

/**
 * Phạm vi (scope) cần thiết để ứng dụng có thể chỉnh sửa Google Sheets của bạn.
 */
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets";