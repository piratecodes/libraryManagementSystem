/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        // domains: ['flowbite.com', 'images.unsplash.com', 'media.istockphoto.com', 'images.pexels.com', 'dummyimage.com', 'images.unsplash.com', "localhost"],
        remotePatterns: [ { hostname: 'flowbite.com' }, { hostname: 'cdn-icons-png.flaticon.com' }, { hostname: 'dummyimage.com' }, { hostname: 'm.media-amazon.com' }, { hostname: "flowbite.s3.amazonaws.com" }, { hostname: "localhost" }, ]
    },
};

export default nextConfig;
