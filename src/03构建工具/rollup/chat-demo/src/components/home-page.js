// src/components/home-page.js
class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100vh;
          background: var(--background, #e0e5ec);
          color: var(--text-color, #333);
        }
        .home {
          width: 90%;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          text-align: center;
          background: var(--background, #e0e5ec);
          border-radius: var(--border-radius, 16px);
          box-shadow: 
            8px 8px 16px var(--shadow-dark, #a3b1c6),
            -8px -8px 16px var(--shadow-light, #ffffff);
        }
        h1 {
          color: var(--primary, #4a76a8);
          font-size: 2.5rem;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px var(--shadow-dark, #a3b1c6);
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        button {
          background: var(--background, #e0e5ec);
          color: var(--primary, #4a76a8);
          border: none;
          padding: 15px 30px;
          font-size: 1.1rem;
          border-radius: var(--input-radius, 25px);
          cursor: pointer;
          box-shadow: 
            5px 5px 10px var(--shadow-dark, #a3b1c6),
            -5px -5px 10px var(--shadow-light, #ffffff);
          transition: all 0.3s ease;
        }
        button:hover {
          color: var(--primary-light, #6d92c4);
          transform: translateY(-2px);
          box-shadow: 
            8px 8px 16px var(--shadow-dark, #a3b1c6),
            -8px -8px 16px var(--shadow-light, #ffffff);
        }
        button:active {
          transform: translateY(0);
          box-shadow: 
            inset 4px 4px 8px var(--shadow-dark, #a3b1c6),
            inset -4px -4px 8px var(--shadow-light, #ffffff);
        }
      </style>
      <div class="home">
        <h1>欢迎来到聊天应用</h1>
        <p>点击下方按钮开始聊天！</p>
        <button id="start-chat">开始聊天</button>
      </div>
    `;
  }

  setupEventListeners() {
    const startButton = this.shadowRoot.querySelector("#start-chat");
    startButton.addEventListener("click", () => {
      // 移除当前组件
      this.remove();
      // 创建并添加聊天应用组件
      const chatApp = document.createElement("chat-app");
      document.body.appendChild(chatApp);
    });
  }
}

customElements.define("home-page", HomePage);
