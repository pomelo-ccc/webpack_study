// server/dev-server-2.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

// 提供静态文件
app.use(express.static(path.join(__dirname, '../public')));

// 指向用户B的页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/user-b.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 用户B服务器已启动: http://localhost:${PORT}`);
});