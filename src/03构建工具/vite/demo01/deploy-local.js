// 创建一个小脚本来部署你的应用

// 安装依赖: npm install serve -g
// 或者本地安装: npm install serve --save-dev

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// 在ES模块中获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取打包目录的绝对路径
const distPath = path.resolve(__dirname, 'dist');

console.log(`正在启动本地服务器，为 ${distPath} 目录提供服务...`);

// 使用 serve 启动服务器
const serveProcess = exec(`npx serve ${distPath} -s`, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// 将输出打印到控制台
serveProcess.stdout.on('data', (data) => {
  console.log(data);
});

serveProcess.stderr.on('data', (data) => {
  console.error(data);
});

console.log('服务器启动中，请查看上方 URL...');
