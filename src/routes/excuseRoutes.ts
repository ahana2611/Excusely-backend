import { generateExcuse } from '../services/excuseService';

interface GenerateExcuseRequest {
  situation: string;
  tone: 'polite' | 'funny' | 'savage' | 'anxious';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  location: string;
  weather: string;
}

export async function excuseRoutes(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json() as GenerateExcuseRequest;
    
    // Validate required fields
    const requiredFields = ['situation', 'tone', 'timeOfDay', 'location', 'weather'];
    const missingFields = requiredFields.filter(field => !body[field as keyof GenerateExcuseRequest]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate tone
    const validTones = ['polite', 'funny', 'savage', 'anxious'];
    if (!validTones.includes(body.tone)) {
      return new Response(
        JSON.stringify({ error: `Invalid tone. Must be one of: ${validTones.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate timeOfDay
    const validTimes = ['morning', 'afternoon', 'evening'];
    if (!validTimes.includes(body.timeOfDay)) {
      return new Response(
        JSON.stringify({ error: `Invalid timeOfDay. Must be one of: ${validTimes.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await generateExcuse(body);
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