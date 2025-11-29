// Documentation: https://sdk.netlify.com/docs

// src/edge-functions/agentic-analytics.ts
import type { Config, Context } from "@netlify/edge-functions";

/**
 * Agentic Analytics Edge Function
 *
 * Runs on every request and sends a server-side analytics event to
 * https://otterly.ai/agentic-analytics/api/.
 */
export default async function handler(request: Request, context: Context) {
  const apiKey = Netlify.env.get("AGENTIC_ANALYTICS_API_KEY");
  //const apiKey = "your_api_key_here"; // Replace with your actual API key or use environment variable

  // If no API key is configured, do nothing.
  if (!apiKey) {
    context.log?.(
      "[Agentic Analytics] Missing AGENTIC_ANALYTICS_API_KEY environment variable."
    );
    return;
  }

  const url = new URL(request.url);

  const userAgent = request.headers.get("user-agent") ?? "";
  const referer = request.headers.get("referer") ?? "";
  const hostHeader = request.headers.get("host") ?? "";
  const remoteAddr = context.ip ?? "";

  const payload = {
    API_KEY: apiKey,
    HTTP_USER_AGENT: userAgent,
    HTTP_REFERER: referer,
    REMOTE_ADDR: remoteAddr,
    HTTP_HOST: hostHeader,
    REQUEST_URI: url.pathname,
    QUERY_STRING: url.search, // includes leading "?" or empty string
  };

  // Fire-and-forget analytics call so we don't delay the request.
  context.waitUntil(
    fetch("https://otterly.ai/agentic-analytics/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        context.log?.("[Agentic Analytics] Event sent successfully");
      })
      .catch((error) => {
        context.log?.("[Agentic Analytics] Error sending event:", error);
      })
  );

  // Return nothing to continue the normal request chain.
  return;
}

// Run on all paths of the site
export const config: Config = {
  path: "/*",
};