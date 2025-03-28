export function logger() {
  console.log(`[Logger]: ${message}`);
}
export function formatResult(result) {
  return `计算结果是: ${result}`;
}

console.log('utils.js被加载了');