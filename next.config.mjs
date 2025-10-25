/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['avatars.githubusercontent.com'], // needed for GitHub profile images
  },
  env: {
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    REACT_APP_AWS_REGION: process.env.REACT_APP_AWS_REGION,
    REACT_APP_BEDROCK_AGENT_GROWTH: process.env.REACT_APP_BEDROCK_AGENT_GROWTH,
    REACT_APP_BEDROCK_AGENT_COMPETITOR: process.env.REACT_APP_BEDROCK_AGENT_COMPETITOR,
    REACT_APP_BEDROCK_AGENT_SOCIAL: process.env.REACT_APP_BEDROCK_AGENT_SOCIAL,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  experimental: {
    serverActions: true,
  },
}

export default nextConfig
