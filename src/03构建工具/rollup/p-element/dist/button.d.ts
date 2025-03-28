export declare class PButton extends HTMLElement {
    static get observedAttributes(): string[];
    private button;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private updateContent;
    private updateType;
    private updateDisabled;
}
