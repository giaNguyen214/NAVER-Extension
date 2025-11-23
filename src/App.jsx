import React, { useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import { ExtensionProvider, useExtension } from "./context/ExtensionContext";
import AnalysisCard from "./components/AnalysisCard";
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

// utils.ts hoặc để bên ngoài component

function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (err1) {
    console.warn("JSON failed, applying auto-fix...");
    let fixed = jsonString.replace(/[“”]/g, '"');
    fixed = fixed.replace(/"(.*?[^\\])"(?!\s*[:,}\]])/g, (match) => {
      return match.replace(/"/g, '\\"');
    });
    try {
      return JSON.parse(fixed);
    } catch (err2) {
      console.error("Auto-fix JSON failed:", err2);
      return {
        conflicts: [],
        improvements: [],
        hallucinations: [],
        summary: "",
      };
    }
  }
}

const AnalysisHistory = () => {
  const [analysisLogs, setAnalysisLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        // 👇 Thay bằng Session ID thực tế của bạn hoặc lấy từ params/context
        const sessionId = "chat_session:9cikcp23p2itm1npo4jq";

        // Lưu ý: Nếu web bạn chạy HTTPS mà gọi HTTP này sẽ bị lỗi Mixed Content.
        // Nên dùng chung domain API như bên SourceSelect nếu có thể.
        const response = await fetch(
          `https://offerings-afford-adjusted-observations.trycloudflare.com/api/chat/sessions/${sessionId}`
        );

        const data = await response.json();

        if (!isMounted) return;

        // Tìm message type "ai"
        let aiMessage = data.messages?.find((msg) => msg.type === "ai");

        // Fallback: Lấy tin nhắn cuối cùng nếu không tìm thấy type='ai'
        if (!aiMessage && data.messages?.length > 0) {
          aiMessage = data.messages[data.messages.length - 1];
        }

        if (!aiMessage) return;

        // Parse JSON
        const parsed = safeJsonParse(aiMessage.content);
        const newLogs = [];

        // --- MAPPING LOGIC (Đã chuẩn hóa cho AnalysisCard mới) ---

        // 1. Conflicts (Mâu thuẫn)
        if (parsed.conflicts) {
          parsed.conflicts.forEach((item) => {
            newLogs.push({
              id: crypto.randomUUID(),
              type: "error",
              title: "Detected Contradiction",
              summary: item.new_note_sentence,
              // Map thẳng vào properties cấp 1 để Card dễ đọc
              reason: item.reason,
              suggestion: item.suggested_rewrite,
              // Evidence đưa vào details
              details: (item.evidence_from_sources || []).map((ev) => ({
                source: "Evidence",
                content: ev,
              })),
            });
          });
        }

        // 2. Hallucinations (Ảo giác)
        if (parsed.hallucinations) {
          parsed.hallucinations.forEach((item) => {
            newLogs.push({
              id: crypto.randomUUID(),
              type: "warning", // Map sang màu cam
              title: "Unverified Info",
              summary: item.new_note_sentence,
              reason: item.reason,
              suggestion: item.suggested_rewrite,
              details: [],
            });
          });
        }

        // 3. Improvements (Gợi ý)
        if (parsed.improvements) {
          parsed.improvements.forEach((item) => {
            newLogs.push({
              id: crypto.randomUUID(),
              type: "success",
              title: "Context Suggestion",
              summary: item.new_note_sentence,
              reason: item.missing_context,
              suggestion: item.suggested_addition,
              details: [],
            });
          });
        }

        setAnalysisLogs(newLogs);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
      {loading && (
        <div className="text-center text-gray-500 py-4">Loading history...</div>
      )}

      {/* 👇 QUAN TRỌNG: Render đúng chuẩn mới */}
      {analysisLogs.map((log, index) => (
        <AnalysisCard
          key={log.id}
          data={log} // ✅ Truyền object data
          index={index} // ✅ Truyền index
          onDelete={(
            id // ✅ Hàm xóa
          ) => setAnalysisLogs((prev) => prev.filter((x) => x.id !== id))}
        />
      ))}

      {!loading && analysisLogs.length === 0 && (
        <div className="text-center text-gray-400 text-sm italic">
          No analysis logs found.
        </div>
      )}

      <div className="h-4"></div>
    </div>
  );
};
// Component con để hiển thị từng thẻ log (Xử lý đóng mở riêng biệt)

