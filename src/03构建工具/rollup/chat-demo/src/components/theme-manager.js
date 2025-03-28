// src/components/theme-manager.js
class ThemeManager extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isExpanded = true;
    this.themes = [
      { name: "neumorphism", label: "新拟态", color: "#e0e5ec" },
      { name: "dark", label: "暗黑", color: "#2c3e50" },
      { name: "candy", label: "粉色", color: "#fce4ec" },
      { name: "minimal", label: "极简", color: "#ffffff" },
      { name: "tech", label: "科技", color: "#1a1a1a" },
      { name: "retro", label: "复古", color: "#f4d03f" },
      { name: "nature", label: "自然", color: "#e8f5e9" },
      { name: "cyberpunk", label: "赛博朋克", color: "#000000" },
      { name: "ocean", label: "海洋", color: "#e3f2fd" },
      { name: "accessible", label: "无障碍", color: "#ffffff" },
    ];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // 从本地存储加载主题
    const savedTheme = localStorage.getItem("theme") || "neumorphism";
    this.setTheme(savedTheme);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        :host {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        .theme-selector {
          background: var(--background, #e0e5ec);
          border-radius: var(--border-radius, 16px);
          box-shadow: 
            4px 4px 8px var(--shadow-dark, #a3b1c6),
            -4px -4px 8px var(--shadow-light, #ffffff);
          padding: 15px;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
          max-height: 500px;
          overflow: hidden;
        }
        .theme-selector.collapsed {
          max-height: 50px;
          overflow: hidden;
        }
        .theme-selector:hover {
          transform: translateY(-2px);
          box-shadow: 
            6px 6px 12px var(--shadow-dark, #a3b1c6),
            -6px -6px 12px var(--shadow-light, #ffffff);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          cursor: pointer;
        }
        h3 {
          margin: 0;
          font-size: 14px;
          color: var(--text-color, #333);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }
        .toggle-btn {
          background: none;
          border: none;
          color: var(--text-color, #333);
          cursor: pointer;
          font-size: 18px;
          padding: 0 5px;
          transition: transform 0.3s ease;
        }
        .toggle-btn.collapsed {
          transform: rotate(180deg);
        }
        .theme-options {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          padding: 5px;
        }
        .theme-option {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            2px 2px 4px var(--shadow-dark, #a3b1c6),
            -2px -2px 4px var(--shadow-light, #ffffff);
          position: relative;
          background: var(--background);
          border: 2px solid transparent;
          transform-origin: center;
          margin: 2px;
        }

        .theme-option:hover {
          transform: scale(1.2);
          box-shadow: 
            4px 4px 8px var(--shadow-dark, #a3b1c6),
            -4px -4px 8px var(--shadow-light, #ffffff);
          z-index: 1;
        }

        .theme-option.active {
          border-color: var(--accent, #ff6b6b);
          transform: scale(1.1);
          box-shadow: 
            inset 2px 2px 4px var(--shadow-dark, #a3b1c6),
            inset -2px -2px 4px var(--shadow-light, #ffffff);
        }
        
        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 12px;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .theme-option:hover .tooltip {
          opacity: 1;
        }
      </style>
      <div class="theme-selector ${this.isExpanded ? "" : "collapsed"}">
        <div class="header" @click="${this.toggleExpand.bind(this)}">
          <h3>主题选择</h3>
          <button class="toggle-btn ${
            this.isExpanded ? "" : "collapsed"
          }">▼</button>
        </div>
        <div class="theme-options">
          ${this.themes
            .map(
              (theme) => `
            <div class="theme-option" data-theme="${theme.name}" style="background-color: ${theme.color}">
              <div class="tooltip">${theme.label}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const options = this.shadowRoot.querySelectorAll(".theme-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const theme = option.dataset.theme;
        this.setTheme(theme);
      });
    });

    const header = this.shadowRoot.querySelector(".header");
    header.addEventListener("click", this.toggleExpand.bind(this));
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    const themeSelector = this.shadowRoot.querySelector(".theme-selector");
    const toggleBtn = this.shadowRoot.querySelector(".toggle-btn");

    if (this.isExpanded) {
      themeSelector.classList.remove("collapsed");
      toggleBtn.classList.remove("collapsed");
    } else {
      themeSelector.classList.add("collapsed");
      toggleBtn.classList.add("collapsed");
    }
  }

  setTheme(themeName) {
    // 移除所有主题类
    document.body.classList.remove(
      ...this.themes.map((t) => `theme-${t.name}`)
    );
    // 添加新主题类
    document.body.classList.add(`theme-${themeName}`);
    // 更新选中状态
    this.shadowRoot.querySelectorAll(".theme-option").forEach((option) => {
      option.classList.toggle("active", option.dataset.theme === themeName);
    });
    // 保存到本地存储
    localStorage.setItem("theme", themeName);
  }
}

customElements.define("theme-manager", ThemeManager);
