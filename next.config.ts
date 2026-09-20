import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "komeko.de",
      },
      {
        protocol: "https",
        hostname: "www.koreanbapsang.com",
      },
      {
        protocol: "https",
        hostname: "casuallypeckish.com",
      },
      {
        protocol: "https",
        hostname: "snapcalorie-webflow-website.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "toptiertea.com.tw",
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;
