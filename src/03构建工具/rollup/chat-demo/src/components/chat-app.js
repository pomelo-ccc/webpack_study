// src/components/chat-app.js
class ChatApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.myClientId = null;
    this.socket = null;
  }

  connectedCallback() {
    this.render();
    this.initWebSocket();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100vh;
          position: relative;
        }
        .chat-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--background, #e0e5ec);
          border-radius: var(--border-radius, 16px);
          box-shadow: 
            8px 8px 16px var(--shadow-dark, #a3b1c6),
            -8px -8px 16px var(--shadow-light, #ffffff);
          overflow: hidden;
          transition: all 0.3s ease;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .chat-container:hover {
          box-shadow: 
            10px 10px 20px var(--shadow-dark, #a3b1c6),
            -10px -10px 20px var(--shadow-light, #ffffff);
        }
        .status {
          padding: 12px;
          text-align: center;
          font-size: 0.9em;
          color: var(--text-color, #333);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background: linear-gradient(145deg, #e8edf3, #dde3ea);
        }
        .status.connected { color: var(--success, #4caf50); }
        .status.disconnected { color: var(--accent, #ff6b6b); }
        .status.error { color: var(--accent-dark, #e95757); }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: linear-gradient(145deg, #e8edf3, #dde3ea);
          box-shadow: 
            inset 4px 4px 8px var(--shadow-dark, #a3b1c6),
            inset -4px -4px 8px var(--shadow-light, #ffffff);
        }
        .input-area {
          padding: 20px;
          display: flex;
          gap: 12px;
          background: var(--background, #e0e5ec);
          box-shadow: 
            inset 2px 2px 5px var(--shadow-dark, #a3b1c6),
            inset -2px -2px 5px var(--shadow-light, #ffffff);
          position: sticky;
          bottom: 0;
          z-index: 10;
        }
        textarea {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: var(--input-radius, 25px);
          background: var(--background, #e0e5ec);
          color: var(--text-color, #333);
          font-size: 1em;
          box-shadow: 
            inset 4px 4px 8px var(--shadow-dark, #a3b1c6),
            inset -4px -4px 8px var(--shadow-light, #ffffff);
          transition: all 0.3s ease;
          min-height: 48px;
          max-height: 120px;
          resize: none;
          overflow-y: auto;
          line-height: 1.5;
        }
        textarea:focus {
          outline: none;
          box-shadow: 
            inset 6px 6px 12px var(--shadow-dark, #a3b1c6),
            inset -6px -6px 12px var(--shadow-light, #ffffff);
          transform: scale(1.01);
        }
        button {
          padding: 12px 24px;
          border: none;
          border-radius: var(--input-radius, 25px);
          background: var(--background, #e0e5ec);
          color: var(--primary, #4a76a8);
          font-weight: bold;
          cursor: pointer;
          box-shadow: var(--button-shadow, 
            5px 5px 10px var(--shadow-dark, #a3b1c6),
            -5px -5px 10px var(--shadow-light, #ffffff));
          transition: all 0.3s ease;
        }
        button:hover {
          color: var(--primary-light, #6d92c4);
          box-shadow: var(--button-shadow-hover,
            4px 4px 8px var(--shadow-dark, #a3b1c6),
            -4px -4px 8px var(--shadow-light, #ffffff));
          transform: translateY(-2px);
        }
        button:active {
          box-shadow: var(--button-shadow-active,
            inset 4px 4px 8px var(--shadow-dark, #a3b1c6),
            inset -4px -4px 8px var(--shadow-light, #ffffff));
          transform: translateY(0);
        }
      </style>
      <div class="chat-container">
        <div class="status">连接中...</div>
        <div class="messages"></div>
        <div class="input-area">
          <textarea placeholder="输入消息..." rows="1"></textarea>
          <button>发送</button>
        </div>
      </div>
    `;
  }

  initWebSocket() {
    this.socket = new WebSocket("ws://192.168.23.164:8080");

    this.socket.addEventListener("open", () => {
      this.updateStatus("已连接", "connected");
    });

    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "system" && message.id) {
        this.myClientId = message.id;
      }
      this.addMessage(message);
    });

    this.socket.addEventListener("close", () => {
      this.updateStatus("已断开连接", "disconnected");
    });

    this.socket.addEventListener("error", () => {
      this.updateStatus("连接错误", "error");
    });
  }

  setupEventListeners() {
    const textarea = this.shadowRoot.querySelector("textarea");
    const button = this.shadowRoot.querySelector("button");

    const sendMessage = () => {
      const content = textarea.value.trim();
      if (content && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ content }));
        textarea.value = "";
        textarea.style.height = "48px";
        textarea.focus();
      }
    };

    button.addEventListener("click", sendMessage);
    textarea.addEventListener("input", () => {
      const currentHeight = textarea.scrollHeight;
      const minHeight = 48;
      const maxHeight = 120;

      if (currentHeight === textarea.clientHeight) {
        return;
      }

      textarea.style.height = minHeight + "px";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height =
        Math.min(Math.max(scrollHeight, minHeight), maxHeight) + "px";
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  updateStatus(text, className) {
    const status = this.shadowRoot.querySelector(".status");
    status.textContent = text;
    status.className = "status " + className;
  }

  addMessage(message) {
    const messages = this.shadowRoot.querySelector(".messages");
    const messageEl = document.createElement("chat-message");
    messageEl.message = message;
    messageEl.myClientId = this.myClientId;
    messages.appendChild(messageEl);
    messages.scrollTop = messages.scrollHeight;
  }
}

customElements.define("chat-app", ChatApp);
