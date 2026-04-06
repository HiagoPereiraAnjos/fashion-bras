let cachedHandler = null;

async function resolveHandler() {
  if (cachedHandler) return cachedHandler;
  const module = await import('../dist/serverless.mjs');
  cachedHandler = module.default;
  return cachedHandler;
}

export default async function handler(request, response) {
  const app = await resolveHandler();
  return app(request, response);
}
