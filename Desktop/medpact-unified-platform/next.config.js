/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ===== SECURITY CONFIGURATION =====
  
  // CRITICAL: Disable source maps in production to protect code
  productionBrowserSourceMaps: false,
  
  // Prevent webpack stats exposure
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in production
    if (!dev) {
      config.devtool = false;
    }
    
    // Additional security measures
    if (!isServer) {
      // Minimize bundle exposure
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    
    return config;
  },
  
  // Security headers (also set in middleware.ts)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
