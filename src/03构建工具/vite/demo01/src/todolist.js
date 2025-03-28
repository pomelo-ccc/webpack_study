// 模块级状态，HMR 时保持
let todos = [
  { id: 1, text: '学习 Vite', completed: false },
  { id: 2, text: '了解 HMR', completed: true }
];

export function setupTodoList(element) {
  // 渲染 TodoList
  const renderTodos = () => {
    element.innerHTML = `
      <h3>Todo List</h3>
      <input type="text" id="new-todo" placeholder="添加新任务">
      <button id="add-todo">添加</button>
      <ul>
        ${todos.map(todo => `
          <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <button class="delete-todo">删除</button>
          </li>
        `).join('')}
      </ul>
    `;

    // 添加新任务事件
    const input = element.querySelector('#new-todo');
    const addButton = element.querySelector('#add-todo');
    
    const addTodo = () => {
      if (input.value.trim()) {
        const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
        todos.push({ id: newId, text: input.value.trim(), completed: false });
        input.value = '';
        renderTodos();
      }
    };
    
    addButton.addEventListener('click', addTodo);
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') addTodo();
    });

    // 切换完成状态和删除事件
    element.querySelectorAll('li').forEach(li => {
      const id = parseInt(li.dataset.id);
      const checkbox = li.querySelector('input[type="checkbox"]');
      const deleteBtn = li.querySelector('.delete-todo');
      
      checkbox.addEventListener('change', () => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
          todo.completed = checkbox.checked;
          renderTodos();
        }
      });
      
      deleteBtn.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
      });
    });
  };

  // 初始渲染
  renderTodos();
}
console.log('todolis3t3.j1321s dsfs  start')