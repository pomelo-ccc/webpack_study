#!/usr/bin/env node



import { Command } from "commander";
import { startServer } from "./dev-server.js";

const program = new Command();
/**
 * CLI module for dev-server
 * 
 * This module defines the command-line interface for a simple static server.
 * It uses the Commander.js library to parse command line arguments and
 * provides various options for configuring the server such as port, directory,
 * host, etc.
 * 
 * @module cli
 * @requires commander
 * @requires ./dev-server.js
 * 
 * @example
 * // Run the server with default options
 * $ node cli.js
 * 
 * @example
 * // Run the server on port 8080
 * $ node cli.js -p 8080
 * 
 * @example
 * // Serve multiple directories
 * $ node cli.js -d dist src public
 * 
 * @example
 * // Enable HTTPS and history API fallback
 * $ node cli.js --https --history
 */
program
  .name("dev-server")
  .description("启动简单的静态服务器")
  .version("0.1.0")
  .option("-p, --port <number>", "指定端口号", "5351")
  .option("-d, --dir <dir...>", "指定目录", ["."])
  .option("-o, --open", "自动打开浏览器", false)
  .option("-h, --host <hostname>", "指定主机名", "localhost")
  .option("--https", "启用 HTTPS")
  .option("--history", "启用 History API Fallback", false)
  .option("--no-verbose", "禁用详细输出")
  .action((options) => {
    startServer({
      contentBase: options.dir,
      port: options.port,
      host: options.host,
      https: options.https,
      open: options.open,
      historyApiFallback: options.history,
      verbose: options.verbose,
    });
  });

program.parse(process.argv);
