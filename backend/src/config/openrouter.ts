import { fetch } from 'undici';

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
You are an AI assistant that evaluates how well a RESUME matches a JOB DESCRIPTION. Return ONLY a clean JSON object (no markdown, no commentary, no explanation).

Your output MUST strictly follow this format (use JSON.stringify before responding):

{
  "matchScore": number (between 0 and 1),
  "weakSkills": string[],
  "suggestedImprovements": string[],
  "suggestedCourses": string[],
  "coverLetter": string
}

Instructions:
- "matchScore": a number between 0.0 and 1.0 reflecting alignment between resume and job (skills, experience, tools, etc.).
- "weakSkills": key skills mentioned in the job description but missing or weak in the resume.
- "suggestedImprovements": specific suggestions to improve the resume’s alignment with the job.
- "suggestedCourses": 2–3 real course names or general learning topics that would help.
- "coverLetter": a concise, tailored, 150–200 word professional cover letter. Focus on relevant strengths. Do not say "as an AI" or include extra commentary.

STRICT RULES:
- Do NOT wrap response in code blocks (no \`\`\`json).
- Do NOT return explanations or text before/after JSON.
- Respond only with raw JSON, starting and ending with { and }.

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

  // Optional: log raw response if debugging
  // console.log('🔍 Raw AI content:', content);

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error('❌ Failed to parse structured AI response:', content);
    throw new Error('AI response was not valid JSON. Ensure it is stringified.');
  }
}
 