/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/aquarium',
  images: {
    unoptimized: true,
  },
  // 確保靜態資源指向正確的路徑
  assetPrefix: '/aquarium',
};

export default nextConfig;
