import { readFile } from "fs";
import { createServer } from "http";
import { createServer as createHttpsServer } from "https";
import { Mime } from "mime/lite";
import { resolve, posix } from "path";
import standardTypes from "mime/types/standard.js";
import otherTypes from "mime/types/other.js";

import open from "open";

/**参考rollup-plugin-serve  学习使用*/

/**
 * 启动一个静态文件服务器
 * @param {Object} options - 服务器配置选项
 * @param {string|string[]} options.contentBase - 静态文件目录
 * @param {number} options.port - 服务器端口号
 * @param {string} options.host - 服务器主机名
 * @param {boolean|Object} options.https - HTTPS 配置
 * @param {Object} options.headers - 响应头
 * @param {boolean} options.open - 是否自动打开浏览器
 * @param {string} options.openPage - 自动打开的页面路径
 * @param {boolean|string} options.historyApiFallback - 是否启用 HTML5 History API fallback
 * @param {boolean} options.verbose - 是否输出详细日志
 * @param {Object} options.mimeTypes - 自定义 MIME 类型
 * @returns {http.Server|https.Server} 创建的服务器实例
 */
function startServer(options = {}) {
  // 合并默认选项和用户提供的选项
  options = {
    contentBase: options,
    port: options.port || 5351,
    host: options.host || "127.0.0.1",
    https: options.https || false,
    headers: options.headers || {},
    open: options.open || false,
    openPage: options.openPage || "",
    historyApiFallback: options.historyApiFallback || false,
    verbose: options.verbose !== false,
    mimeTypes: options.mimeTypes || {},
    ...options,
  };

  // 创建 MIME 类型实例
  const mime = new Mime(standardTypes, otherTypes);

  // 确保 contentBase 是数组
  options.contentBase = Array.isArray(options.contentBase)
    ? options.contentBase
    : [options.contentBase];

  // 添加自定义 MIME 类型
  if (options.mimeTypes) {
    mime.define(options.mimeTypes, true);
  }

  // 定义请求监听器
  const requestListener = (req, res) => {
    // 解码和规范化 URL 路径
    const unSafePath = decodeURI(req.url.split("?")[0]);
    const urlPath = posix.normalize(unSafePath);

    // 设置自定义响应头
    Reflect.ownKeys(options.headers).forEach((key) => {
      res.setHeader(key, options.headers[key]);
    });

    // 从 contentBase 读取文件
    readFileFromContentBase(
      options.contentBase,
      urlPath,
      (err, data, filePath) => {
        if (!err) {
          // 文件找到，返回文件内容
          return found(res, mime.getType(filePath), data);
        }

        if (err.code !== "ENOENT") {
          // 发生非"文件不存在"错误，返回 500 错误
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end(err.message);
          return;
        }

        if (options.historyApiFallback) {
          // 启用 HTML5 History API fallback
          const fallbackPath =
            typeof options.historyApiFallback === "string"
              ? options.historyApiFallback
              : "/index.html";

          // 尝试读取 fallback 文件
          readFileFromContentBase(
            options.contentBase,
            fallbackPath,
            (err, data, filePath) => {
              if (!err) {
                return found(res, mime.getType(filePath), data);
              }
              notFound(res, filePath);
            }
          );
        } else {
          // 文件不存在且未启用 fallback，返回 404
          notFound(res, filePath);
        }
      }
    );
  };

  // 创建 HTTP 或 HTTPS 服务器
  let server = options.https
    ? createHttpsServer(options.https)
    : createServer(requestListener);

  // 启动服务器
  server.listen(options.port, options.host, () => {
    const protocol = options.https ? "https" : "http";
    const url = `${protocol}://${options.host}:${options.port}`;
    if (options.verbose) {
      options.contentBase.forEach((dir) => {
        console.log(`> Listening at ${url} (from ${dir})`);
      });
    }
    if (options.open) {
      open(url + options.openPage);
    }
  });

  // 处理服务器错误
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`端口${options.port}已被占用`);
      process.exit(1);
    } else {
      throw err;
    }
  });

  // 处理进程终止信号
  const terminationSignals = ["SIGINT", "SIGTERM", "SIGQUIT"];
  terminationSignals.forEach((signal) => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });

  return server;
}

/**
 * 从内容基础目录中读取文件
 * @param {string[]} contentBase - 内容基础目录列表
 * @param {string} urlPath - 请求的URL路径
 * @param {function} callback - 回调函数，参数为(err, data, filePath)
 */
function readFileFromContentBase(contentBase, urlPath, callback) {
  // 构建完整的文件路径
  let filePath = resolve(contentBase[0] || ".", "." + urlPath);

  // 如果URL以斜杠结尾，默认查找index.html
  if (urlPath.endsWith("/")) {
    filePath = resolve(filePath, "index.html");
  }

  // 尝试读取文件
  readFile(filePath, (err, data) => {
    if (err && contentBase.length > 1) {
      // 如果文件不存在且还有其他内容基础目录，递归查找下一个目录
      readFileFromContentBase(contentBase.slice(1), urlPath, callback);
    } else {
      // 文件找到或所有目录都已查找完毕，调用回调函数
      callback(err, data, filePath);
    }
  });
}

/**
 * 处理文件未找到的情况，返回404响应
 * @param {http.ServerResponse} response - HTTP响应对象
 * @param {string} filePath - 请求的文件路径
 */
function notFound(response, filePath) {
  // 设置HTTP状态码为404（未找到）
  response.writeHead(404);

  // 发送404错误消息，包含请求的文件路径
  response.end("404 Not Found\n\n" + filePath, "utf-8");
}

/**
 * 处理成功找到文件的情况，返回200响应
 * @param {http.ServerResponse} res - HTTP响应对象
 * @param {string} mimeType - 文件的MIME类型
 * @param {Buffer|string} data - 文件内容
 */
function found(res, mimeType, data) {
  // 设置HTTP状态码为200（成功）并设置Content-Type头
  res.writeHead(200, { "Content-Type": mimeType });

  // 发送文件内容作为响应
  res.end(data);
}

function pLogger(message, level = "info") {
  const timestamp = new Date().toISOString();
  const colors = {
    info: "\x1b[36m", // 青色
    warn: "\x1b[33m", // 黄色
    error: "\x1b[31m", // 红色
    success: "\x1b[32m", // 绿色
  };
  const reset = "\x1b[0m";
  const color = colors[level] || colors.info;

  console.log(
    `${color}[${timestamp}] [${level.toUpperCase()}]: ${message}${reset}`
  );
}

/**
 * 解析命令行参数并启动服务器
 * 这个函数用于处理命令行参数或环境变量，并据此启动静态文件服务器
 */
function parseArgsAndStart() {
  // 获取命令行参数，去除前两个元素（Node 执行路径和脚本路径）
  const args = process.argv.slice(2);

  // 设置服务器端口，优先使用环境变量 PORT，默认为 5351
  const port = process.env.PORT || 5351;

  // 设置内容基础目录，优先使用环境变量 CONTENT_BASE，默认为当前目录 "."
  const dir = process.env.CONTENT_BASE || ".";

  // 启动服务器，传入配置选项
  startServer({
    contentBase: dir, // 设置内容基础目录
    port, // 设置端口
    open: process.env.OPEN === "true", // 是否自动打开浏览器
    historyApiFallback: process.env.HISTORY_API_FALLBACK === "true", // 是否启用 HTML5 History API fallback
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  parseArgsAndStart();
}

export { startServer };
