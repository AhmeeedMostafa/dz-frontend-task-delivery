/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    unoptimized: true
  },
   // Disable StrictMode to prevent double requesting/rendering in development to avoid confusions
  reactStrictMode: false,
};

export default nextConfig;
