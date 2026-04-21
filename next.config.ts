import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["172.22.128.1", "localhost"],
};

export default nextConfig;
