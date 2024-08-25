/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    { source: "/", destination: "/exchange-rate", permanent: true },
  ],
};

export default nextConfig;
