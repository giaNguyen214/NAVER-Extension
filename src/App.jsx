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
            // Chỉ giữ lại hiệu ứng nhấn
            whileTap={{ scale: 0.9 }}
            // 1. SỬA initial: x dương lớn để nó bắt đầu từ ngoài màn hình bên phải
            initial={{ x: 100, y: -60, opacity: 0 }}
            // Trạng thái đích: Hiện ra và chạy hiệu ứng Border (Blob)
            animate={{
              // 2. SỬA animate x: Chạy từ ngoài vào (-60), rồi vòng về sát mép phải (0)
              x: [-60, 0],
              y: [60, 0],
              opacity: 1,

              // Giữ nguyên hiệu ứng border
              borderRadius: [
                "70% 30% 80% 20% / 60% 40% 70% 30%",
                "35% 65% 25% 75% / 65% 35% 75% 25%",
                "80% 20% 60% 40% / 55% 75% 25% 45%",
                "60% 40% 70% 30% / 50% 60% 40% 50%",
              ],
              scale: [0.96, 1.06, 1],
            }}
            // Cấu hình chuyển động riêng biệt (GIỮ NGUYÊN)
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
              borderRadius: {
                duration: 7,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              },
              scale: {
                duration: 7,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              },
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0, // Vẫn là right: 0
              zIndex: 10,
              overflow: "hidden",
              cursor: "pointer",
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
              className="w-full max-w-sm !rounded-xl shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full">
                <MainContent />
              </div>
            </div>
          </div>
        )}
      </div>
    </ExtensionProvider>
  );
}

export default App;
