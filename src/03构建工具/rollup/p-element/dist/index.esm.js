class PButton extends HTMLElement {
    static get observedAttributes() {
        return ['type', 'disabled'];
    }
    button;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
      :host {
        display: inline-block;
      }
      .p-button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        background: #fff;
        color: #606266;
        cursor: pointer;
        transition: .1s;
        outline: none;
      }
      .p-button:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
      .p-button:active {
        color: #3a8ee6;
        border-color: #3a8ee6;
      }
      .p-button[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
        background-image: none;
        background-color: #fff;
        border-color: #ebeef5;
      }
      .p-button.primary {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
      .p-button.primary:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #fff;
      }
      .p-button.primary:active {
        background: #3a8ee6;
        border-color: #3a8ee6;
        color: #fff;
      }
    `;
        // 创建按钮元素
        this.button = document.createElement('button');
        this.button.className = 'p-button';
        // 将样式和按钮添加到shadow DOM
        this.shadowRoot.append(style, this.button);
    }
    connectedCallback() {
        this.updateContent();
        this.updateType();
        this.updateDisabled();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        switch (name) {
            case 'type':
                this.updateType();
                break;
            case 'disabled':
                this.updateDisabled();
                break;
        }
    }
    updateContent() {
        this.button.textContent = this.textContent;
    }
    updateType() {
        const type = this.getAttribute('type');
        if (type === 'primary') {
            this.button.classList.add('primary');
        }
        else {
            this.button.classList.remove('primary');
        }
    }
    updateDisabled() {
        const disabled = this.hasAttribute('disabled');
        this.button.disabled = disabled;
    }
}
customElements.define('p-button', PButton);

export { PButton };
