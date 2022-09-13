// pages/api/imageProxy.ts

import { withImageProxy } from '@blazity/next-image-proxy'

export default withImageProxy({ whitelistedPatterns: [/^https?:\/\/(.*).ipfs.w3s.link/] })