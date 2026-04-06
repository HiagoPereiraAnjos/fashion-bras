let cachedHandler = null;

async function resolveHandler() {
  if (cachedHandler) return cachedHandler;
  const module = await import("../artifacts/api-server/dist/serverless.mjs");
  cachedHandler = module.default;
  return cachedHandler;
}

module.exports = async function handler(req, res) {
  const app = await resolveHandler();
  return app(req, res);
};
