/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // This ignores TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // This ignores ESLint errors during build
  },
}

export default nextConfig