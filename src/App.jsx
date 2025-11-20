import React, { useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import { ExtensionProvider, useExtension } from "./context/ExtensionContext";

// Import các màn hình con
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SourceSelect from "./components/SourceSelect";
import VerifyResult from "./components/VerifyResult";

import { GlassCard } from "@developer-hub/liquid-glass";

import { motion } from "framer-motion";

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

// App Shell: Chứa Button Trigger và Dialog Overlay
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(true);

  return (
    <ExtensionProvider>
      {/* Bọc toàn bộ App trong Provider để chia sẻ state */}

      <div className="font-sans text-gray-900">
        {/* Floating Trigger Button */}
        <div className="fixed top-5 right-5 z-[2147483647]">
          <motion.div
            whileTap={{ scale: 0.9 }}
            // Giữ nguyên hiệu ứng xuất hiện từ bên phải
            initial={{ x: 100, y: -60, opacity: 0 }}
            animate={{
              x: [-60, 0],
              y: [60, 0],
              opacity: 1,

              // // Hiệu ứng nhẹ, mượt, GPU-friendly
              // scale: [1, 1.04, 1],
              // borderRadius: [
              //   "48% 52% 50% 50% / 50% 48% 52% 50%",
              //   "52% 48% 49% 51% / 49% 51% 48% 52%",
              //   "48% 52% 50% 50% / 50% 48% 52% 50%",
              // ],

              // boxShadow: [
              //   "0 0 8px rgba(255,255,255,0.15)",
              //   "0 0 15px rgba(255,255,255,0.35)",
              //   "0 0 8px rgba(255,255,255,0.15)",
              // ],
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

              // Hiệu ứng glow + scale nhẹ, chạy vô hạn nhưng cực nhẹ CPU
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
          <div
            className="fixed inset-0 bg-transparent z-[2147483646] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="w-full max-w-sm !rounded-xl shadow-2xl relative animate-slide-up max-h-[90vh] overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full">
                <motion.div
                  className="w-full"
                  initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0.9 }}
                  animate={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                  drag
                  dragMomentum={false} // ⛔ tắt trôi inertia
                  dragElastic={0.2} // ⛔ không bị kéo giãn
                  style={{
                    width: "100%",
                    maxWidth: "400px", // ⭐ chống bị thu nhỏ
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    backgroundColor: "transparent",
                    // transform: "translate(-50%, -50%)",
                    cursor: "grab", // ⭐ báo có thể kéo
                    borderRadius: "25px",
                  }}
                  whileTap={{ cursor: "grabbing" }} // ⭐ khi đang kéo
                >
                  <MainContent />
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExtensionProvider>
  );
}

export default App;
