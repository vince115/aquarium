/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 不需要特別設定 basePath，除非你想強行改變 URL
  // 移除 output: 'export' 可以啟用更多 Next.js 的完整功能
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
