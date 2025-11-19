const app = document.createElement("iframe");
app.src = chrome.runtime.getURL("content.html");
app.style.position = "fixed";
app.style.top = "0";
app.style.left = "0";
app.style.width = "100%";
app.style.height = "100%";
app.style.border = "none";
app.style.zIndex = "999999999";

document.body.appendChild(app);
