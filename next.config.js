/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SPORK_API_BASE_URL: process.env.SPORK_API_BASE_URL,
  }
}

module.exports = nextConfig
