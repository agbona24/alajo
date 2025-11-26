/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Disabled - using live server mode for Capacitor
  images: {
    domains: ['localhost'],
  },
}

module.exports = withPWA(nextConfig)
