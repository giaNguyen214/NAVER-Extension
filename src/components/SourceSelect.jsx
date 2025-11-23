import React from "react";
import { Button, Typography, Chip, Box, CircularProgress } from "@mui/material";
import { useExtension } from "../context/ExtensionContext";

// 🔧 CẤU HÌNH API CHUẨN: Dùng chung 1 domain cho tất cả request để đồng bộ dữ liệu
const API_BASE_URL =
  "https://offerings-afford-adjusted-observations.trycloudflare.com";

export default function SourceSelect() {
  const {
    selectedSources,
    setSelectedSources,
    navigate,
    setAnalysisLogs,
    setShowResultPanel,
  } = useExtension();

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [allSources, setAllSources] = React.useState([]);
  const [isLoadingSources, setIsLoadingSources] = React.useState(true);

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

  // --- API FUNCTIONS ---

  const createNewChatSession = async () => {
    const DEFAULT_SESSION = "chat_session:mock_fallback_id";

    try {
      // Mock logic chọn notebook ngẫu nhiên (giữ nguyên logic của bạn)
      const notebooks = [
        "notebook:x5mhge9y5hqja6hdx3hr",
        "notebook:klm3p8l0munx5vcou7ww",
      ];
      const randomIndex = Math.floor(Math.random() * notebooks.length);
      const notebookId = notebooks[randomIndex];
      const title = `Notebook ${randomIndex + 1} - Main screen verify`;

      const payload = {
        notebook_id: notebookId,
        title,
      };

      // 🔥 SỬA: Dùng chung API_BASE_URL để đảm bảo session tồn tại trên server này
      const res = await fetch(`${API_BASE_URL}/api/chat/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Create Session Failed: ${res.status}`);

      const data = await res.json();

      if (data?.id) {
        return data.id;
      }
      return DEFAULT_SESSION;
    } catch (err) {
      console.error("Error creating chat session:", err);
      return DEFAULT_SESSION;
    }
  };

  function safeJsonParse(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (err1) {
      console.warn("JSON failed, applying auto-fix...");
      let fixed = jsonString.replace(/[“”]/g, '"');
      fixed = fixed.replace(/"(.*?[^\\])"(?!\s*[:,}\]])/g, (match) => {
        return match.replace(/"/g, '\\"');
      });
      try {
        return JSON.parse(fixed);
      } catch (err2) {
        console.error("Auto-fix JSON failed:", err2);
        return {
          conflicts: [],
          improvements: [],
          hallucinations: [],
          summary: "",
        };
      }
    }
  }

  // Trong file SourceSelect.js

  const mockVerifyText = async (text, selectedIds) => {
    console.log("Đang gửi API...", { text, selectedIds });

    try {
      // ... (Giữ nguyên phần gọi API và lấy aiMessage) ...
      // Giả sử đoạn này bạn đã làm đúng như code trước
      // --- 1. Chuẩn bị Context ---
      const sourceIds = selectedIds
        .filter((id) => id.startsWith("source:"))
        .map((id) => ({ id }));

      const noteIds = selectedIds
        .filter((id) => id.startsWith("note:"))
        .map((id) => ({ id }));

      const newSessionId = await createNewChatSession();

      const payload = {
        session_id: newSessionId,
        message: text,
        context: { sources: sourceIds, notes: noteIds },
        model_override: "model:emxe6du3v4125f8ss7ti",
      };

      // --- 2. Gọi API ---
      const res = await fetch(
        "https://offerings-afford-adjusted-observations.trycloudflare.com/api/chat/execute",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("RAW API RESPONSE:", data);

      // --- 3. Lấy message của AI (Tìm kỹ) ---
      let aiMessage = data.messages?.find((m) => m.type === "ai");
      // Fallback: Nếu không tìm thấy bằng type, lấy phần tử cuối cùng (thường là câu trả lời mới nhất)
      if (!aiMessage && data.messages?.length > 0) {
        aiMessage = data.messages[data.messages.length - 1];
      }

      if (!aiMessage || !aiMessage.content) {
        throw new Error("Không tìm thấy nội dung trả lời từ AI.");
      }

      // --- 4. Parse JSON content ---
      const parsed = safeJsonParse(aiMessage.content);
      console.log("PARSED DATA:", parsed); // Dữ liệu gốc từ AI

      // --- 5. MAP DỮ LIỆU (FIXED) ---
      const results = [];

      // Helper function để tạo object chuẩn, tránh undefined
      const createLogItem = (type, item) => {
        if (!item) return null;
        return {
          id: crypto.randomUUID(),
          type: type,
          // Fallback title nếu không có
          title:
            type === "error"
              ? "Mâu thuẫn thông tin"
              : type === "warning"
              ? "Chưa được kiểm chứng"
              : "Gợi ý cải thiện",

          summary: item.new_note_sentence || "Nội dung không xác định",
          reason:
            item.reason || item.missing_context || "Không có lý do cụ thể",
          suggestion:
            item.suggested_rewrite ||
            item.suggested_addition ||
            "Không có gợi ý",

          // Đảm bảo details luôn là mảng
          details: Array.isArray(item.evidence_from_sources)
            ? item.evidence_from_sources.map((ev) => ({
                source: "Evidence",
                content: ev,
              }))
            : [],
        };
      };

      // 5.1. Map Conflicts
      if (Array.isArray(parsed.conflicts)) {
        parsed.conflicts.forEach((item) => {
          const log = createLogItem("error", item);
          if (log) results.push(log);
        });
      }

      // 5.2. Map Hallucinations
      if (Array.isArray(parsed.hallucinations)) {
        parsed.hallucinations.forEach((item) => {
          const log = createLogItem("warning", item); // warning hoặc hallucination
          if (log) results.push(log);
        });
      }

      // 5.3. Map Improvements
      if (Array.isArray(parsed.improvements)) {
        parsed.improvements.forEach((item) => {
          const log = createLogItem("success", item);
          if (log) results.push(log);
        });
      }

      // 5.4. Fallback nếu không có kết quả nào
      if (results.length === 0) {
        results.push({
          id: crypto.randomUUID(),
          type: "success",
          title: "Xác thực thành công",
          summary: "Nội dung chính xác và khớp với tài liệu nguồn.",
          reason: parsed.summary || "Không tìm thấy lỗi nào.",
          suggestion: "Bạn có thể yên tâm sử dụng nội dung này.",
          details: [],
        });
      }

      console.log("MAPPED RESULTS:", results); // Kiểm tra xem mảng này có bị undefined không
      return results;
    } catch (err) {
      console.error("Lỗi Verify:", err);
      return [
        {
          id: crypto.randomUUID(),
          type: "error",
          title: "Lỗi hệ thống",
          summary: "Không thể phân tích phản hồi.",
          reason: err.message,
          details: [],
        },
      ];
    }
  };

  const runVerify = async (text) => {
    setIsProcessing(true);
    try {
      const data = await mockVerifyText(text, selectedSources);
      // Set logs mới lên đầu, giữ logs cũ
      setAnalysisLogs((prev) => [...data, ...prev]);
      setShowResultPanel(true);
    } catch (error) {
      alert("An error occurred while sending the data.");
    }
    setIsProcessing(false);
  };

  const handleContinue = () => {
    // ⚠️ LƯU Ý: window.getSelection chỉ hoạt động đúng nếu UI này inject vào trang.
    // Nếu là popup, cần dùng chrome.scripting hoặc message passing.
    const text = window.getSelection().toString().trim();

    if (!text) {
      alert("Please select the text you want to verify on the screen.");
      return;
    }

    if (selectedSources.length === 0) {
      alert("Please select at least one source.");
      return;
    }

    runVerify(text);
  };

  // --- FETCH DATA EFFECT ---
  React.useEffect(() => {
    let isMounted = true; // 🔥 Prevent memory leak

    const fetchData = async () => {
      setIsLoadingSources(true);
      try {
        const [sourcesRes, notesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/sources`),
          fetch(`${API_BASE_URL}/api/notes`),
        ]);

        if (!sourcesRes.ok || !notesRes.ok) {
          throw new Error("Failed to fetch data sources");
        }

        const sourcesData = await sourcesRes.json();
        const notesData = await notesRes.json();

        if (isMounted) {
          // 🔥 Kiểm tra Array.isArray trước khi map để tránh crash
          const mappedSources = Array.isArray(sourcesData)
            ? sourcesData.map((item) => ({ id: item.id, name: item.title }))
            : [];

          const mappedNotes = Array.isArray(notesData)
            ? notesData.map((note) => ({
                id: note.id,
                name:
                  note.title ??
                  (note.content
                    ? note.content.substring(0, 30) + "..."
                    : "Untitled Note"),
              }))
            : [];

          setAllSources([...mappedSources, ...mappedNotes]);
        }
      } catch (err) {
        console.error("Error fetching sources:", err);
      } finally {
        if (isMounted) setIsLoadingSources(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ... (PHẦN RENDER GIỮ NGUYÊN NHƯ CŨ) ...
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="w-full mx-auto overflow-hidden rounded-[25px]"
    >
      {/* Glassmorphism wrapper */}
      <div className="rounded-[25px] p-6 bg-white/30 border border-white/40 shadow-2xl backdrop-blur-xl text-black">
        <Typography
          variant="h6"
          className="text-center [text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_4px_8px_rgba(0,0,0,0.25)]"
        >
          Select Sources
        </Typography>

        <p className="[text-shadow:0_1px_1px_rgba(0,0,0,0.28),0_3px_6px_rgba(0,0,0,0.22)]">
          Select the documents you want to use to verify the text.
        </p>

        {/* Checkbox list */}
        <Box
          className="mt-4 rounded-2xl backdrop-blur-lg bg-white/40 border border-white/50 max-h-64 overflow-y-auto px-3 py-2 space-y-3"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.5)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(0,0,0,0.8)",
            },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0,0,0,0.5) transparent",
          }}
        >
          {isLoadingSources ? (
            <div className="w-full flex justify-center py-4">
              <CircularProgress size={32} />
            </div>
          ) : (
            allSources.map((file) => (
              <label
                key={file.id}
                className="flex items-center gap-2 text-sm cursor-pointer select-none w-full py-1"
              >
                <input
                  type="checkbox"
                  className="accent-blue-500 cursor-pointer w-5 h-5 shrink-0"
                  checked={selectedSources.includes(file.id)}
                  onChange={() => toggleSource(file.id)}
                />
                <span className="truncate block max-w-[200px]">
                  {file.name}
                </span>
              </label>
            ))
          )}
        </Box>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-2 min-h-[40px] items-start">
          {selectedSources.length === 0 && (
            <span className="text-sm italic opacity-70 [text-shadow:0_0_3px_rgba(0,0,0,1),0_0_8px_rgba(0,0,0,0.7)]">
              No sources selected.
            </span>
          )}

          {selectedSources.map((srcId) => {
            const file = allSources.find((f) => f.id === srcId);
            if (!file) return null;

            const fileName = file.name || "Unknown";
            let color = "!bg-white/80 !text-gray-900";
            if (fileName.endsWith(".md")) color = "!bg-yellow-400 !text-black";
            else if (fileName.endsWith(".html"))
              color = "!bg-green-400 !text-black";
            else if (fileName.endsWith(".pdf"))
              color = "!bg-red-500 !text-white";
            else if (fileName.endsWith(".docx"))
              color = "!bg-blue-500 !text-white";
            else if (fileName.endsWith(".xlsx"))
              color = "!bg-green-600 !text-white";
            else if (fileName.endsWith(".pptx"))
              color = "!bg-orange-500 !text-white";
            else if (fileName.endsWith(".mp4") || fileName.endsWith(".mov"))
              color = "!bg-black !text-white";

            return (
              <Chip
                key={srcId}
                label={fileName}
                onDelete={() => removeChip(srcId)}
                size="medium"
                className={`${color} !font-bold !text-sm`}
                sx={{
                  "&:active": {
                    transform: "none !important",
                    boxShadow: "none !important",
                  },
                  "&:focus": { transform: "none !important" },
                  "&.MuiChip-clickable:hover": { boxShadow: "none !important" },
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
            className="font-bold [text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_3px_6px_rgba(0,0,0,0.25)]"
          >
            ⟵ Back
          </Button>

          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={isProcessing}
            className="!bg-blue-500 hover:!bg-blue-600 !normal-case text-xl !text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.40)]"
          >
            {isProcessing ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
