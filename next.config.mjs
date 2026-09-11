/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  devIndicators: false,
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [128, 256, 384],
  },
};

export default nextConfig;
