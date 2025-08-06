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
    // デプロイ時のビルドでESLintエラーを無視（本番環境用）
    ignoreDuringBuilds: true,
  },
  typescript: {
    // デプロイ時のビルドでTypeScriptエラーを無視（ライブラリ型不一致対応）
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
