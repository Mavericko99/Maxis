export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { apiKey, endpoint, question, context } = req.body;
  
    try {
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
              content: question
            }
          ]
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Fetch error: ${response.status}, ${errorText}`);
        return res.status(response.status).json({ error: errorText });
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      // Adjust based on the actual response structure
      if (!data.message || !data.message.content) {
        return res.status(500).json({ error: 'Unexpected API response structure', response: data });
      }
  
      return res.status(200).json({ answer: data.message.content });
    } catch (error) {
      console.error('Error during fetch:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  