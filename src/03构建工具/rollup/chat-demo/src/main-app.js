// src/main-app.js
import "./components/home-page.js";
import "./components/chat-app.js";
import "./components/chat-message.js";
import "./components/theme-manager.js";

import "./style/themes.css";

// 初始化应用
document.addEventListener("DOMContentLoaded", () => {
  // 创建并添加主页组件
  const homePage = document.createElement("home-page");
  document.body.appendChild(homePage);

  // 创建并添加主题选择器组件
  const themeManager = document.createElement("theme-manager");
  document.body.appendChild(themeManager);
});
