/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.microlink.io' },
      { protocol: 'https', hostname: 'image.thum.io' },
      { protocol: 'https', hostname: '**.microlink.io' },
    ],
  },
}

module.exports = nextConfig
