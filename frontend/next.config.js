/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from the backend server
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
