// pages/api/test.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { personality, context } = req.body;

  try {
    // Replace with OpenAI API endpoint
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GPT4MINI_API_KEY}`, // Make sure to use the correct key
      },
      body: JSON.stringify({
        model: 'gpt-4', // Or 'gpt-4-mini' if you're using GPT-4 Mini
        messages: [
          {
            role: 'system',
            content: `You are a test generator
                     generate a single question that would test if an AI agent matches that 
                     personality and understands the context. The question should be specific 
                     and challenging enough to evaluate context`
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nGenerate a test question.`
          }
        ],
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return res.status(200).json({ question: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: data.error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
