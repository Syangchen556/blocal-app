/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true
  },
  // Enable source maps in development
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development'
};

export default nextConfig;
