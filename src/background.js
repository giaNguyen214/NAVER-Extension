// src/background.js

// Lắng nghe sự kiện click vào icon extension trên thanh browser
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs
      .sendMessage(tab.id, { action: "TOGGLE_EXTENSION" })
      .catch((error) => {
        // Bỏ qua lỗi nếu tab đó chưa load xong content script
        console.log("Extension chưa sẵn sàng trên tab này", error);
      });
  }
});
