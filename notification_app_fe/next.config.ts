import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://20.207.122.201/evaluation-service/:path*',
      },
    ];
  },
};

export default nextConfig;
