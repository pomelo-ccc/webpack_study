// server/chat-server.js
import { WebSocketServer } from 'ws';
import http from 'http';

// 创建HTTP服务器
const server = http.createServer();
const wss = new WebSocketServer({ server });

// 存储所有客户端连接
const clients = new Set();

// 当客户端连接时
wss.on('connection', (ws) => {
  const clientId = `user-${Math.floor(Math.random() * 1000)}`;
  console.log(`👋 客户端 ${clientId} 已连接`);
  
  // 添加客户端到集合
  clients.add(ws);
  
  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'system',
    content: `欢迎 ${clientId} 加入聊天!`,
    from: 'System',
    id: clientId
  }));
  
  // 广播新用户加入
  broadcastMessage({
    type: 'join',
    content: `${clientId} 加入了聊天`,
    from: 'System',
    id: clientId
  }, ws);
  
  // 接收消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`📨 收到来自 ${clientId} 的消息:`, data.content);
      
      // 广播消息给所有客户端
      broadcastMessage({
        type: 'chat',
        content: data.content,
        from: clientId,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('处理消息时出错:', err);
    }
  });
  
  // 客户端断开连接
  ws.on('close', () => {
    console.log(`👋 客户端 ${clientId} 已断开连接`);
    clients.delete(ws);
    
    // 广播用户离开
    broadcastMessage({
      type: 'leave',
      content: `${clientId} 离开了聊天`,
      from: 'System'
    });
  });
  
  // 设置客户端ID
  ws.clientId = clientId;
});

// 广播消息给所有客户端
function broadcastMessage(message, excludeClient = null) {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client !== excludeClient && client.readyState === 1) {
      client.send(messageStr);
    }
  });
}

// 启动服务器
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 聊天WebSocket服务器已启动，监听端口 ${PORT}`);
});