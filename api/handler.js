// Alternative Vercel Serverless Function Handler
// Use this file if you continue to have 404 issues

import app from './index.js';

// Vercel serverless function handler
export default async function handler(req, res) {
  // Forward the request to Express app
  return app(req, res);
}
