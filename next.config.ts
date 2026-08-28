import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No remote image hosts. All imagery is served from /public so nothing on the critical
  // render path depends on a third party. Add a pattern here only when a real CDN is set up.
  poweredByHeader: false,
  /**
   * /compliance and /export were merged into the About page. Permanent redirects keep
   * every indexed URL, inbound link and printed reference working, and hand the ranking
   * to the section that replaced each page.
   */
  async redirects() {
    return [
      { source: "/compliance", destination: "/about#compliance", permanent: true },
      { source: "/export", destination: "/about#export", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }
        ]
      }
    ];
  }
};

export default nextConfig;
