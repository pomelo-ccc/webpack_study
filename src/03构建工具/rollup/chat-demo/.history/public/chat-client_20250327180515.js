// src/chat-client.js
// 存储自己的客户端ID
let myClientId = null;

// 连接到聊天WebSocket服务器
const socket = new WebSocket('ws://192.168.23.164:8080');

// DOM元素
let messagesContainer;
let messageInput;
let sendButton;
let statusElement;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  messagesContainer = document.getElementById('messages');
  messageInput = document.getElementById('message-input');
  sendButton = document.getElementById('send-btn');
  statusElement = document.querySelector('.status');

  // 添加事件监听器
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // 让输入框获得焦点
  setTimeout(() => messageInput.focus(), 500);

  // 自动调整输入框高度
  function adjustTextareaHeight() {
    // 重置高度以便获取正确的scrollHeight
    messageInput.style.height = 'auto';
    // 设置新高度 (scrollHeight会随内容增加)
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 150)}px`;
  }
  
  // 监听输入事件，动态调整高度
  messageInput.addEventListener('input', adjustTextareaHeight);
  
  // Enter键发送消息，Shift+Enter换行
  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 阻止默认的换行行为
      sendButton.click(); // 触发发送按钮点击
    }
  });

  // 初始化调整一次高度
  adjustTextareaHeight();
  
  // 更新发送消息的处理逻辑，移除任何loading效果
  const originalSendFunction = sendButton.onclick;
  sendButton.onclick = function() {
    if (messageInput.value.trim() !== '') {
      // 如果存在原始的发送函数，先执行它
      if (typeof originalSendFunction === 'function') {
        originalSendFunction.call(this);
      }
      
      // 发送后立即清空输入框并重置高度
      messageInput.value = '';
      adjustTextareaHeight();
      
      // 让输入框重新获得焦点
      messageInput.focus();
    }
  };
});

// 连接打开时
socket.addEventListener('open', () => {
  if (statusElement) {
    statusElement.textContent = '已连接';
    statusElement.classList.add('connected');
  }
});

// 接收消息
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  
  // 如果收到了系统消息且包含我们的ID，保存它
  if (message.type === 'system' && message.id) {
    myClientId = message.id;
    console.log('我的客户端ID:', myClientId);
  }
  
  // 添加消息到UI
  addMessageToUI(message);
});

// 连接关闭时
socket.addEventListener('close', () => {
  if (statusElement) {
    statusElement.textContent = '已断开连接';
    statusElement.classList.remove('connected');
    statusElement.classList.add('disconnected');
  }
});

// 连接错误时
socket.addEventListener('error', (error) => {
  if (statusElement) {
    statusElement.textContent = '连接错误';
    statusElement.classList.add('error');
  }
  console.error('WebSocket错误:', error);
});

// 发送消息
function sendMessage() {
  if (!messageInput) return;
  
  const content = messageInput.value.trim();
  if (content && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ content }));
    messageInput.value = '';
    
    // 让输入框重新获得焦点
    messageInput.focus();
  }
}

// 添加消息到UI
function addMessageToUI(message) {
  if (!messagesContainer) return;
  
  // 创建消息容器（外层）
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  
  // 确定消息容器类型
  if (message.type === 'chat') {
    if (message.from === myClientId) {
      messageContainer.classList.add('self-container');
    } else {
      messageContainer.classList.add('other-container');
    }
  } else {
    // 系统、加入、离开消息
    messageContainer.classList.add(`${message.type}-container`);
  }
  
  // 创建消息元素（内层）
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  // 根据消息类型添加类
  if (message.type) {
    messageElement.classList.add(message.type);
  }
  
  // 如果是聊天消息，且是自己发的，添加self类
  if (message.type === 'chat' && message.from === myClientId) {
    messageElement.classList.add('self');
  }
  
  // 只为聊天消息显示发送者名称
  if (message.type === 'chat') {
    const fromElement = document.createElement('div');
    fromElement.classList.add('from');
    fromElement.textContent = message.from || 'Unknown';
    messageElement.appendChild(fromElement);
  }
  
  const contentElement = document.createElement('div');
  contentElement.classList.add('content');
  contentElement.textContent = message.content;
  messageElement.appendChild(contentElement);
  
  // 为聊天消息添加时间戳
  if (message.type === 'chat') {
    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    timeElement.textContent = message.timestamp 
      ? new Date(message.timestamp).toLocaleTimeString() 
      : new Date().toLocaleTimeString();
    messageElement.appendChild(timeElement);
  }
  
  // 将消息元素添加到容器中
  messageContainer.appendChild(messageElement);
  
  // 将容器添加到消息区域
  messagesContainer.appendChild(messageContainer);
  
  // 滚动到最新消息
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
//# sourceMappingURL=chat-client.js.map
