/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    INFURA_API_SECRET: process.env.INFURA_API_SECRET,
  },
  images: {
    domains: ['infura-ipfs.io'],
  },
};

module.exports = nextConfig;
