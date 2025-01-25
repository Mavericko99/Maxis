// pages/api/evaluate-response.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface EvaluationResponse {
  rating: number;
  feedback: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<EvaluationResponse | { error: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { personality, context, question, answer } = req.body;

  if (!personality || !context || !question || !answer) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Replace with your GPT-4-mini API endpoint
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GPT4MINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI response evaluator. Rate how well an AI's response matches 
                     the expected personality and demonstrates understanding of the given context. 
                     Provide a rating from 0 to 1 (e.g., 0.85) and brief feedback explaining the rating.`,
          },
          {
            role: 'user',
            content: `Personality: ${personality}\nContext: ${context}\nQuestion: ${question}\nAnswer: ${answer}\n\nEvaluate the response.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to evaluate response');
    }

    const evaluation = data.choices[0]?.message?.content || '';
    const ratingMatch = evaluation.match(/(\d*\.?\d+)/);
    const rating = ratingMatch ? parseFloat(ratingMatch[0]) : 0;
    const feedback = evaluation.replace(/(\d*\.?\d+)/, '').trim();

    return res.status(200).json({ rating, feedback });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
}
