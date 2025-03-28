// src/plugins/html-plugin.js
import fs from "fs";
import path from "path";

export default function htmlPlugin() {
  return {
    name: "html-plugin",
    async generateBundle(options, bundle) {
      // 读取源HTML文件
      const srcHtmlPath = path.resolve("src/index.html");
      let htmlContent = fs.readFileSync(srcHtmlPath, "utf-8");

      // 收集所有生成的JS和CSS文件
      const jsFiles = [];
      const cssFiles = [];

      for (const fileName in bundle) {
        const file = bundle[fileName];
        if (fileName.endsWith(".js")) {
          jsFiles.push(fileName);
        } else if (fileName.endsWith(".css")) {
          cssFiles.push(fileName);
        }
      }

      // 在HTML中注入脚本和样式链接
      const scriptTags = jsFiles
        .map((file) => `    <script type="module" src="/${file}"></script>`)
        .join("\n");
      const linkTags = cssFiles
        .map((file) => `    <link rel="stylesheet" href="/${file}">`)
        .join("\n");

      // 在</head>标签前插入样式链接
      htmlContent = htmlContent.replace("</head>", `${linkTags}\n  </head>`);

      // 在</body>标签前插入脚本
      htmlContent = htmlContent.replace("</body>", `${scriptTags}\n  </body>`);

      // 写入到输出目录
      const outputDir = options.dir || ".";
      const outputPath = path.join(outputDir, "index.html");

      // 确保输出目录存在
      const outputDirPath = path.dirname(outputPath);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }

      fs.writeFileSync(outputPath, htmlContent);
      console.log("✨ HTML file has been generated successfully!");
    },
  };
}
