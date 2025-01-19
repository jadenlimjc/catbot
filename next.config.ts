import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: "cdn2.thecatapi.com",
            port: '',
            pathname: "/images/**",
        }
    ]
}
};

export default nextConfig;
