import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reviewsHandler from "./api/reviews.js";
import routeHandler from "./api/route.js";
import suggestHandler from "./api/suggest.js";

const apiHandlers = new Map([
  ["/api/reviews", reviewsHandler],
  ["/api/route", routeHandler],
  ["/api/suggest", suggestHandler],
]);

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      if (!body) {
        resolve(undefined);
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        resolve(body);
      }
    });
    request.on("error", reject);
  });
}

function sendJsonResponse(response) {
  return {
    setHeader(name, value) {
      response.setHeader(name, value);
    },
    status(code) {
      response.statusCode = code;
      return this;
    },
    json(data) {
      if (!response.getHeader("Content-Type")) {
        response.setHeader("Content-Type", "application/json; charset=utf-8");
      }
      response.end(JSON.stringify(data));
    },
  };
}

function queryFromSearchParams(searchParams) {
  const query = {};

  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return query;
}

function localApiMiddleware() {
  return async (request, response, next) => {
    const url = new URL(request.url || "/", "http://localhost");
    const handler = apiHandlers.get(url.pathname);

    if (!handler) {
      next();
      return;
    }

    try {
      await handler(
        {
          method: request.method,
          query: queryFromSearchParams(url.searchParams),
          body: await readRequestBody(request),
        },
        sendJsonResponse(response),
      );
    } catch {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.end(
        JSON.stringify({
          message:
            "🚕 Ups, esta ruta necesita una mirada rápida. Escríbeme por WhatsApp y te confirmo precio y disponibilidad enseguida.",
        }),
      );
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "taxiayud-local-api",
      configureServer(server) {
        server.middlewares.use(localApiMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(localApiMiddleware());
      },
    },
  ],
  build: {
    copyPublicDir: false,
    reportCompressedSize: false,
  },
});
