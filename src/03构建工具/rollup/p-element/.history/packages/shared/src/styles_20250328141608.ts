export const baseStyles = `
  :host {
    display: inline-block;
  }
  .p-base {
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    color: #606266;
    transition: .1s;
    outline: none;
  }
  .p-base:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .p-base:active {
    color: #3a8ee6;
    border-color: #3a8ee6;
  }
  .p-base[disabled] {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
  }
  .p-base.primary {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
  .p-base.primary:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .p-base.primary:active {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
  }
`;