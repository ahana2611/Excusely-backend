import { analyzeExcuse } from '../services/lieDetectorService';

interface LieDetectorRequest {
  text: string;
}

export async function lieDetectorRoutes(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json() as LieDetectorRequest;
    const result = await analyzeExcuse(body.text);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 