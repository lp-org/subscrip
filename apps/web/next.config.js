/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["awilix"],
  },
  transpilePackages: ["ui"],
};
