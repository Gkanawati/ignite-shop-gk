/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  modularizeImports: {
    '@phosphor-icons/react': {
      transform: '@phosphor-icons/react/dist/ssr/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
    ],
  },
};

export default nextConfig;