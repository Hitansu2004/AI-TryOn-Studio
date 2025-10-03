const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  enableInfiniteScroll: process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true',
  enableAnimations: process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS === 'true',
} as const;

export default config;
