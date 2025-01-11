export const env = {
  GITHUB_TOKEN: process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN,
  GITHUB_USERNAME: 'dcccrypto'
} as const 