/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["awilix", "react-hook-form"],
  },
  transpilePackages: ["ui"],
};
