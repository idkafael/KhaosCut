const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    
    // Configuração para FFmpeg.wasm
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
  // Configuração para FFmpeg.wasm
  experimental: {
    serverComponentsExternalPackages: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
}

module.exports = nextConfig
