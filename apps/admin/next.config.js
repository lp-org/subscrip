/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["awilix", "react-hook-form"],
    serverActions: true,
  },
  transpilePackages: ["ui"],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
    ],
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return "admin";
  },
};
