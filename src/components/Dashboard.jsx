import React from "react";
import { Button, Typography, Divider } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

// Import Icons
import FactCheckIcon from "@mui/icons-material/FactCheck";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LogoutIcon from "@mui/icons-material/Logout";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

export default function Dashboard() {
  const { navigate, logout } = useExtension();

  // --- HÀM TẮT EXTENSION ---
  const handleTurnOff = () => {
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
    <div className="flex flex-col gap-5">
      <Typography variant="h6" className="text-center !font-bold text-gray-700">
        Dashboard
      </Typography>

      {/* Menu Chính */}
      <div className="grid grid-cols-2 gap-3">
        <MenuBtn
          icon={<FactCheckIcon fontSize="large" className="text-blue-500" />}
          label="Verify Page"
          onClick={() => navigate("verify")}
        />
        <MenuBtn
          icon={<SummarizeIcon fontSize="large" className="text-purple-500" />}
          label="Summarize"
          onClick={() => navigate("summarize")}
        />
      </div>

      <Divider className="!my-1" />

      {/* Menu Hệ thống */}
      <div className="grid grid-cols-2 gap-3">
        <SystemBtn
          icon={<LogoutIcon />}
          label="Đăng xuất"
          color="warning"
          onClick={logout}
        />
        <SystemBtn
          icon={<PowerSettingsNewIcon />}
          label="Tắt Extension"
          color="error"
          onClick={handleTurnOff} // Gọi hàm tắt ở đây
        />
      </div>
    </div>
  );
}

// Component nút to
const MenuBtn = ({ icon, label, onClick }) => (
  <Button
    variant="outlined"
    onClick={onClick}
    className="!flex !flex-col !gap-3 !py-6 !rounded-xl !border-gray-200 !text-gray-700 !bg-white hover:!bg-blue-50 hover:!border-blue-200 transition-all shadow-sm"
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
      variant="contained"
      onClick={onClick}
      color={color}
      className={`!flex !flex-row !gap-2 !py-3 !shadow-none !normal-case
        ${
          isError
            ? "!bg-red-50 !text-red-600 hover:!bg-red-100"
            : "!bg-orange-50 !text-orange-600 hover:!bg-orange-100"
        }
      `}
    >
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </Button>
  );
};
