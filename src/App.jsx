import React, { useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import { ExtensionProvider, useExtension } from "./context/ExtensionContext";

// Import các màn hình con
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SourceSelect from "./components/SourceSelect";
import VerifyResult from "./components/VerifyResult";

import { GlassCard } from "@developer-hub/liquid-glass";

import { motion, AnimatePresence } from "framer-motion"; // Import thêm AnimatePresence

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

// Component điều hướng nội dung bên trong dialog
const MainContent = () => {
  const { isLoggedIn, currentView } = useExtension();

  if (!isLoggedIn) return <Login />;

  switch (currentView) {
    case "source":
      return <SourceSelect />;
    case "verify":
      return <VerifyResult />;
    case "menu":
    default:
      return <Dashboard />;
  }
};

// Component con để hiển thị từng thẻ log (Xử lý đóng mở riêng biệt)
const AnalysisCard = ({ type, title, summary, details, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSuccess = type === "success";

  return (
    <div
      className={`
        relative p-4 rounded-2xl transition-all duration-200
        border shadow-sm hover:shadow-md
        /* GIẢM OPACITY BACKGROUND XUỐNG CÒN 40% - 50% ĐỂ THẤY NỀN SAU */
        ${
          isSuccess
            ? "bg-white/40 border-green-100 hover:bg-white/60"
            : "bg-white/40 border-red-100 hover:bg-white/60"
        }
        backdrop-blur-md /* Blur nội dung phía sau thẻ */
      `}
    >
      <button
        onClick={onDelete}
        className="
          absolute top-2 right-2
          w-6 h-6 flex items-center justify-center
          rounded-full
          bg-white/50 hover:bg-white/80
          text-gray-700 hover:text-red-600
          shadow
          transition
        "
      >
        ✕
      </button>

      {/* ... Giữ nguyên nội dung bên trong ... */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">
          {isSuccess ? (
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>

        <div className="w-full min-w-0">
          <h4
            className={`font-bold text-sm ${
              isSuccess ? "text-green-900" : "text-red-900"
            }`}
          >
            {title}
          </h4>
          <div className="text-sm text-slate-800 mt-1 leading-relaxed select-text cursor-text font-medium">
            {summary}
          </div>

          {!isSuccess && details && (
            <>
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-red-100/50 text-xs text-slate-700 space-y-2 select-text animate-fade-in">
                  {details.map((item, idx) => (
                    <p key={idx} className="leading-relaxed">
                      <span className="font-bold text-slate-900">
                        • {item.source}:
                      </span>{" "}
                      {item.content}
                    </p>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors select-none"
                >
                  {isExpanded ? "Hide sources" : "Show sources"}
                  <span
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------
// 🔥🔥🔥 NEW SECTION: AppInner (chứa toàn bộ UI của bạn)
// --------------------------------------------------------------

function AppInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showResultPanel, setShowResultPanel] = useState(false);

  const { analysisLogs, setAnalysisLogs } = useExtension();

  return (
    <div className="font-sans text-gray-900">
      {/* Floating Trigger Button - GIỮ NGUYÊN CODE CŨ */}
      <div className="fixed top-5 right-5 z-[2147483647]">
        <motion.div
          whileTap={{ scale: 0.9 }}
          initial={{ x: 100, y: -60, opacity: 0 }}
          animate={{
            x: [-60, 0],
            y: [60, 0],
            opacity: 1,
          }}
          transition={{
            x: {
              duration: 3,
              times: [0.4, 1],
              ease: "easeInOut",
            },
            y: {
              duration: 3,
              times: [0.4, 1],
              ease: "easeInOut",
            },
            opacity: { duration: 1 },
            boxShadow: {
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            },
            scale: {
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            },
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            overflow: "hidden",
            cursor: "pointer",
            borderRadius: "52% 48% 55% 45% / 48% 55% 45% 52%",
          }}
        >
          <GlassCard onClick={() => setIsOpen(!isOpen)} cornerRadius={100}>
            <div className="h-12 w-12 relative">
              <img
                src={chrome.runtime.getURL("assets/sun3.png")}
                alt="Bubble"
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent z-[2147483646] flex items-center justify-center p-4 animate-fade-in pointer-events-none">
          <div
            className="w-full shadow-2xl relative animate-slide-up max-h-[90vh] overflow-visible pointer-events-auto transition-[max-width] duration-500 ease-in-out"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: showResultPanel ? "850px" : "400px",
            }}
          >
            <div className="w-full">
              <motion.div
                className="w-full"
                initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.9 }}
                animate={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                drag={!showResultPanel}
                dragMomentum={false}
                dragElastic={0.2}
                style={{
                  width: "100%",
                  maxWidth: showResultPanel ? "850px" : "400px",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  backgroundColor: "transparent",
                  cursor: showResultPanel ? "default" : "grab",
                  borderRadius: "25px",
                }}
                whileTap={!showResultPanel ? { cursor: "grabbing" } : {}}
              >
                <div className="flex flex-row items-start gap-4">
                  {/* === PHẦN 1: MENU CŨ (Giữ nguyên cấu trúc) === */}
                  <div
                    className="relative w-full shrink-0"
                    style={{ width: "400px" }}
                  >
                    <button
                      onClick={() => setIsOpen(false)}
                      className="
                          absolute 
                          top-3 left-3
                          bg-white 
                          text-black 
                          rounded-full 
                          w-7 h-7 
                          flex 
                          items-center justify-center 
                          shadow-lg 
                          hover:bg-gray-300 
                          z-50
                          cursor-pointer"
                    >
                      ✕
                    </button>

                    <button
                      onClick={() => setShowResultPanel(!showResultPanel)}
                      className={`
                          absolute 
                          top-3 right-3
                          w-7 h-7 
                          rounded-full 
                          flex items-center justify-center 
                          shadow-lg 
                          z-50 
                          cursor-pointer 
                          transition-colors duration-200
                          ${
                            showResultPanel
                              ? "bg-blue-600 text-white"
                              : "bg-white text-black hover:bg-gray-200"
                          }
                        `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                      </svg>
                    </button>

                    <MainContent />
                  </div>

                  {/* === PHẦN 2: RESULT PANEL — GLASSMORPHISM CHUẨN === */}
                  <AnimatePresence>
                    {showResultPanel && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0"
                        style={{ width: "380px" }}
                      >
                        <div
                          className="
                              w-full h-full
                              bg-white/10
                              border border-white/20
                              shadow-[0_8px_20px_rgba(0,0,0,0.15)]
                              [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.15)]
                              bg-gradient-to-br from-white/10 via-white/5 to-transparent
                              rounded-[28px]
                              flex flex-col overflow-hidden
                              backdrop-blur-[40px]
                              backdrop-saturate-200
                            "
                          style={{
                            minHeight: "600px",
                            maxHeight: "80vh",
                            "&::-webkit-scrollbar": {
                              width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "rgba(0,0,0,0.5)",
                              borderRadius: "3px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "rgba(0,0,0,0.8)",
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "transparent",
                            },
                            scrollbarWidth: "thin", // Firefox
                            scrollbarColor: "rgba(0,0,0,0.5) transparent",
                          }}
                        >
                          <div
                            className="
                                p-5 
                                flex items-center gap-3
                                border-b border-white/20
                                bg-white/0
                              "
                          >
                            <div className="bg-white/20 p-2 rounded-xl shadow-sm text-slate-900 backdrop-blur-sm">
                              <Inventory2RoundedIcon
                                fontSize="small"
                                className="opacity-80"
                              />
                            </div>

                            <h3 className="font-extrabold text-lg text-slate-900 drop-shadow">
                              AI Analysis Log
                            </h3>
                          </div>

                          {/* Body ― cũng KHÔNG có nền riêng */}
                          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                            {analysisLogs.map((log) => (
                              <AnalysisCard
                                key={log.id}
                                type={log.type}
                                title={log.title}
                                summary={log.summary}
                                details={log.details}
                                onDelete={() =>
                                  setAnalysisLogs((prev) =>
                                    prev.filter((x) => x.id !== log.id)
                                  )
                                }
                              />
                            ))}
                            <div className="h-4"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------
// 🔥🔥🔥 FINAL EXPORT: App chỉ bọc Provider
// --------------------------------------------------------------

function App() {
  return (
    <ExtensionProvider>
      <AppInner />
    </ExtensionProvider>
  );
}

export default App;
