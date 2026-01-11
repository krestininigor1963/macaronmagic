/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['styles'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
