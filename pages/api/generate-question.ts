import { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
  personality: string;
  context: string;
}

interface TestQuestionResponse {
  question: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestQuestionResponse | ErrorResponse>
) {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Destructure the required values from the body
  const { personality, context }: RequestBody = req.body;

  try {
    // Make the API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GPT4MINI_API_KEY}`, // Use the correct API key
      },
      body: JSON.stringify({
        model: 'gpt-4', // Or 'gpt-4-mini' if you're using GPT-4 Mini
        messages: [
          {
            role: 'system',
            content: `You are a test generator
                      generate a single question that would test if an AI agent matches that 
                      personality and understands the context. The question should be specific 
                      and challenging enough to evaluate context`,
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nGenerate a test question.`,
          },
        ],
      }),
    });

    // Parse the response from OpenAI
    const data = await response.json();

    // Handle the API response
    if (response.ok) {
      return res.status(200).json({ question: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: data.error.message });
    }
  } catch (error: any) {
    // Log and handle unexpected errors
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
}
