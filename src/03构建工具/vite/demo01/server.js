// Express 服务器文件

// 安装依赖: npm install express --save-dev

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 在ES模块中获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// 提供静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 所有请求都返回 index.html (用于 SPA 单页应用)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`应用已部署，访问: http://localhost:${port}`);
});
