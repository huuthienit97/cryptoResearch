import React, { useState, useEffect, useCallback } from 'react';
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, SCOPES } from '../config';
import { SelectedSheet } from '../types';
import { GoogleSheetIcon } from './icons/GoogleSheetIcon';

declare global {
  interface Window {
    gapi: any;
    google: any;
    tokenClient: any;
  }
}

interface GoogleSheetConnectorProps {
  onSheetSelect: (sheet: SelectedSheet | null) => void;
}

const GoogleSheetConnector: React.FC<GoogleSheetConnectorProps> = ({ onSheetSelect }) => {
  const [gapiReady, setGapiReady] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<SelectedSheet | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const gapiLoaded = useCallback(() => {
    window.gapi.load('client:picker', () => {
      window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      }).then(() => {
        setGapiReady(true);
      }).catch((error: any) => {
        console.error("Lỗi khởi tạo Google API client (đối tượng gốc):", error);
        
        let detailedMessage = "Lỗi không xác định. Kiểm tra console của trình duyệt để biết thêm chi tiết kỹ thuật.";
        if (error) {
            if (typeof error === 'string') {
                detailedMessage = error;
            } else if (error.result?.error?.message) {
                // Cấu trúc lỗi chuẩn của Google API
                detailedMessage = error.result.error.message;
            } else if (error.details) {
                // Một cấu trúc lỗi phổ biến khác của Google API
                detailedMessage = error.details;
            } else if (error.message) {
                // Lỗi JavaScript tiêu chuẩn
                detailedMessage = error.message;
            } else {
                // Phương án dự phòng cho các cấu trúc đối tượng khác
                try {
                    // Cố gắng tuần tự hóa cả các thuộc tính không đếm được
                    const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
                    // Chỉ sử dụng phiên bản chuỗi hóa nếu nó không phải là một đối tượng rỗng
                    if (errorString && errorString !== '{}') {
                        detailedMessage = errorString;
                    }
                } catch (e) {
                    // JSON.stringify có thể thất bại với các cấu trúc vòng tròn
                    console.error("Không thể JSON.stringify đối tượng lỗi:", e);
                }
            }
        }
        
        setAuthError(`Không thể khởi tạo Google API Client. Vui lòng kiểm tra lại API Key và các giới hạn (restrictions) trong Google Cloud Console. Chi tiết: ${detailedMessage}`);
      });
    });
  }, []);

  const gisLoaded = useCallback(() => {
    try {
      window.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (resp: any) => {
          if (resp.error !== undefined) {
            console.error("Lỗi đăng nhập Google:", resp);
            setAuthError(`Đăng nhập Google thất bại: ${resp.error_description || resp.error || 'Vui lòng thử lại.'}`);
            setIsSignedIn(false);
            return;
          }
          
          const tokenWithExpiry = { 
              ...resp, 
              expires_at: (Date.now() / 1000) + resp.expires_in 
          };
          
          window.gapi.client.setToken(tokenWithExpiry);
          setIsSignedIn(true);
          setAuthError(null);
          localStorage.setItem('gdrive_token', JSON.stringify(tokenWithExpiry));
        },
      });
      setGisReady(true);
    } catch (error) {
      console.error("Lỗi khởi tạo Google Identity Services:", error);
      setAuthError("Không thể khởi tạo dịch vụ xác thực của Google.");
    }
  }, []);

  // Chờ các API được tải toàn cục từ index.html, sau đó khởi tạo chúng.
  useEffect(() => {
    const waitForApi = (condition: () => boolean): Promise<void> => {
      return new Promise((resolve) => {
        if (condition()) {
          return resolve();
        }
        const interval = setInterval(() => {
          if (condition()) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    };

    const initializeApis = async () => {
        await waitForApi(() => !!(window.gapi && window.gapi.load));
        gapiLoaded();
        await waitForApi(() => !!(window.google && window.google.accounts && window.google.accounts.oauth2));
        gisLoaded();
    };

    initializeApis();
  }, [gapiLoaded, gisLoaded]);

  // Effect để khôi phục phiên đăng nhập chỉ khi cả hai API đã sẵn sàng
  useEffect(() => {
    if (gapiReady && gisReady) {
      try {
        const storedToken = localStorage.getItem('gdrive_token');
        if (storedToken) {
          const token = JSON.parse(storedToken);
          if (token && token.expires_at && (Date.now() / 1000) < (token.expires_at - 60)) {
            window.gapi.client.setToken(token);
            setIsSignedIn(true);
            const storedSheet = localStorage.getItem('selectedSheet');
            if (storedSheet) {
              const sheet = JSON.parse(storedSheet);
              setSelectedSheet(sheet);
              onSheetSelect(sheet);
            }
          } else {
            localStorage.removeItem('gdrive_token');
            localStorage.removeItem('selectedSheet');
            setIsSignedIn(false);
            onSheetSelect(null);
          }
        }
      } catch (error) {
        console.error("Lỗi khôi phục phiên từ localStorage:", error);
        localStorage.removeItem('gdrive_token');
        localStorage.removeItem('selectedSheet');
        setIsSignedIn(false);
        onSheetSelect(null);
      }
    }
  }, [gapiReady, gisReady, onSheetSelect]);


  const handleAuthClick = () => {
    setAuthError(null);
    if (gisReady && window.tokenClient) {
      if (window.gapi.client.getToken() === null) {
        window.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        window.tokenClient.requestAccessToken({ prompt: '' });
      }
    } else {
      console.error("Google Identity Services chưa sẵn sàng.");
      setAuthError("Dịch vụ Google chưa sẵn sàng, vui lòng đợi một lát và thử lại.");
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {
        window.gapi.client.setToken(null);
        setIsSignedIn(false);
        setSelectedSheet(null);
        onSheetSelect(null);
        setAuthError(null);
        localStorage.removeItem('gdrive_token');
        localStorage.removeItem('selectedSheet');
      });
    }
  };

  const createPicker = () => {
    if (!isSignedIn || !window.gapi.client.getToken()?.access_token) {
      console.error("Token không hợp lệ hoặc chưa đăng nhập. Yêu cầu xác thực.");
      handleAuthClick();
      return;
    }

    const token = window.gapi.client.getToken();
    const view = new window.google.picker.View(window.google.picker.ViewId.SPREADSHEETS);
    view.setMimeTypes("application/vnd.google-apps.spreadsheet");

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setAppId(GOOGLE_CLIENT_ID.split('-')[0])
      .setOAuthToken(token.access_token)
      .addView(view)
      .addView(new window.google.picker.DocsUploadView())
      .setDeveloperKey(GOOGLE_API_KEY)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          const sheetData: SelectedSheet = { id: doc.id, name: doc.name, url: doc.url };
          setSelectedSheet(sheetData);
          onSheetSelect(sheetData);
          localStorage.setItem('selectedSheet', JSON.stringify(sheetData));
        }
      })
      .build();
    picker.setVisible(true);
  };
  
  if (!GOOGLE_API_KEY || !GOOGLE_CLIENT_ID) {
    return (
        <div className="text-center p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            <p className="text-yellow-300 text-sm">Tính năng Google Sheets chưa được cấu hình. Vui lòng xem hướng dẫn trong file `config.ts`.</p>
        </div>
    )
  }

  const isFullyReady = gapiReady && gisReady;

  return (
    <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Tích hợp Google Sheets</h3>
        {authError && (
          <div className="text-center p-3 mb-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm font-medium">{authError}</p>
          </div>
        )}
        {!isFullyReady && !authError ? (
            <p className="text-sm text-gray-400">Đang khởi tạo dịch vụ của Google...</p>
        ) : !isSignedIn ? (
            <button onClick={handleAuthClick} disabled={!!authError} className="w-full md:w-auto inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                <GoogleSheetIcon className="h-5 w-5 mr-2" />
                Kết nối với Google Sheets
            </button>
        ) : (
            <div className="space-y-3">
                {selectedSheet ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div>
                           <p className="text-sm text-green-400 font-medium">Đã kết nối và sẵn sàng lưu vào:</p>
                           <a href={selectedSheet.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all">
                                {selectedSheet.name}
                           </a>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                           <button onClick={createPicker} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md transition-colors">
                            Thay đổi
                           </button>
                        </div>
                    </div>
                ) : (
                     <button onClick={createPicker} className="w-full md:w-auto inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 ease-in-out">
                        Chọn Bảng tính
                    </button>
                )}
                 <button onClick={handleSignoutClick} className="text-xs text-red-400 hover:text-red-300">
                    Ngắt kết nối Google
                </button>
            </div>
        )}
    </div>
  );
};

export default GoogleSheetConnector;