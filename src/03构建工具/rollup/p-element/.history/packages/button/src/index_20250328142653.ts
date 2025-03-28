import { baseStyles } from '@p-element/shared';

export class PButton extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'disabled'];
  }

  private button: HTMLButtonElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // 创建样式
    const style = document.createElement('style');
    style.textContent = baseStyles;

    // 创建按钮元素
    this.button = document.createElement('button');
    this.button.className = 'p-base';

    // 将样式和按钮添加到shadow DOM
    this.shadowRoot!.append(style, this.button);
  }

  connectedCallback() {
    this.updateContent();
    this.updateType();
    this.updateDisabled();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'type':
        this.updateType();
        break;
      case 'disabled':
        this.updateDisabled();
        break;
    }
  }

  private updateContent() {
    this.button.textContent = this.textContent;
  }

  private updateType() {
    const type = this.getAttribute('type');
    if (type === 'primary') {
      this.button.classList.add('primary');
    } else {
      this.button.classList.remove('primary');
    }
  }

  private updateDisabled() {
    const disabled = this.hasAttribute('disabled');
    this.button.disabled = disabled;
    if (disabled) {
      this.button.setAttribute('disabled', '');
    } else {
      this.button.removeAttribute('disabled');
    }
  }
}

customElements.define('p-button', PButton);