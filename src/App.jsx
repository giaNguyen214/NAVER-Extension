import React, { useState } from "react";
import { Button, Card, CardContent } from "@mui/material";
import { ExtensionProvider, useExtension } from "./context/ExtensionContext";

// Import các màn hình con
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import SourceSelect from "./components/SourceSelect";
import VerifyResult from "./components/VerifyResult";

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ExtensionProvider>
      {/* Bọc toàn bộ App trong Provider để chia sẻ state */}

      <div className="font-sans text-gray-900">
        {/* Floating Trigger Button */}
        <div className="fixed top-5 left-5 z-[2147483647]">
          <Button
            variant="contained"
            onClick={() => setIsOpen(!isOpen)}
            className="!rounded-full !w-14 !h-14 !min-w-0 !shadow-lg !text-2xl !bg-blue-600"
          >
            {isOpen ? "✖" : "🚀"}
          </Button>
        </div>

        {/* Dialog Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[2147483646] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setIsOpen(false)}
          >
            <Card
              className="w-full max-w-sm !rounded-xl shadow-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent className="!p-6">
                <MainContent />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ExtensionProvider>
  );
}

export default App;
