/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// @ts-check

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Add any environment variables you need here
  },
  experimental: {
    serverActions: true,
  }
}

export default config;
