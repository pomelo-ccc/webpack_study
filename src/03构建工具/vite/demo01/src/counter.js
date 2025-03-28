// 将计数器状态提升为模块级变量
let counter = 4

export function setupCounter(element) {
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  
  element.addEventListener('click', () => setCounter(counter + 1))
  
  // 使用当前的 counter 值，不重置为0
  setCounter(counter)
}

console.log('counter.js   start')