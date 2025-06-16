import { connectDB } from './utils/db';
import { excuseRoutes } from './routes/excuseRoutes';
import { alibiRoutes } from './routes/alibiRoutes';
import { vaultRoutes } from './routes/vaultRoutes';
import { lieDetectorRoutes } from './routes/lieDetectorRoutes';

// Connect to MongoDB
connectDB();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://excusely-frontend.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Main Bun server
Bun.serve({
  port: 3000,
  websocket: {
    message() {}, // Required empty message handler
  },
  async fetch(req) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    const url = new URL(req.url);
    console.log(`${req.method} ${url.pathname}`);

    let response: Response;

    try {
      if (url.pathname === '/generate-excuse') {
        response = await excuseRoutes(req);
      } else if (url.pathname === '/build-alibi') {
        response = await alibiRoutes(req);
      } else if (url.pathname === '/vault') {
        response = await vaultRoutes(req);
      } else if (url.pathname === '/lie-detector') {
        response = await lieDetectorRoutes(req);
      } else {
        response = new Response('Not found', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // Add CORS headers to all responses
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  },
});
