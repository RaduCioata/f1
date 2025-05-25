/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000',
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${process.env.API_URL || 'http://localhost:4000'}/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig
