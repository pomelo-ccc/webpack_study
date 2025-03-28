// 模块级状态
let items = [
  { id: 'item1', content: '可拖拽项目 1' },
  { id: 'item2', content: '可拖拽项目 2' },
  { id: 'item3', content: '可拖拽项目 3' }
];

export function setupDragDrop(element) {
  // 创建拖拽模块的 HTML 结构
  element.innerHTML = `
    <div class="drag-drop-container">
      <div class="source-container neomorphic-inset">
        <h3>拖动这些项目</h3>
        <div class="draggable-items">
          <div class="draggable-item" draggable="true" data-id="item1">项目 1</div>
          <div class="draggable-item" draggable="true" data-id="item2">项目 2</div>
          <div class="draggable-item" draggable="true" data-id="item3">项目 3</div>
          <div class="draggable-item" draggable="true" data-id="item4">项目 4</div>
        </div>
      </div>
      
      <div class="target-container neomorphic-inset">
        <h3>放置区域</h3>
        <div class="drop-zone" id="dropZone">
          <p class="drop-instruction">拖放项目到这里</p>
        </div>
      </div>
    </div>
    <div class="drag-status">
      <p>状态: <span id="dragStatus">准备拖放</span></p>
      <button class="reset-button neomorphic-button-sm">重置</button>
    </div>
  `;

  // 获取元素
  const draggableItems = element.querySelectorAll('.draggable-item');
  const dropZone = element.querySelector('#dropZone');
  const statusSpan = element.querySelector('#dragStatus');
  const resetButton = element.querySelector('.reset-button');
  const dropInstruction = element.querySelector('.drop-instruction');
  
  // 设置拖拽项目事件
  draggableItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    
    // 添加点击效果
    item.addEventListener('mousedown', () => {
      item.classList.add('pressing');
    });
    
    item.addEventListener('mouseup', () => {
      item.classList.remove('pressing');
    });
    
    item.addEventListener('mouseleave', () => {
      item.classList.remove('pressing');
    });
  });
  
  // 设置放置区域事件
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragenter', handleDragEnter);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
  
  // 重置按钮
  resetButton.addEventListener('click', resetDragDrop);
  
  // 拖拽开始
  function handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // 设置自定义拖拽图像（可选）
    const dragImage = document.createElement('div');
    dragImage.textContent = this.textContent;
    dragImage.className = 'drag-image';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    setTimeout(() => document.body.removeChild(dragImage), 0);
    
    statusSpan.textContent = `正在拖动: ${this.textContent}`;
  }
  
  // 拖拽结束
  function handleDragEnd() {
    this.classList.remove('dragging');
    statusSpan.textContent = '拖拽结束';
    
    // 移除所有拖拽状态类
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.classList.remove('dragging');
    });
    
    dropZone.classList.remove('drag-over');
  }
  
  // 拖拽经过放置区域
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }
  
  // 进入放置区域
  function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
    statusSpan.textContent = '进入放置区域';
  }
  
  // 离开放置区域
  function handleDragLeave() {
    this.classList.remove('drag-over');
    statusSpan.textContent = '离开放置区域';
  }
  
  // 放置
  function handleDrop(e) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const draggedItem = document.querySelector(`[data-id="${itemId}"]`);
    
    // 如果找到了被拖拽的元素
    if (draggedItem) {
      // 创建放置后的克隆元素，保留原始元素
      const clonedItem = draggedItem.cloneNode(true);
      clonedItem.classList.add('dropped-item');
      
      // 隐藏提示文字
      dropInstruction.style.display = 'none';
      
      // 将克隆的元素添加到放置区
      this.appendChild(clonedItem);
      
      // 为放置的项目添加删除按钮
      const removeBtn = document.createElement('span');
      removeBtn.className = 'remove-item';
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', function() {
        clonedItem.classList.add('removing');
        setTimeout(() => {
          clonedItem.parentNode.removeChild(clonedItem);
          if (dropZone.querySelectorAll('.dropped-item').length === 0) {
            dropInstruction.style.display = 'block';
          }
        }, 300);
      });
      
      clonedItem.appendChild(removeBtn);
      
      // 添加放置动画
      clonedItem.classList.add('just-dropped');
      setTimeout(() => {
        clonedItem.classList.remove('just-dropped');
      }, 500);
      
      // 设置状态
      statusSpan.textContent = `成功放置: ${draggedItem.textContent}`;
      
      // 禁用原始项目的拖拽
      draggedItem.setAttribute('draggable', 'false');
      draggedItem.classList.add('dragged');
    }
    
    // 移除放置区域的高亮
    this.classList.remove('drag-over');
    
    return false;
  }
  
  // 重置拖放状态
  function resetDragDrop() {
    // 清空放置区域
    while (dropZone.firstChild) {
      if (dropZone.firstChild.classList && dropZone.firstChild.classList.contains('drop-instruction')) {
        break;
      }
      dropZone.removeChild(dropZone.firstChild);
    }
    
    // 显示提示文字
    dropInstruction.style.display = 'block';
    
    // 重置所有可拖动项目
    draggableItems.forEach(item => {
      item.setAttribute('draggable', 'true');
      item.classList.remove('dragged');
    });
    
    // 更新状态
    statusSpan.textContent = '已重置';
    
    // 添加重置动画效果
    element.querySelector('.drag-drop-container').classList.add('reset-animation');
    setTimeout(() => {
      element.querySelector('.drag-drop-container').classList.remove('reset-animation');
    }, 500);
  }
}
console.log('dragdrowp.3js')