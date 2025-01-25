// pages/api/test.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { apiKey, endpoint, prompt } = req.body;

  try {
    // Make a request to the given endpoint with the provided data
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    // Parse the JSON response
    const data = await response.json();

    // If the response wasn't successful, throw an error
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    // Return the data from the external API
    return res.status(200).json(data);
  } catch (error: any) {
    // Catch any errors and return them as a JSON response
    return res.status(500).json({ error: error?.message || 'Internal Server Error' });
  }
}
