import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

export default function VerifyResult() {
  const { verifyPageContent, verifyResult, isLoading, navigate } =
    useExtension();

  // Tự động chạy verify khi component được mount
  useEffect(() => {
    verifyPageContent();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center border-b pb-2">
        <IconButton size="small" onClick={() => navigate("menu")}>
          ⬅
        </IconButton>
        <Typography variant="subtitle1" className="font-bold">
          Kết quả xác thực
        </Typography>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <CircularProgress size={30} />
          <span className="text-sm text-gray-500">
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

          <Button
            variant="outlined"
            onClick={() => navigate("menu")}
            className="mt-2"
          >
            Về trang chủ
          </Button>
        </div>
      ) : null}
    </div>
  );
}
