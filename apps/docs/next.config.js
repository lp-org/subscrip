module.exports = {
  reactStrictMode: true,
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
        protocol: "http",
        port: "5000",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return "storefront";
  },
};
