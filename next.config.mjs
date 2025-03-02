/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's2.googleusercontent.com',
                pathname: '**',
              },
        ]
    }
};

export default nextConfig;
