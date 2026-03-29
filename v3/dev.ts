import { watch } from "fs";

const sockets = new Set<any>();

const server = Bun.serve({
  port: 3000,
  async fetch(req, server) {
    const { pathname } = new URL(req.url);

    if (pathname === "/__ws") {
      if (server.upgrade(req)) return;
      return new Response("Upgrade failed", { status: 400 });
    }

    const resolved = pathname === "/" ? "/index.html" : pathname;

    // Bundle TSX/TS on the fly
    if (/\.tsx?$/.test(resolved)) {
      const result = await Bun.build({ entrypoints: ["." + resolved] });
      if (result.success) {
        return new Response(await result.outputs[0].text(), {
          headers: { "Content-Type": "application/javascript" },
        });
      }
      return new Response("Build failed:\n" + result.logs.join("\n"), { status: 500 });
    }

    const file = Bun.file("." + resolved);
    if (!(await file.exists())) return new Response("Not found", { status: 404 });

    // Inject live reload into HTML pages
    if (resolved.endsWith(".html")) {
      let html = await file.text();
      html = html.replace(
        "</body>",
        `<script>new WebSocket("ws://"+location.host+"/__ws").onmessage=()=>location.reload()</script>\n</body>`
      );
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    return new Response(file);
  },
  websocket: {
    open(ws) { sockets.add(ws); },
    close(ws) { sockets.delete(ws); },
    message() {},
  },
});

// Watch for file changes and reload browsers
watch(".", { recursive: true }, (_, filename) => {
  if (!filename || filename.startsWith("build/") || filename === "dev.ts") return;
  console.log(`Changed: ${filename}`);
  for (const ws of sockets) ws.send("reload");
});

console.log(`Dev server: http://localhost:${server.port}`);
