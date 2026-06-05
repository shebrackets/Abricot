/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    additionalData: `@use '@/styles/variables' as *;`,
  },
}

export default nextConfig