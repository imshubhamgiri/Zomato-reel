import helmet from "helmet";

export const helmetMiddleware = helmet({
  // 1. Keep the "Manual" for the browser (CSP)
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "media-src": ["'self'", "https://ik.imagekit.io"],
      "img-src": ["'self'", "data:", "https://ik.imagekit.io"],
      "upgrade-insecure-requests": null, // Necessary for local HTTP testing
    },
  },
  // 2. Adjust the "Fence" so it doesn't clash with your CORS
  crossOriginResourcePolicy: { policy: "cross-origin" },
  
  // 3. Keep the "Safety Basics" (X-Frame, X-Content-Type, etc.)
  // These are enabled by default by just calling helmet()
});