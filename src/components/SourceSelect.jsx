import React from "react";
import { Button, Typography, Chip, Box } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

import GlassAlert from "./GlassAlert";

// TODO: sau này thay bằng list file thật từ server / storage
const AVAILABLE_SOURCES = [
  "article_1.pdf",
  "article_2.pdf",
  "news_2024_01.html",
  "report_final.docx",
  "blog_post_ai.md",
  "project_plan_q1_2024.pdf",
  "marketing_report_march.docx",
  "customer_feedback_summary.html",
  "meeting_minutes_2024_03_15.md",
  "research_paper_ai_ethics.pdf",
  "company_handbook_v2.pdf",
  "financial_statement_q4_2023.xlsx", // Thêm một loại file mới
  "sales_presentation.pptx", // Thêm một loại file mới
  "team_agreement.md",
  "design_specs_v3.pdf",
  "competitor_analysis.docx",
  "press_release_launch.html",
  "legal_memo_copyright.pdf",
  "onboarding_guide.md",
  "security_audit_report.pdf",
];

export default function SourceSelect() {
  const {
    selectedSources,
    setSelectedSources,
    navigate,
    setAnalysisLogs,
    selectedText,
    setShowResultPanel,
  } = useExtension();

  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const showGlassAlert = (msg) => {
    setAlertMessage(msg);
  };

  const toggleSource = (fileName) => {
    if (selectedSources.includes(fileName)) {
      setSelectedSources(selectedSources.filter((s) => s !== fileName));
    } else {
      setSelectedSources([...selectedSources, fileName]);
    }
  };

  const removeChip = (fileName) => {
    setSelectedSources(selectedSources.filter((s) => s !== fileName));
  };

  const handleBack = () => navigate("menu");

  // --- MOCK API FUNCTION ---
  // --- MOCK API FUNCTION (đã sửa theo mockLogs) ---
  const mockVerifyText = (text, sourceIds) => {
    return new Promise((resolve) => {
      console.log("Đang gửi API...", { text, sourceIds });

      setTimeout(() => {
        const mockResult = [
          {
            id: 1,
            type: "success",
            title: "Content verified successfully.",
            summary: `Đoạn văn bạn chọn đã được xác minh: "${text}"`,
          },
          {
            id: 2,
            type: "error",
            title: "Conflicting information detected.",
            summary: "Phát hiện mâu thuẫn giữa nội dung chọn và tài liệu gốc.",
            details: [
              {
                source: "article_1.pdf",
                content:
                  "Tài liệu gốc: 'Doanh thu quý 1 tăng 20%'. Nội dung chọn: 'giảm 10%'.",
              },
              {
                source: "report_final.docx",
                content:
                  "Một số thông tin trùng khớp, một số khác chưa nhất quán.",
              },
            ],
          },
          {
            id: 3,
            type: "error",
            title: "Source mismatch found",
            summary: "Một số dữ liệu không khớp với báo cáo cuối cùng.",
            details: [
              {
                source: "Financial_Report_Q3.pdf",
                content: "Báo cáo gốc: Doanh thu thực tế 4.2 tỷ.",
              },
            ],
          },
          {
            id: 4,
            type: "success",
            title: "Citation Check Passed",
            summary: "Tất cả trích dẫn đều hợp lệ.",
          },
        ];

        resolve(mockResult);
      }, 2000);
    });
  };

  const handleContinue = async () => {
    // 1. Lấy nội dung text đang được bôi đen trên trình duyệt
    const text = window.getSelection().toString().trim();

    // Validation: Nếu chưa bôi đen thì cảnh báo
    if (!text) {
      showGlassAlert("Please select the text you want to verify.");
      return;
    }

    console.log("Text đã chọn:", text);
    console.log("Sources đã chọn:", selectedSources);

    setIsProcessing(true);
    // 2. Gửi API
    try {
      // const response = await fetch("https://api-cua-ban.com/verify", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     selected_text: text, // Text lấy từ màn hình
      //     source_ids: selectedSources, // Mảng các file bạn đã chọn từ state
      //   }),
      // });
      // const data = await response.json();
      const data = await mockVerifyText(selectedText, selectedSources);

      // 3. Xử lý kết quả và chuyển trang
      console.log("Kết quả API:", data);

      setAnalysisLogs((prev) => [...(data.logs || data), ...prev]);
      setShowResultPanel(true);

      // Nếu bạn muốn truyền kết quả này sang trang "verify"
      // Bạn cần sửa navigate để nhận state (nếu router hỗ trợ) hoặc lưu vào Context
      // Ví dụ lưu vào context trước khi chuyển trang:
      // setVerificationResult(data);

      // navigate("verify");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      showGlassAlert("An error occurred while sending the data.");
    }
    setIsProcessing(false);
  };

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="w-full mx-auto overflow-hidden rounded-[25px]"
    >
      {/* Glassmorphism wrapper */}
      <div
        className="
        rounded-[25px]
        p-6
        bg-white/30
        border border-white/40
        shadow-2xl
        backdrop-blur-xl
        text-black
      "
      >
        {/* Title */}
        <Typography
          variant="h6"
          className="
            text-center
            [text-shadow:
              0_1px_2px_rgba(0,0,0,0.35),
              0_4px_8px_rgba(0,0,0,0.25)
            ]
          "
        >
          Select Sources
        </Typography>

        <p
          className="
            [text-shadow:
              0_1px_1px_rgba(0,0,0,0.28),
              0_3px_6px_rgba(0,0,0,0.22)
            ]
          "
        >
          Select the documents you want to use to verify the text.
        </p>

        {/* Checkbox list */}
        <Box
          className="
          mt-4 
          rounded-2xl
          backdrop-blur-lg 
          bg-white/40 /* Nền đen NHẸ cho vùng checkbox */
          border border-white/50
          max-h-64 /* Tăng chiều cao để chứa nhiều mục hơn */
          overflow-y-auto 
          px-3 py-2 
          space-y-3 /* Tăng khoảng cách giữa các mục */
        "
          sx={{
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
          {AVAILABLE_SOURCES.map((file) => (
            <label
              key={file}
              className="flex items-center gap-2 text-sm cursor-pointer select-none"
              /* Tăng size chữ lên lg */
            >
              <input
                type="checkbox"
                className="accent-blue-500 cursor-pointer w-5 h-5" /* Tăng kích thước checkbox */
                checked={selectedSources.includes(file)}
                onChange={() => toggleSource(file)}
              />
              <span
                className="
                  truncate
                "
              >
                {file}
              </span>
            </label>
          ))}
        </Box>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2 min-h-[40px] items-start">
          {selectedSources.length === 0 && (
            <span
              className="
                text-sm  italic opacity-70
                [text-shadow:
                  0_0_3px_rgba(0,0,0,1),
                  0_0_8px_rgba(0,0,0,0.7)
                ]
              "
            >
              No sources selected.
            </span>
          )}

          {selectedSources.map((src) => {
            let color = "!bg-white/80 !text-gray-900";

            // Thêm xử lý cho các loại file mới
            if (src.endsWith(".md")) {
              color = "!bg-yellow-400 !text-black"; // markdown
            } else if (src.endsWith(".html")) {
              color = "!bg-green-400 !text-black"; // link
            } else if (src.endsWith(".pdf")) {
              color = "!bg-red-500 !text-white"; // pdf
            } else if (src.endsWith(".docx")) {
              color = "!bg-blue-500 !text-white"; // docx
            } else if (src.endsWith(".xlsx")) {
              // Thêm màu cho Excel
              color = "!bg-green-600 !text-white";
            } else if (src.endsWith(".pptx")) {
              // Thêm màu cho PowerPoint
              color = "!bg-orange-500 !text-white";
            } else if (src.endsWith(".mp4") || src.endsWith(".mov")) {
              color = "!bg-black !text-white"; // video (nếu có, nhưng không có trong danh sách hiện tại)
            }

            return (
              <Chip
                key={src}
                label={src}
                onDelete={() => removeChip(src)}
                size="medium" /* Tăng kích thước chip */
                className={`${color} !font-bold !text-sm`} /* Thêm font bold và text-sm để chip không quá to */
                sx={{
                  // Vô hiệu hóa hiệu ứng nhích xuống khi nhấn giữ (active state)
                  "&:active": {
                    // Loại bỏ transform hoặc box-shadow thay đổi vị trí
                    transform: "none !important",
                    boxShadow: "none !important",
                  },
                  // Đảm bảo trạng thái focus cũng không gây nhích
                  "&:focus": {
                    transform: "none !important",
                  },
                  // Đôi khi cần đặt box-shadow về trạng thái bình thường khi hover/focus
                  "&.MuiChip-clickable:hover": {
                    boxShadow: "none !important",
                  },
                  "&.MuiChip-clickable:focusVisible": {
                    boxShadow: "none !important",
                  },
                }}
              />
            );
          })}
        </div>

        {/* Footer buttons */}
        <div className="mt-5 flex justify-between gap-3">
          <Button
            variant="text"
            onClick={handleBack}
            className="
 font-bold
  [text-shadow:
    0_1px_2px_rgba(0,0,0,0.35),
    0_3px_6px_rgba(0,0,0,0.25)
  ]
"
          >
            ⟵ Back
          </Button>

          <Button
            variant="contained"
            disabled={selectedSources.length === 0}
            onClick={handleContinue}
            className="
              !bg-blue-500 hover:!bg-blue-600
              !normal-case  text-xl !text-white
              [text-shadow:
                0_1px_2px_rgba(0,0,0,0.40)
              ]
            "
          >
            {isProcessing ? "processing..." : "Continue"}
          </Button>
        </div>
        {alertMessage && (
          <GlassAlert
            message={alertMessage}
            onClose={() => setAlertMessage(null)}
          />
        )}
      </div>
    </div>
  );
}
