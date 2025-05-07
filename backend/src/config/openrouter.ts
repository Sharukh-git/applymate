import { fetch } from 'undici';
import dotenv from "dotenv";
dotenv.config();

type AIResponse = {
  matchScore: number;
  coverLetter: string;
  weakSkills: string[];
  suggestedImprovements: string[];
  suggestedCourses: string[];
};

export async function generateAIResponse(prompt: string, model = 'mistralai/mistral-7b-instruct'): Promise<AIResponse> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: `
You are an AI assistant that evaluates how well a RESUME matches a JOB DESCRIPTION.
You must return ONLY a valid stringified JSON object using **JSON.stringify({...})** — not a plain object or any explanation.

The JSON MUST follow this format:

{
  "matchScore": number (0 to 1),
  "weakSkills": string[],
  "suggestedImprovements": string[],
  "suggestedCourses": string[],
  "coverLetter": string
}

Important:
- Use JSON.stringify before responding
- Do NOT wrap in code blocks
- Do NOT add commentary, greetings, or explanations

RESUME:
${prompt.split('<<<JD>>>')[0]}

<<<JD>>>

JOB DESCRIPTION:
${prompt.split('<<<JD>>>')[1]}
`.trim(),
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error('❌ OpenRouter API error:', await response.text());
    throw new Error(`OpenRouter API failed: ${response.status}`);
  }

  const data: any = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    console.error('🛑 OpenRouter returned no content:', JSON.stringify(data, null, 2));
    throw new Error('AI response was empty. Please check the prompt or API key.');
  }

  try {
    
    if (typeof content === 'object') {
      console.warn('⚠️ AI returned raw object instead of string. Accepting it.');
      return content as AIResponse;
    }

    let cleaned = content.trim();

    
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('❌ Failed to parse structured AI response:', content);
    throw new Error('AI response was not valid JSON. Ensure it is stringified.');
  }
}
