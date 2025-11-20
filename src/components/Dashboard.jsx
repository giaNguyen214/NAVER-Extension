import React from "react";
import { Button, Typography, Divider } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

// Import Icons
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LogoutIcon from "@mui/icons-material/Logout";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { GlassCard } from "@developer-hub/liquid-glass";

export default function Dashboard() {
  const { navigate, logout } = useExtension();

  // --- HÀM TẮT EXTENSION ---
  const handleTurnOff = () => {
    chrome.storage.local.set({ naverExtensionDisabled: true });

    // Lấy đúng cái ID mà bạn đã định nghĩa trong file main/content
    const rootElement = document.getElementById("naver-extension-root");

    if (rootElement) {
      // Xóa hoàn toàn thẻ chứa Extension khỏi trang web
      rootElement.remove();
    } else {
      // Fallback nếu không tìm thấy (ít khi xảy ra)
      window.location.reload();
    }
  };

  return (
    <div className="w-full mx-auto overflow-hidden rounded-[25px]">
      <GlassCard cornerRadius={25}>
        <div className="flex flex-col items-center text-center w-full gap-5 p-10 box-border rounded-[25px]">
          <Typography
            variant="h6"
            className="text-3xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight"
          >
            Dashboard
          </Typography>

          {/* Menu Chính */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <MenuBtn
              icon={
                <FactCheckIcon fontSize="large" className="text-blue-500" />
              }
              label="Verify Page"
              onClick={() => navigate("source")}
            />
            <MenuBtn
              icon={
                <SummarizeIcon fontSize="large" className="text-purple-500" />
              }
              label="Summarize"
              onClick={() => navigate("summarize")}
            />
          </div>

          <Divider className="!my-1" />

          {/* Menu Hệ thống */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <SystemBtn
              icon={<LogoutIcon />}
              label="Log out"
              color="warning"
              onClick={logout}
            />
            <SystemBtn
              icon={<PowerSettingsNewIcon />}
              label="Turn off Extension"
              color="error"
              onClick={handleTurnOff} // Gọi hàm tắt ở đây
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// Component nút to
const MenuBtn = ({ icon, label, onClick }) => (
  <Button
    fullWidth
    variant="outlined"
    onClick={onClick}
    className="!flex !flex-col !gap-3 !py-6 !rounded-xl !border-gray-200 !text-gray-700 !bg-white/50 hover:!bg-blue-50 hover:!border-blue-200 transition-all shadow-sm !box-border"
  >
    {icon}
    <span className="text-sm font-bold">{label}</span>
  </Button>
);

// Component nút nhỏ
const SystemBtn = ({ icon, label, onClick, color }) => {
  const isError = color === "error";
  return (
    <Button
      fullWidth
      variant="contained"
      onClick={onClick}
      color={color}
      className={`!flex !flex-row !gap-2 !py-3 !shadow-none !normal-case !box-border
    ${
      isError
        ? "!bg-red-50 !bg-opacity-70 !text-red-600 hover:!bg-red-100"
        : "!bg-orange-50 !bg-opacity-70 !text-orange-600 hover:!bg-orange-100"
    }
  `}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Button>
  );
};
