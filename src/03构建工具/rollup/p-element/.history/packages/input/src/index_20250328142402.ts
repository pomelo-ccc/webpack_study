import { baseStyles } from '@p-element/shared';

export class PInput extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'placeholder', 'disabled'];
  }

  private input: HTMLInputElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      ${baseStyles}
      .p-base {
        width: 100%;
        box-sizing: border-box;
        cursor: text;
      }
      .p-base::placeholder {
        color: #c0c4cc;
      }
    `;

    // 创建输入框元素
    this.input = document.createElement('input');
    this.input.className = 'p-base';

    // 将样式和输入框添加到shadow DOM
    this.shadowRoot!.append(style, this.input);
  }

  connectedCallback() {
    this.updateValue();
    this.updatePlaceholder();
    this.updateDisabled();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'value':
        this.updateValue();
        break;
      case 'placeholder':
        this.updatePlaceholder();
        break;
      case 'disabled':
        this.updateDisabled();
        break;
    }
  }

  private updateValue() {
    const value = this.getAttribute('value');
    this.input.value = value || '';
  }

  private updatePlaceholder() {
    const placeholder = this.getAttribute('placeholder');
    if (placeholder) {
      this.input.setAttribute('placeholder', placeholder);
    } else {
      this.input.removeAttribute('placeholder');
    }
  }

  private updateDisabled() {
    const disabled = this.hasAttribute('disabled');
    this.input.disabled = disabled;
    if (disabled) {
      this.input.setAttribute('disabled', '');
    } else {
      this.input.removeAttribute('disabled');
    }
  }
}

customElements.define('p-input', PInput);
