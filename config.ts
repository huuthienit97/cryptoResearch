/**
 * DÀNH CHO NHÀ PHÁT TRIỂN:
 * -----------------------------------------------------------------------------
 * GEMINI API KEY
 *
 * Để gán trực tiếp API key cho Gemini AI mà không cần nhập trên giao diện,
 * hãy dán key của bạn vào biến `GEMINI_API_KEY`.
 *
 * QUAN TRỌNG: Nếu bạn chia sẻ mã nguồn này, hãy đảm bảo bạn không đưa key của mình vào đây.
 *
 * Ưu tiên: Key nhập trên giao diện (lưu trong localStorage) sẽ được ưu tiên hơn key này.
 */
export const GEMINI_API_KEY = "AIzaSyB1GORdv4KTRyJ05N3Rxwaq-sRzVRKkbz8"; // <-- DÁN API KEY GEMINI CỦA BẠN VÀO ĐÂY

/**
 * -----------------------------------------------------------------------------
 * GOOGLE SHEETS API CONFIGURATION
 * 
 * Để sử dụng tính năng tích hợp Google Sheets, bạn cần cung cấp
 * Google API Key và OAuth 2.0 Client ID từ Google Cloud Console.
 *
 * HƯỚNG DẪN:
 * 1. Tới Google Cloud Console: https://console.cloud.google.com/
 * 2. Tạo một dự án mới hoặc chọn một dự án có sẵn.
 * 3. Bật các API sau: "Google Sheets API", "Google Picker API".
 * 4. Tới "APIs & Services" -> "Credentials":
 *    a. TẠO API KEY: Nhấp "Create Credentials" -> "API key". Sao chép và dán vào `GOOGLE_API_KEY`.
 *    b. TẠO OAUTH CLIENT ID: Nhấp "Create Credentials" -> "OAuth client ID".
 *       - Chọn "Web application".
 *       - Trong "Authorized JavaScript origins", thêm URL bạn đang host ứng dụng (ví dụ: http://localhost:8080).
 *       - Sao chép "Your Client ID" và dán vào `GOOGLE_CLIENT_ID`.
 * -----------------------------------------------------------------------------
 */
export const GOOGLE_API_KEY = "AIzaSyDO9FGGLjIl4iXbQbjhlnx2WK0QUTynUsM"; // <-- DÁN GOOGLE API KEY (cho Sheets, Picker)
export const GOOGLE_CLIENT_ID = "885745592637-6hqd03qh8qsrbis5cserclsk93svm6jr.apps.googleusercontent.com"; // <-- DÁN GOOGLE OAUTH 2.0 CLIENT ID

/**
 * Phạm vi (scope) cần thiết để ứng dụng có thể chỉnh sửa Google Sheets của bạn.
 */
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets";