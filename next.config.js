/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    // 本番ではESLintエラーを検出させる
    ignoreDuringBuilds: false,
  },
  typescript: {
    // 型エラーも検出させる
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
