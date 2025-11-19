import { Readability } from "@mozilla/readability";

export const getPageContent = () => {
  try {
    // 1. XỬ LÝ ĐẶC BIỆT CHO GITHUB (Vì Readability hay bỏ qua code block)
    if (window.location.hostname.includes("github.com")) {
      return scrapeGithub();
    }

    // 2. XỬ LÝ CÁC TRANG TIN TỨC/BLOG (Medium, Báo chí...)
    // Tạo bản sao của document để không ảnh hưởng trang hiện tại
    const documentClone = document.cloneNode(true);

    // Dùng thư viện Readability để lọc nội dung chính
    const reader = new Readability(documentClone);
    const article = reader.parse();

    if (article && article.textContent) {
      // article.textContent chứa nội dung text thuần đã lọc sạch
      return cleanText(article.textContent);
    }

    // 3. FALLBACK: Nếu Readability bó tay thì dùng cách cũ nhưng thông minh hơn
    return scrapeFallback();
  } catch (error) {
    console.error("Scraper Error:", error);
    return "";
  }
};

// --- CÁC HÀM PHỤ TRỢ ---

// Logic riêng để lấy code từ GitHub sạch sẽ
const scrapeGithub = () => {
  // GitHub thường để code trong thẻ table hoặc textarea
  const codeBody = document.querySelector(
    "table.highlight, .blob-wrapper, .Box-body"
  );
  if (codeBody) {
    return cleanText(codeBody.innerText);
  }
  // Nếu không phải trang view code mà là trang README
  const readme = document.querySelector(".markdown-body");
  if (readme) {
    return cleanText(readme.innerText);
  }
  return scrapeFallback();
};

// Cách lấy thủ công (Fallback) nhưng loại bỏ bớt rác
const scrapeFallback = () => {
  const clone = document.body.cloneNode(true);

  // Xóa các thẻ rác phổ biến
  const junkSelectors = [
    "script",
    "style",
    "noscript",
    "iframe",
    "svg",
    "nav",
    "footer",
    "header",
    "aside",
    ".sidebar",
    ".menu",
    ".ad",
    ".advertisement",
    "#comments",
  ];

  junkSelectors.forEach((selector) => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach((el) => el.remove());
  });

  return cleanText(clone.innerText || clone.textContent);
};

// Hàm dọn dẹp văn bản: Xóa dòng trống thừa, trim
const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/\n\s+\n/g, "\n") // Xóa các dòng trắng có chứa dấu cách
    .replace(/\n{3,}/g, "\n\n") // Giới hạn tối đa 2 dòng xuống hàng liên tiếp
    .replace(/\t/g, " ") // Đổi tab thành space
    .trim();
};
