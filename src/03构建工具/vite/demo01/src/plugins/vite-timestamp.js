export default function timestampPlugin() {
  return {
    name: "timestamp-plugin",
    transform(code, id) {
        console.log("transform",  id);
        return{
            code,
            map:null
        }
    
    },
    config(config) {
      console.log("config");
    },
    buildStart() {
      console.log("buildStart");
    },
    buildEnd() {
      console.log("buildEnd");
    },
    configureServer(server) {
      console.log("configureServer", server);
    },
    configResolved(resolvedConfig) {
      console.log("configResolved");
    },
    transformIndexHtml(html) {
        return html.replace(
          '</head>', 
          `<script>console.log('注入的脚本')</script></head>`
        )
    },
    handleHotUpdate({ file, server }) {
        if (file.endsWith('.css')) {
          server.ws.send({ type: 'custom', event: 'style-update' })
          return []
        }
      }
  };
}
