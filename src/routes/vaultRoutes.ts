import { getVault, saveExcuse } from '../services/vaultService';
import type { IExcuse } from '../models/Excuse';

export async function vaultRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (url.pathname === '/vault') {
    if (req.method === 'GET') {
      try {
        // TODO: Get userId from auth/session
        const userId = url.searchParams.get('userId') || '';
        const excuses = await getVault(userId);
        return new Response(JSON.stringify(excuses), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error fetching vault:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch vault' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (req.method === 'POST') {
      try {
        const body = await req.json() as Partial<IExcuse>;
        const excuse = await saveExcuse(body);
        return new Response(JSON.stringify(excuse), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error saving excuse:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save excuse' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return new Response('Method not allowed', { status: 405 });
} 