import { Excuse } from '../models/Excuse';
import type { IExcuse } from '../models/Excuse';

// Fetch saved excuses for a user
export async function getVault(userId: string): Promise<IExcuse[]> {
  return Excuse.find({ userId }).sort({ createdAt: -1 });
}

// Save a new excuse
export async function saveExcuse(data: Partial<IExcuse>): Promise<IExcuse> {
  const excuse = new Excuse(data);
  return excuse.save();
} 