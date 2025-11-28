// Documentation: https://sdk.netlify.com/docs

import { NetlifyExtension } from "@netlify/sdk";
import type { TeamConfig } from "./schema/team-config.js";
import type { SiteConfig } from "./schema/site-config.js";

const extension = new NetlifyExtension<SiteConfig, TeamConfig>();

extension.addEdgeFunctions("./src/edge-functions", {
  prefix: "agentic_analytics",
  shouldInjectFunction: () => {
    // If the edge function is not enabled, return early
    //if (!process.env["OTTERLYAI_AGENTIC_ANALYTICS_ENABLED"]) {
    //  return false;
    //}
    return true;
  },
});

export { extension };