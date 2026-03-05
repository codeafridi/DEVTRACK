const CACHE_NAME = "devtrack-v2";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(
          `<!DOCTYPE html>
          <html lang="en">
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
          <title>Offline - DevTrack</title>
          <style>
            body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
            background:#09090b;color:#fafafa;font-family:system-ui,sans-serif;text-align:center;padding:20px}
            h1{font-size:1.5rem;margin:0 0 8px} p{color:#a1a1aa;font-size:14px;margin:0}
          </style></head>
          <body><div><h1>You're offline</h1><p>Check your connection and refresh.</p></div></body>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        )
      )
    );
    return;
  }
});
