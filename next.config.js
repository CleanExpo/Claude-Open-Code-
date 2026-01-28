/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    "remotion",
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/lambda",
    "puppeteer"
  ],
};

module.exports = nextConfig;
