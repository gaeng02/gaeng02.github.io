/** @type {import('next').NextConfig} */
// Static export (output: 'export') is applied only for production builds, which
// is how the site deploys (GitHub Actions). In `next dev` we leave it off so the
// local-only /admin tool can use dev API routes (which static export forbids).
// The /admin + /api directories are committed for backup, but the CI workflow
// (deploy.yml) removes them before the production build — and `npm run build:local`
// sets them aside locally — so the static export always succeeds.
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.BASE_PATH || '',
  trailingSlash: false,
}

module.exports = nextConfig
