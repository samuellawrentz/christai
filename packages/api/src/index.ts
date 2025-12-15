const server = Bun.serve({
  port: process.env.PORT || 3001,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }

    return new Response("ChristianAI API", {
      headers: { "Content-Type": "text/plain" },
    });
  },
});

console.log(`🚀 API server running at http://localhost:${server.port}`);
