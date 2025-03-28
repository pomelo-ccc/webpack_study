// src/components/chat-message.js
class ChatMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["message", "my-client-id"];
  }

  get message() {
    return JSON.parse(this.getAttribute("message") || "{}");
  }

  set message(value) {
    this.setAttribute("message", JSON.stringify(value));
  }

  get myClientId() {
    return this.getAttribute("my-client-id");
  }

  set myClientId(value) {
    this.setAttribute("my-client-id", value);
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const message = this.message;
    const myClientId = this.myClientId;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 8px 0;
        }
        .message {
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 80%;
          min-width: 60px;
          width: fit-content;
          word-break: break-word;
          transition: all 0.3s ease;
        }
        .message.chat {
          background: var(--background, #e0e5ec);
          color: var(--text-color, #333);
          box-shadow: 
            3px 3px 6px var(--shadow-dark, #a3b1c6),
            -3px -3px 6px var(--shadow-light, #ffffff);
        }
        .message.chat:hover {
          transform: translateY(-2px);
          box-shadow: 
            5px 5px 10px var(--shadow-dark, #a3b1c6),
            -5px -5px 10px var(--shadow-light, #ffffff);
        }
        .message.chat.self {
          background: linear-gradient(145deg, var(--primary-light, #6d92c4), var(--primary, #4a76a8));
          color: white;
          margin-left: auto;
        }
        .message.chat.self:hover {
          transform: translateY(-2px);
          box-shadow: 
            5px 5px 10px rgba(74, 118, 168, 0.4),
            -5px -5px 10px rgba(109, 146, 196, 0.4);
        }
        .message.system,
        .message.join,
        .message.leave {
          text-align: center;
          font-size: 0.9em;
          padding: 8px 16px;
          margin: 8px auto;
          background: var(--background, #e0e5ec);
          box-shadow: 
            inset 2px 2px 5px var(--shadow-dark, #a3b1c6),
            inset -2px -2px 5px var(--shadow-light, #ffffff);
        }
        .message.system { color: #795548; }
        .message.join { color: var(--success, #4caf50); }
        .message.leave { color: var(--accent, #ff6b6b); }
        .from {
          font-size: 0.85em;
          margin-bottom: 4px;
          opacity: 0.8;
        }
        .time {
          font-size: 0.75em;
          margin-top: 4px;
          opacity: 0.7;
        }
        .message.self .from,
        .message.self .time {
          text-align: right;
          color: rgba(255, 255, 255, 0.9);
        }
      </style>
    `;

    const messageEl = document.createElement("div");
    messageEl.classList.add("message", message.type || "chat");

    if (message.type === "chat" && message.from === myClientId) {
      messageEl.classList.add("self");
    }

    if (message.type === "chat") {
      const fromEl = document.createElement("div");
      fromEl.classList.add("from");
      fromEl.textContent = message.from || "Unknown";
      messageEl.appendChild(fromEl);
    }

    const contentEl = document.createElement("div");
    contentEl.classList.add("content");
    contentEl.textContent = message.content;
    messageEl.appendChild(contentEl);

    if (message.type === "chat") {
      const timeEl = document.createElement("div");
      timeEl.classList.add("time");
      timeEl.textContent = message.timestamp
        ? new Date(message.timestamp).toLocaleTimeString()
        : new Date().toLocaleTimeString();
      messageEl.appendChild(timeEl);
    }

    this.shadowRoot.appendChild(messageEl);
  }
}

customElements.define("chat-message", ChatMessage);
