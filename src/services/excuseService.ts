import { config } from "dotenv";
config(); // This loads your .env file

import { Groq } from "groq-sdk";

interface GroqConfig {
  apiKey: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

interface ExcuseRequest {
  situation: string;
  tone: 'polite' | 'funny' | 'savage' | 'anxious';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  location?: string;
  weather?: string;
}

export async function generateExcuse(request: ExcuseRequest) {
  const modifiers = [
    "Make it detailed and realistic",
    "Add a touch of humor",
    "Include a quirky but believable twist",
    "Mention a made-up friend or situation",
    "Use casual, natural-sounding language",
    "Sound slightly panicked but composed",
  ];

  const promptStyle = modifiers[Math.floor(Math.random() * modifiers.length)];

  let prompt = `Generate a ${request.tone} excuse for the following situation:\nSituation: ${request.situation}\nTime of Day: ${request.timeOfDay}`;

  if (request.location) prompt += `\nLocation: ${request.location}`;
  if (request.weather) prompt += `\nWeather: ${request.weather}`;

  prompt += `\n\n${promptStyle}\n\nPlease provide a JSON response with three formats: whatsapp, email, voice.\nFormat: { "whatsapp": "...", "email": "...", "voice": "..." }`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that generates creative excuses in different formats. Always respond with valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama3-8b-8192",
    temperature: 0.9,
    max_tokens: 500,
    response_format: { type: "json_object" }
  });

  if (!response.choices?.[0]?.message?.content) {
    throw new Error('No response from Groq');
  }

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error parsing Groq response:', error);
    throw new Error('Failed to parse excuse response');
  }
} 