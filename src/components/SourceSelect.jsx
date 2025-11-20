import React from "react";
import { Button, Typography, Chip, Box } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

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
  const { selectedSources, setSelectedSources, navigate } = useExtension();

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
  const mockVerifyText = (text, sourceIds) => {
    return new Promise((resolve) => {
      console.log("Đang gửi API...", { text, sourceIds });

      setTimeout(() => {
        // Giả lập kết quả trả về từ Server
        const mockResult = {
          status: "conflict", // 'verified', 'conflict', 'unknown'
          confidence_score: 0.88,
          summary: "Phát hiện mâu thuẫn giữa nội dung bôi đen và tài liệu gốc.",
          details: [
            {
              source: "article_1.pdf",
              quote: "Doanh thu quý 1 tăng 20% so với cùng kỳ.",
              analysis:
                "Nội dung bạn chọn nói là 'giảm 10%', trái ngược với tài liệu.",
              type: "danger", // Dùng để tô màu đỏ
            },
            {
              source: "report_final.docx",
              quote: "Kế hoạch mở rộng bị hoãn lại.",
              analysis: "Khớp với thông tin trong báo cáo.",
              type: "success", // Dùng để tô màu xanh
            },
          ],
        };
        resolve(mockResult);
      }, 2000); // Giả lập delay 2s
    });
  };

  const handleContinue = async () => {
    // 1. Lấy nội dung text đang được bôi đen trên trình duyệt
    const text = window.getSelection().toString().trim();

    // Validation: Nếu chưa bôi đen thì cảnh báo
    if (!text) {
      alert("Vui lòng bôi đen đoạn văn bản cần kiểm tra trên trang web!");
      return;
    }

    console.log("Text đã chọn:", text);
    console.log("Sources đã chọn:", selectedSources);

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

      // Nếu bạn muốn truyền kết quả này sang trang "verify"
      // Bạn cần sửa navigate để nhận state (nếu router hỗ trợ) hoặc lưu vào Context
      // Ví dụ lưu vào context trước khi chuyển trang:
      // setVerificationResult(data);

      navigate("verify");
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu.");
    }
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
        border border-white/20
        bg-slate-900/20
        backdrop-blur-xl
        shadow-xl
        text-white
      "
      >
        {/* Title */}
        <Typography
          variant="h6"
          className="text-3xl font-bold tracking-tight text-center w-full"
          /* Tăng size chữ lên 4xl */
        >
          Select Sources
          {/* Đã chuyển sang tiếng Anh */}
        </Typography>

        <p className="text-sm font-bold mt-1 w-full text-center">
          {/* Tăng size chữ lên lg */}
          Select the documents you want to use to verify the text.
          {/* Đã chuyển sang tiếng Anh */}
        </p>

        {/* Checkbox list */}
        <Box
          className="
          mt-4 
          rounded-2xl 
          bg-black/5 /* Nền đen NHẸ cho vùng checkbox */
          border border-white/10
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
              className="flex items-center gap-2 text-sm font-bold cursor-pointer select-none"
              /* Tăng size chữ lên lg */
            >
              <input
                type="checkbox"
                className="accent-blue-500 cursor-pointer w-5 h-5" /* Tăng kích thước checkbox */
                checked={selectedSources.includes(file)}
                onChange={() => toggleSource(file)}
              />
              <span className="truncate [-webkit-text-stroke:0.4px_rgba(0,0,0,0.9)]">
                {file}
              </span>
            </label>
          ))}
        </Box>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2 min-h-[40px] items-start">
          {selectedSources.length === 0 && (
            <span className="text-sm font-bold opacity-60 italic [-webkit-text-stroke:0.6px_rgba(0,0,0,0.9)]">
              {/* Tăng size chữ lên lg */}
              No sources selected.
              {/* Đã chuyển sang tiếng Anh */}
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
            className="!text-white !normal-case font-bold text-xl [-webkit-text-stroke:0.6px_rgba(0,0,0,0.9)]"
            /* Tăng size chữ lên xl */
          >
            ⟵ Back
            {/* Đã chuyển sang tiếng Anh */}
          </Button>

          <Button
            variant="contained"
            disabled={selectedSources.length === 0}
            onClick={handleContinue}
            className="!bg-blue-500 hover:!bg-blue-600 !normal-case !font-bold text-xl"
            /* Tăng size chữ lên xl */
          >
            Continue
            {/* Đã chuyển sang tiếng Anh */}
          </Button>
        </div>
      </div>
    </div>
  );
}
