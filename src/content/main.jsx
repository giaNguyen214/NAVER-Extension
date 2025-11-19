import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";

// 1. Import CSS dưới dạng chuỗi text (Vite feature)
import tailwindStyles from "../index.css?inline";

// 2. Import các thứ cần thiết cho MUI trong Shadow DOM
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const rootId = "naver-extension-root";

if (!document.getElementById(rootId)) {
  const rootElement = document.createElement("div");
  rootElement.id = rootId;
  // Style cho container gốc nằm đè lên trang web (z-index cao)
  rootElement.style.position = "fixed";
  rootElement.style.zIndex = "2147483647";
  rootElement.style.top = "0";
  rootElement.style.left = "0";

  document.body.appendChild(rootElement);

  // Tạo Shadow DOM mode open
  const shadowRoot = rootElement.attachShadow({ mode: "open" });

  // 3. Tạo điểm neo để MUI chèn style vào đây (thay vì chèn vào head của web)
  const muiStyleContainer = document.createElement("style");
  shadowRoot.appendChild(muiStyleContainer);

  // 4. Tạo cache của Emotion trỏ vào điểm neo đó
  const cache = createCache({
    key: "mui-css",
    prepend: true,
    container: muiStyleContainer,
  });

  // 5. Chèn Tailwind CSS thủ công vào Shadow DOM
  const tailwindStyleTag = document.createElement("style");
  tailwindStyleTag.textContent = tailwindStyles;
  shadowRoot.appendChild(tailwindStyleTag);

  const root = ReactDOM.createRoot(shadowRoot);

  root.render(
    <React.StrictMode>
      {/* Bọc App trong CacheProvider */}
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </React.StrictMode>
  );
}
