import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";
import tailwindStyles from "../index.css?inline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const rootId = "naver-extension-root";

// 1. Hàm khởi tạo App (Mount)
function mountApp() {
  if (document.getElementById(rootId)) return;

  const rootElement = document.createElement("div");
  rootElement.id = rootId;

  rootElement.style.position = "fixed";
  rootElement.style.zIndex = "2147483647";
  rootElement.style.top = "0";
  rootElement.style.left = "0";

  document.body.appendChild(rootElement);

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

// ⛔ CHỈ 1 BLOCK KIỂM TRA — KHÔNG ĐƯỢC NHÂN ĐÔI
chrome.storage.local.get("naverExtensionDisabled", (data) => {
  if (!data.naverExtensionDisabled) {
    mountApp();
  } else {
    console.log("🚫 NAVER Extension disabled — not injecting.");
  }
});

// 3. ALWAYS listen for toggle event
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "TOGGLE_EXTENSION") {
    chrome.storage.local.get("naverExtensionDisabled", (d) => {
      if (d.naverExtensionDisabled) {
        // OFF → Turn ON
        chrome.storage.local.set({ naverExtensionDisabled: false });
        mountApp();
      } else {
        // ON → Turn OFF
        chrome.storage.local.set({ naverExtensionDisabled: true });
        const root = document.getElementById(rootId);
        if (root) root.remove();
      }
    });
  }
});
