const APP = document.querySelector('#app')

import toggle from '../assets/images/toggle-button.png';



function start() {
    APP.innerHTML = `
  <div class="container">
    <img src="${toggle}" alt="Logo" class="logo">
    <h1>Parcel测试成功！</h1>
    <p>这是一个零配置的Parcel测试项目</p>
    <p class="counter">计数: <span id="count">0</span></p>
    <button id="increment">增加</button>
    <button id="decrement">减少</button>
  </div>
`
}

const getCount = () => {
    return APP.querySelector('#count')
}
const getIncrementButton = () => APP.querySelector('#increment')
console.log('dom.js')
export {
    start,
    APP,
    getCount,
    getIncrementButton
}

