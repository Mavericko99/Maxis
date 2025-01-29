import { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
  apiKey: string;
  endpoint: string;
  question: string;
  context: string;
}

interface SuccessResponse {
  answer: string;
}

interface ErrorResponse {
  error: string;
  response?: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract parameters from request body
  const { apiKey, endpoint, question, context }: RequestBody = req.body;

  try {
    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Fetch error: ${response.status}, ${errorText}`);
      return res.status(response.status).json({ error: errorText });
    }

    // Parse the response data
    const data = await response.json();
    console.log('API Response:', data);

    // Check if response structure contains the expected message
    if (!data.message || !data.message.content) {
      return res.status(500).json({ error: 'Unexpected API response structure', response: data });
    }

    // Return the answer from the API response
    return res.status(200).json({ answer: data.message.content });
  } catch (error: any) {
    // Handle errors and log them
    console.error('Error during fetch:', error);
    return res.status(500).json({ error: error.message });
  }
}
