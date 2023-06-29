/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

// output node versions on vercel
process.env.BUILD_MODE && console.log('node versions: ', process.versions)

module.exports = nextConfig;
