/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // content-stable media: cache hard for a year so repeat visits and
    // in-site navigation never re-fetch the heavy files
    const immutable = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      { source: "/videos/:path*", headers: immutable },
      { source: "/reels/:path*", headers: immutable },
      { source: "/properties/:path*", headers: immutable },
    ];
  },
};

export default nextConfig;
