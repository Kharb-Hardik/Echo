import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.freepik.com',
      },
    ],  
  },
};

export default nextConfig;
