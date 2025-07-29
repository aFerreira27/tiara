import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pimly-prod-assets.pimlyapp.com',
        port: '',
        pathname: '/5eacf20b-64f8-4ccc-be3e-5072cdf3a17f/**',
      },
    ],
  },
};

export default nextConfig;