// const AnalysisCard = ({ type, title, summary, details, onDelete }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Định nghĩa style dựa trên type
//   const styles = {
//     success: {
//       bg: "bg-green-50/60 border-green-200 hover:bg-green-50/80",
//       iconColor: "text-green-600",
//       titleColor: "text-green-900",
//       path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Check icon
//     },
//     error: {
//       bg: "bg-red-50/60 border-red-200 hover:bg-red-50/80",
//       iconColor: "text-red-600",
//       titleColor: "text-red-900",
//       path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", // Warning Triangle
//     },
//     warning: {
//       bg: "bg-amber-50/60 border-amber-200 hover:bg-amber-50/80",
//       iconColor: "text-amber-600",
//       titleColor: "text-amber-900",
//       path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Info/Alert icon
//     },
//   };

//   // Fallback về error nếu type lạ
//   const currentStyle = styles[type] || styles.error;

//   return (
//     <div
//       className={`
//         relative p-4 rounded-2xl transition-all duration-200
//         border shadow-sm hover:shadow-md
//         backdrop-blur-md
//         ${currentStyle.bg}
//       `}
//     >
//       <button
//         onClick={onDelete}
//         className="
//           absolute top-2 right-2
//           w-6 h-6 flex items-center justify-center
//           rounded-full
//           bg-white/50 hover:bg-white/80
//           text-gray-700 hover:text-red-600
//           shadow transition z-10
//         "
//       >
//         ✕
//       </button>

//       <div className="flex items-start gap-3">
//         <div className="shrink-0 mt-1">
//           <svg
//             className={`w-6 h-6 ${currentStyle.iconColor}`}
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d={currentStyle.path}
//             />
//           </svg>
//         </div>

//         <div className="w-full min-w-0">
//           <h4 className={`font-bold text-sm ${currentStyle.titleColor}`}>
//             {title}
//           </h4>

//           {/* Summary Text */}
//           <div className="text-sm text-slate-800 mt-1 leading-relaxed select-text cursor-text font-medium break-words">
//             {summary}
//           </div>

//           {/* Details Section */}
//           {details && details.length > 0 && (
//             <>
//               {isExpanded && (
//                 <div className="mt-4 pt-3 border-t border-black/5 text-xs text-slate-700 space-y-3 select-text animate-fade-in">
//                   {details.map((item, idx) => (
//                     <div key={idx} className="leading-relaxed">
//                       <span
//                         className={`font-bold uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded mr-1
//                         ${
//                           type === "success"
//                             ? "bg-green-200 text-green-800"
//                             : "bg-red-200 text-red-800"
//                         }`}
//                       >
//                         {item.source}
//                       </span>
//                       <span className="text-slate-900 block mt-1 pl-1 border-l-2 border-black/10">
//                         {item.content}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="flex justify-end mt-2">
//                 <button
//                   onClick={() => setIsExpanded(!isExpanded)}
//                   className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors select-none"
//                 >
//                   {isExpanded ? "Hide details" : "Show details"}
//                   <span
//                     className={`transition-transform duration-200 ${
//                       isExpanded ? "rotate-180" : ""
//                     }`}
//                   >
//                     ▼
//                   </span>
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// --------------------------------------------------------------
// 🔥🔥🔥 NEW SECTION: AppInner (chứa toàn bộ UI của bạn)
// --------------------------------------------------------------

function AppInner() {
  const [isOpen, setIsOpen] = useState(false);
  // const [showResultPanel, setShowResultPanel] = useState(false);

  const { analysisLogs, setAnalysisLogs, showResultPanel, setShowResultPanel } =
    useExtension();

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
                          hover:bg-red-500 
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
                              ? "bg-blue-400 text-white"
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
                            {analysisLogs.map((log, index) => (
                              <AnalysisCard
                                key={log.id || index} // Fallback key nếu id lỗi
                                // 🔥 QUAN TRỌNG NHẤT: Truyền cả cục object vào prop 'data'
                                data={log}
                                // 🔥 QUAN TRỌNG NHÌ: Truyền index để hiện số thứ tự (#01, #02)
                                index={index}
                                onDelete={(id) =>
                                  setAnalysisLogs((prev) =>
                                    prev.filter((x) => x.id !== id)
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
