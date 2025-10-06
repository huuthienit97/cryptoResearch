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
  const [isGapiReady, setIsGapiReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<SelectedSheet | null>(null);
  
  const gapiLoaded = useCallback(() => {
    window.gapi.load('client:picker', () => {
      window.gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      }).then(() => {
        setIsGapiReady(true);
      });
    });
  }, []);

  const gisLoaded = useCallback(() => {
    window.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: async (resp: any) => {
        if (resp.error !== undefined) {
          throw (resp);
        }
        setIsSignedIn(true);
        localStorage.setItem('gdrive_token', JSON.stringify(resp));
      },
    });
  }, []);

  useEffect(() => {
    const scriptGapi = document.createElement('script');
    scriptGapi.src = 'https://apis.google.com/js/api.js';
    scriptGapi.async = true;
    scriptGapi.defer = true;
    scriptGapi.onload = gapiLoaded;
    document.body.appendChild(scriptGapi);

    const scriptGis = document.createElement('script');
    scriptGis.src = 'https://accounts.google.com/gsi/client';
    scriptGis.async = true;
    scriptGis.defer = true;
    scriptGis.onload = gisLoaded;
    document.body.appendChild(scriptGis);

    // Check for stored token and sheet
    const storedToken = localStorage.getItem('gdrive_token');
    if (storedToken) {
        window.gapi?.client?.setToken(JSON.parse(storedToken));
        setIsSignedIn(true);
    }
    const storedSheet = localStorage.getItem('selectedSheet');
    if (storedSheet) {
      const sheet = JSON.parse(storedSheet);
      setSelectedSheet(sheet);
      onSheetSelect(sheet);
    }
  }, [gapiLoaded, gisLoaded, onSheetSelect]);

  const handleAuthClick = () => {
    if (window.tokenClient) {
      if (window.gapi.client.getToken() === null) {
        window.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        window.tokenClient.requestAccessToken({ prompt: '' });
      }
    }
  };

  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token, () => {
        window.gapi.client.setToken('');
        setIsSignedIn(false);
        setSelectedSheet(null);
        onSheetSelect(null);
        localStorage.removeItem('gdrive_token');
        localStorage.removeItem('selectedSheet');
      });
    }
  };

  const createPicker = () => {
    const view = new window.google.picker.View(window.google.picker.ViewId.SPREADSHEETS);
    view.setMimeTypes("application/vnd.google-apps.spreadsheet");

    const picker = new window.google.picker.PickerBuilder()
      .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
      .setAppId(GOOGLE_CLIENT_ID.split('-')[0])
      .setOAuthToken(window.gapi.client.getToken().access_token)
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

  return (
    <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-3">Tích hợp Google Sheets</h3>
        {!isGapiReady ? (
            <p className="text-sm text-gray-400">Đang tải tài nguyên của Google...</p>
        ) : !isSignedIn ? (
            <button onClick={handleAuthClick} className="w-full md:w-auto inline-flex items-center justify-center px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-300 ease-in-out">
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
