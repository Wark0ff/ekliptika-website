/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // VPS: собирается в standalone и запускается systemd-юнитом (deploy/ekliptika.service).
  output: 'standalone',
  // Рядом лежат чужие lockfile-ы, без пина корня трассировка standalone берёт не ту папку.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [128, 256, 384],
  },
};

export default nextConfig;
