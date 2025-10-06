/**
 * DÀNH CHO NHÀ PHÁT TRIỂN:
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
// Fix: Removed GEMINI_API_KEY as it is no longer used. The API key should be set as an environment variable.
export const GOOGLE_API_KEY = "AIzaSyDO9FGGLjIl4iXbQbjhlnx2WK0QUTynUsM"; // <-- DÁN GOOGLE API KEY (cho Sheets, Picker)
export const GOOGLE_CLIENT_ID = "885745592637-6hqd03qh8qsrbis5cserclsk93svm6jr.apps.googleusercontent.com"; // <-- DÁN GOOGLE OAUTH 2.0 CLIENT ID

/**
 * Phạm vi (scope) cần thiết để ứng dụng có thể chỉnh sửa Google Sheets của bạn.
 */
export const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
