import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  WarningAmber as WarningIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";

const AnalysisCard = ({ data, index, onDelete }) => {
  if (!data) {
    console.error(
      `❌ LỖI: AnalysisCard nhận được data rỗng tại index ${index}`
    );
    return null; // Không render gì cả, cứu app khỏi bị crash
  }

  // 🕵️ DEBUG: Kiểm tra xem có thuộc tính type không
  if (!data.type) {
    console.warn(
      `⚠️ CẢNH BÁO: Item tại index ${index} thiếu thuộc tính 'type'`,
      data
    );
    // Vẫn cho chạy tiếp nhưng gán fallback để không crash đoạn switch case sau này
  }

  const [expanded, setExpanded] = useState(false);

  // 🎨 Config màu sắc và icon dựa trên type
  // Trong AnalysisCard.js

  const getConfig = (type) => {
    switch (type) {
      case "success":
      case "improvement": // Thêm case này nếu backend trả về improvements
        return {
          color: "#4caf50",
          border: "rgba(76, 175, 80, 0.3)",
          icon: <CheckIcon sx={{ color: "#4caf50" }} />,
        };
      case "error":
      case "conflict": // Thêm case này
        return {
          color: "#f44336",
          border: "rgba(244, 67, 54, 0.3)",
          icon: <ErrorIcon sx={{ color: "#f44336" }} />,
        };
      case "warning":
      case "hallucination": // Thêm case này
        return {
          color: "#ff9800",
          border: "rgba(255, 152, 0, 0.3)",
          icon: <WarningIcon sx={{ color: "#ff9800" }} />,
        };
      default:
        return {
          color: "#2196f3",
          border: "rgba(33, 150, 243, 0.3)",
          icon: <InfoIcon sx={{ color: "#2196f3" }} />,
        };
    }
  };

  const config = getConfig(data.type);
  const displayNumber = index + 1;

  return (
    <Card
      sx={{
        mb: 2,
        background: "rgba(255,255,255,0.6)", // Glass base (tăng opacity chút cho dễ đọc)
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid",
        borderColor: config.border,
        borderRadius: "16px",
        boxShadow: "0 4px 24px -1px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px -2px rgba(0,0,0,0.1)",
          borderColor: config.color,
        },
      }}
    >
      <CardContent sx={{ p: "16px !important" }}>
        {/* --- ROW 1: Icon + Message | Index + Close Button --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
            pb: 1,
            borderBottom: `1px solid ${config.border}`,
          }}
        >
          {/* Left: Icon & Message */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            {config.icon}
            <Typography
              variant="subtitle2"
              sx={{
                color: config.color,
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              {data.title || data.displayMessage} {/* Fallback title */}
            </Typography>
          </Box>

          {/* Right: Index Number & Delete Button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.disabled",
                fontWeight: 600,
                fontFamily: "monospace",
                fontSize: "0.9rem",
              }}
            >
              #{String(displayNumber).padStart(2, "0")}
            </Typography>

            <IconButton
              size="small"
              onClick={() => onDelete(data.id)}
              sx={{
                color: "text.disabled",
                padding: 0,
                ml: 0.5,
                "&:hover": {
                  color: "error.main",
                  bgcolor: "transparent",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Box>
        </Box>

        {/* --- ROW 2: Sentence (New Note Sentence) --- */}
        {data.summary && (
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              fontSize: "0.95rem",
              mb: 1,
              lineHeight: 1.5,
            }}
          >
            {/* Nếu summary dài quá có thể cắt bớt hoặc hiển thị full */}"
            {data.summary.replace(/^"|"$/g, "")}"
          </Typography>
        )}

        {/* --- ROW 3: Reason / Missing Context --- */}
        {/* Chỉ hiển thị nếu có details (với cấu trúc cũ là details, mới là fields khác) 
            Đoạn này tôi map data cũ vào UI mới của bạn */}

        {/* Lấy Reason từ data cũ (thường nằm ở details[0] hoặc property riêng) */}
        <Box sx={{ mb: 1, display: "flex", gap: 1 }}>
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              minWidth: "60px",
            }}
          >
            Analysis:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            {/* Logic fallback để lấy nội dung reason */}
            {data.reason ||
              (data.details &&
                data.details.find((d) => d.source === "Reason")?.content) ||
              "No detailed analysis provided."}
          </Typography>
        </Box>

        {/* --- ROW 4: Suggested Rewrite / Addition --- */}
        <Box
          sx={{
            mb: 1,
            display: "flex",
            gap: 1,
            p: 1,
            borderRadius: "8px",
            bgcolor: "rgba(76, 175, 80, 0.08)", // Xanh nhạt nền
            border: "1px dashed rgba(76, 175, 80, 0.3)",
          }}
        >
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: "#2e7d32", // Xanh đậm hơn cho text
              fontWeight: 700,
              minWidth: "60px",
              pt: 0.2,
            }}
          >
            Suggest:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontSize: "0.875rem",
              fontStyle: "italic",
            }}
          >
            {/* Logic fallback để lấy nội dung suggestion */}
            {data.suggestion ||
              (data.details &&
                data.details.find(
                  (d) =>
                    d.source === "Suggested Addition" ||
                    d.source === "Suggestion" ||
                    d.source === "Correction"
                )?.content) ||
              "No suggestion available."}
          </Typography>
        </Box>

        {/* --- ROW 5: Expandable Sources Toggle --- */}
        {/* Lọc lấy source evidence thật sự (trừ reason/suggestion ra) */}
        {data.details && data.details.some((d) => d.source === "Evidence") && (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  minWidth: 0,
                  p: "2px 8px",
                }}
              >
                {expanded ? "Hide Evidence" : "View Evidence"}
              </Button>
            </Box>

            {expanded && (
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: "8px",
                  bgcolor: "rgba(0,0,0,0.04)",
                }}
              >
                {data.details
                  .filter((d) => d.source === "Evidence")
                  .map((src, i) => (
                    <Typography
                      key={i}
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.secondary",
                        fontFamily: "monospace",
                        mb: 0.5,
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      • {src.content}
                    </Typography>
                  ))}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
