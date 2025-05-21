/** @type {import('next').NextConfig} */
const TerserPlugin = require("terser-webpack-plugin");
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: [
      "localhost",
      "your-domain.com", // Add your production domain
      "res.cloudinary.com", // If using Cloudinary for image hosting
      "vercel.app", // For Vercel preview deployments
      "railway.app", // For Railway preview deployments
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours cache for images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true, // Allow SVG images (use with caution)
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Output standalone build for better performance
  output: "standalone",

  // Headers for security
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), autoplay=(), payment=()",
          },
          {
            // Add Content-Security-Policy header if CSP_DIRECTIVES is defined in environment
            key: "Content-Security-Policy",
            value:
              process.env.CSP_DIRECTIVES ||
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://api.your-domain.com;",
          },
          {
            // Cache control for static assets
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Special headers for API routes
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },

  // Redirects for HTTPS enforcement
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        permanent: true,
        destination: "https://:host/:path*",
      },
    ];
  },

  // Compression
  compress: true,

  // Powered by header
  poweredByHeader: false,

  // Environment variables that will be available at build time
  env: {
    APP_URL: process.env.APP_URL,
  },

  // Webpack configuration for optimizations
  webpack: (config, { dev, isServer }) => {
    // Only run in production builds
    if (!dev) {
      // Optimize CSS
      if (!isServer) {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: "styles",
            test: /\.(css|scss)$/,
            chunks: "all",
            enforce: true,
          },
        };

        // Add terser options for better minification
        config.optimization.minimizer = config.optimization.minimizer || [];
        config.optimization.minimizer.push(
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true, // Remove console.log in production
              },
              output: {
                comments: false, // Remove comments
              },
            },
            extractComments: false,
          })
        );
      }

      // Add bundle analyzer in analyze mode
      if (process.env.ANALYZE === "true") {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      }
    }

    return config;
  },
};

module.exports = nextConfig;
