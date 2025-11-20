import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

import { GlassCard } from "@developer-hub/liquid-glass";

export default function VerifyResult() {
  const { verifyPageContent, verifyResult, isLoading, navigate } =
    useExtension();

  // Tự động chạy verify khi component được mount
  useEffect(() => {
    verifyPageContent();
  }, []);

  return (
    <div className="w-full mx-auto overflow-hidden">
      <GlassCard>
        <div className="flex flex-col gap-4 py-5 px-16 text-center items-center w-full box-border">
          <div className="flex items-center border-b pb-2">
            <IconButton size="small" onClick={() => navigate("menu")}>
              ⬅
            </IconButton>
            <Typography
              variant="subtitle1"
              className="text-3xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight"
            >
              Kết quả xác thực
            </Typography>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 box-border">
              <CircularProgress size={30} />
              <span className="text-sm text-gray-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-tight">
                Đang đọc trang web & so sánh...
              </span>
            </div>
          ) : verifyResult ? (
            <div className="flex flex-col gap-3 animate-fade-in">
              {/* Điểm số */}
              <div
                className={`p-4 rounded-lg text-center text-white font-bold text-2xl ${
                  verifyResult.score > 80 ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {verifyResult.score}/100 Score
              </div>

              <Typography variant="body2" className="text-gray-700 italic">
                "{verifyResult.summary}"
              </Typography>

              {/* Danh sách cảnh báo */}
              {verifyResult.flags.map((flag, index) => (
                <Alert severity="warning" key={index} className="text-xs">
                  {flag}
                </Alert>
              ))}
            </div>
          ) : null}
        </div>
      </GlassCard>
    </div>
  );
}
