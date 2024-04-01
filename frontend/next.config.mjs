/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    includePaths: ["/src/styles"],
  },
  experimental: {
    serverActions: {
      allowedForwardedHosts: [process.env.ALLOWED_SERVER_ACTION_ORIGIN],
      allowedOrigins: [process.env.ALLOWED_SERVER_ACTION_ORIGIN],
    },
  },
};

export default nextConfig;
