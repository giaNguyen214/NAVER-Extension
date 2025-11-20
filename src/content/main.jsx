import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";
import tailwindStyles from "../index.css?inline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const rootId = "naver-extension-root";

// 1. Hàm khởi tạo App (Mount)
function mountApp() {
  // Nếu đã tồn tại thì không tạo lại
  if (document.getElementById(rootId)) return;

  const rootElement = document.createElement("div");
  rootElement.id = rootId;

  // Style cố định
  rootElement.style.position = "fixed";
  rootElement.style.zIndex = "2147483647";
  rootElement.style.top = "0";
  rootElement.style.left = "0";

  document.body.appendChild(rootElement);

  // Shadow DOM Setup
  const shadowRoot = rootElement.attachShadow({ mode: "open" });
  const muiStyleContainer = document.createElement("style");
  shadowRoot.appendChild(muiStyleContainer);

  const cache = createCache({
    key: "mui-css",
    prepend: true,
    container: muiStyleContainer,
  });

  const tailwindStyleTag = document.createElement("style");
  tailwindStyleTag.textContent = tailwindStyles;
  shadowRoot.appendChild(tailwindStyleTag);

  const root = ReactDOM.createRoot(shadowRoot);

  root.render(
    <React.StrictMode>
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </React.StrictMode>
  );
}

// 2. Chạy hàm mount lần đầu khi load trang
mountApp();

// 3. Lắng nghe sự kiện từ Background (khi bấm Icon)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TOGGLE_EXTENSION") {
    const existingRoot = document.getElementById(rootId);

    if (existingRoot) {
      // Nếu đang hiện -> Thì thôi (hoặc thích thì toggle tắt đi)
      console.log("Extension đang chạy.");
    } else {
      // Nếu đã bị tắt -> Bật lại
      mountApp();
    }
  }
});
