"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <div className="container mx-auto p-4 bg-gray-900 text-cyan-50 flex flex-col items-center pt-8 relative">
      <Link href="/">
        <Button variant="outline" className='absolute top-6 z-10 left-10 pl-3  rounded-full bg-transparent'>
          <ArrowLeft />
          Home</Button>
      </Link>
       
 

      <Card className="mb-6 border-0 mt-12 bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-cyan-500/20 max-w-4xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Personality Tester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">API Key</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your AI service API key"
                className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">API Endpoint</label>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1/chat"
                className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Context Description</label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe the context or background knowledge your AI agent should have..."
                rows={4}
                className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-cyan-300">Personality Description</label>
              <Textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Describe the desired personality traits of your AI agent..."
                rows={4}
                className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
              />
            </div>

            <Button
              onClick={runTest}
              disabled={isLoading || !apiKey || !endpoint || !context || !personality}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Running Test...' : 'Test AI Agent'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {testResults && !testResults.error && (
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-cyan-400">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-cyan-300">Test Question</h3>
                <p className="mt-1 text-gray-100">{testResults.question || 'No question generated'}</p>
              </div>

              <div>
                <h3 className="font-medium text-cyan-300">AI Response</h3>
                <p className="mt-1 text-gray-100">{testResults.answer || 'No response received'}</p>
              </div>

              <div>
                <h3 className="font-medium text-cyan-300">Rating</h3>
                <div className="mt-2 flex items-center">
                  <div className="text-3xl font-bold text-cyan-400">{formatRating(testResults.rating as any)}</div>
                  <div className="ml-2 text-sm text-gray-500">/ 1.00</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-cyan-300">Feedback</h3>
                <p className="mt-1 text-gray-100">{testResults.feedback || 'No feedback available'}</p>
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
