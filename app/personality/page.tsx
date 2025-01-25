"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Define types for test results and responses
interface TestResults {
  question?: string;
  answer?: string;
  rating?: number;
  feedback?: string;
  error?: string;
}

interface QuestionResponse {
  question: string;
}

interface AIResponse {
  answer: string;
}

interface EvaluationResponse {
  rating: number;
  feedback: string;
}

export default function AITester() {
  const [apiKey, setApiKey] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('');
  const [context, setContext] = useState<string>('');
  const [personality, setPersonality] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    try {
      // First, send personality to GPT-4-mini to generate a test question
      const questionResponse = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personality,
          context,
        }),
      });

      const { question }: QuestionResponse = await questionResponse.json();

      // Send the question to the user's AI API
      const aiResponse = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          endpoint,
          question,
          context,
        }),
      });

      const { answer }: AIResponse = await aiResponse.json();

      // Send the answer back to GPT-4-mini for evaluation
      const evaluationResponse = await fetch('/api/evaluate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personality,
          context,
          question,
          answer,
        }),
      });

      const { rating, feedback }: EvaluationResponse = await evaluationResponse.json();

      // Ensure rating has a default value if undefined
      setTestResults({
        question,
        answer,
        rating: rating || 0,
        feedback: feedback || 'No feedback available',
      });
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        error: 'Test failed. Please check your API configuration and try again.',
      });
    }
    setIsLoading(false);
  };

  // Helper function to safely format rating
  const formatRating = (rating: number): string => {
    if (typeof rating === 'number' && !isNaN(rating)) {
      return rating.toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Personality Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your AI service API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">API Endpoint</label>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1/chat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Context Description</label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe the context or background knowledge your AI agent should have..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Personality Description</label>
              <Textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Describe the desired personality traits of your AI agent..."
                rows={4}
              />
            </div>

            <Button
              onClick={runTest}
              disabled={isLoading || !apiKey || !endpoint || !context || !personality}
              className="w-full"
            >
              {isLoading ? 'Running Test...' : 'Test AI Agent'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults && !testResults.error && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Test Question</h3>
                <p className="mt-1 text-gray-600">{testResults.question || 'No question generated'}</p>
              </div>

              <div>
                <h3 className="font-medium">AI Response</h3>
                <p className="mt-1 text-gray-600">{testResults.answer || 'No response received'}</p>
              </div>

              <div>
                <h3 className="font-medium">Rating</h3>
                <div className="mt-2 flex items-center">
                  <div className="text-3xl font-bold">{formatRating(testResults.rating as any)}</div>
                  <div className="ml-2 text-sm text-gray-500">/ 1.00</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Feedback</h3>
                <p className="mt-1 text-gray-600">{testResults.feedback || 'No feedback available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {testResults?.error && (
        <Card className="border-red-200">
          <CardContent className="text-red-600 py-4">
            {testResults.error}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
