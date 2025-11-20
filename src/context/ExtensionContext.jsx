import React, { createContext, useState, useContext } from "react";
import { getPageContent } from "../utils/scraper";

const ExtensionContext = createContext();

export const ExtensionProvider = ({ children }) => {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("menu");

  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedText, setSelectedText] = useState("");

  const [analysisLogs, setAnalysisLogs] = useState([]);

  // Data Flow
  const [availableSources, setAvailableSources] = useState([]); // List source từ API về
  const [selectedSourceIds, setSelectedSourceIds] = useState([]); // User chọn cái nào
  const [verifyResult, setVerifyResult] = useState(null); // Kết quả verify
  const [isLoading, setIsLoading] = useState(false);

  // --- ACTIONS ---

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentView("menu");
    setSelectedSourceIds([]);
  };

  const navigate = (view) => setCurrentView(view);

  // 1. Giả lập API lấy danh sách Source
  const fetchSources = async () => {
    setIsLoading(true);
    // MOCK API CALL
    setTimeout(() => {
      setAvailableSources([
        { id: 1, name: "Naver News Standard", trustScore: 98 },
        { id: 2, name: "Wikipedia (Official)", trustScore: 85 },
        { id: 3, name: "Government Data Portal", trustScore: 99 },
        { id: 4, name: "Community Blogs (Low Trust)", trustScore: 40 },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  // 2. Toggle chọn source
  const toggleSource = (id) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 3. Verify: Lấy nội dung web + Source đã chọn -> Gửi API
  const verifyPageContent = async () => {
    setIsLoading(true);

    // Bước A: Lấy nội dung trang hiện tại
    const pageText = getPageContent();

    // --- DEBUG START: KIỂM TRA SCRAPER ---
    console.group("🕵️ DEBUG: SCRAPER RESULT");
    console.log("1. Độ dài văn bản:", pageText.length, "ký tự");
    console.log(
      "2. Preview (500 ký tự đầu):",
      pageText.substring(0, 500) + "..."
    );
    console.log("3. TOÀN BỘ NỘI DUNG:", pageText);
    console.groupEnd();

    // Tự động tải file .txt về máy để kiểm tra
    try {
      const blob = new Blob([pageText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `scraped_debug_${Date.now()}.txt`; // Tên file có timestamp
      document.body.appendChild(link);
      // link.click();
      document.body.removeChild(link);
      console.log("✅ Đã tải file debug về máy!");
    } catch (e) {
      console.error("Không thể tải file debug:", e);
    }
    // --- DEBUG END ---

    // Bước B: Gọi API Verify (Mock)
    setTimeout(() => {
      setVerifyResult({
        score: 85,
        summary: "Bài viết này khớp 85% với dữ liệu từ Naver News.",
        flags: ["Có 1 đoạn sai lệch số liệu năm 2023"],
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <ExtensionContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        currentView,
        navigate,
        isLoading,
        availableSources,
        fetchSources,
        selectedSourceIds,
        toggleSource,
        verifyPageContent,
        verifyResult,

        selectedSources,
        setSelectedSources,
        selectedText,
        setSelectedText,

        analysisLogs,
        setAnalysisLogs,
      }}
    >
      {children}
    </ExtensionContext.Provider>
  );
};

// Hook để dùng nhanh ở các component khác
export const useExtension = () => useContext(ExtensionContext);
