import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { setupTodoList } from './todolist.js'
import { setupDragDrop } from './dragdrop.js'
import './carousel.css'
import { setupCarousel } from './carousel.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    
    <div class="carousel-wrapper">
      <div class="carousel-container">
        <div class="carousel-track">
          <div class="carousel-slide" id="counter-slide">
            <h2>计数器模块</h2>
            <div class="card">
              <p class="module-description">点击按钮来增加计数值</p>
              <button id="counter" type="button"></button>
            </div>
          </div>
          <div class="carousel-slide" id="todo-slide">
            <h2>待办事项模块</h2>
            <div class="card" id="todo-container"></div>
          </div>
          <div class="carousel-slide" id="drag-slide">
            <h2>拖放功能模块</h2>
            <div class="card" id="drag-container"></div>
          </div>
        </div>
      </div>
      
      <div class="carousel-nav">
        <button class="nav-button prev-button neomorphic-button">上一个</button>
        <div class="carousel-indicators">
          <span class="indicator active"></span>
          <span class="indicator"></span>
          <span class="indicator"></span>
        </div>
        <button class="nav-button next-button neomorphic-button">下一个</button>
      </div>
    </div>
    
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
setupTodoList(document.querySelector('#todo-container'))
setupDragDrop(document.querySelector('#drag-container'))
setupCarousel()

// 确保 HMR 接口正常工作
if (import.meta.hot) {
  import.meta.hot.accept()
  console.log('HMR 已启用')
}

