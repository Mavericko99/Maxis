"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Define types for test results, stats, and other data structures
interface TestResult {
  requestId: number;
  duration: number;
  success: boolean;
  error?: string;
  timestamp: number;
}

interface Stats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  p95: number;
}

const StressTest = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('');
  const [concurrent, setConcurrent] = useState<number>(5);
  const [totalRequests, setTotalRequests] = useState<number>(20);
  const [prompt, setPrompt] = useState<string>('Tell me a brief joke');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats | null>(null);

  const runTest = async (): Promise<void> => {
    setIsLoading(true);
    setResults([]);
    const testResults: TestResult[] = [];
    let completedRequests = 0;

    const batches = Math.ceil(totalRequests / concurrent);

    for (let batch = 0; batch < batches; batch++) {
      const batchPromises: Promise<TestResult>[] = [];
      const batchSize = Math.min(concurrent, totalRequests - batch * concurrent);

      for (let i = 0; i < batchSize; i++) {
        const requestPromise = makeRequest(completedRequests + i);
        batchPromises.push(requestPromise);
      }

      const batchResults = await Promise.all(batchPromises);
      testResults.push(...batchResults);
      completedRequests += batchSize;
      setResults([...testResults]);
    }

    calculateStats(testResults);
    setIsLoading(false);
  };

  const makeRequest = async (requestId: number): Promise<TestResult> => {
    const startTime = Date.now();

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey,
          endpoint,
          prompt,
        }),
      });

      const data = await response.json();
      const endTime = Date.now();

      return {
        requestId,
        duration: endTime - startTime,
        success: response.ok,
        error: response.ok ? undefined : data.error,
        timestamp: endTime,
      };
    } catch (error: any) {
      const endTime = Date.now();
      return {
        requestId,
        duration: endTime - startTime,
        success: false,
        error: error.message,
        timestamp: endTime,
      };
    }
  };

  const calculateStats = (results: TestResult[]): void => {
    const durations = results.map(r => r.duration);
    const successfulRequests = results.filter(r => r.success).length;

    const stats: Stats = {
      totalRequests: results.length,
      successfulRequests,
      failedRequests: results.length - successfulRequests,
      averageTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      minTime: Math.min(...durations),
      maxTime: Math.max(...durations),
      p95: durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)],
    };

    setStats(stats);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="border-0 bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
          <CardHeader className="border-b border-cyan-900/50">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              AI API Stress Test Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-300">API Key</label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API Key"
                    className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-300">API Endpoint</label>
                  <Input
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="https://api.example.com/v1/chat"
                    className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-300">Concurrent Requests</label>
                  <Input
                    type="number"
                    value={concurrent}
                    onChange={(e) => setConcurrent(parseInt(e.target.value))}
                    min="1"
                    className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cyan-300">Total Requests</label>
                  <Input
                    type="number"
                    value={totalRequests}
                    onChange={(e) => setTotalRequests(parseInt(e.target.value))}
                    min="1"
                    className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-300">Test Prompt</label>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter test prompt"
                  className="bg-gray-900/50 border-cyan-800 focus:border-cyan-500 text-cyan-50 placeholder:text-gray-500"
                />
              </div>

              <Button
                onClick={runTest}
                disabled={isLoading || !apiKey || !endpoint}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isLoading ? 'Running Test...' : 'Initialize Test Sequence'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {stats && (
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-purple-500/20">
            <CardHeader className="border-b border-purple-900/50">
              <CardTitle className="text-xl font-bold text-purple-400">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-900/50 rounded-lg border border-purple-900/50">
                  <p className="text-sm text-purple-300">Total Requests</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.totalRequests}</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-green-900/50">
                  <p className="text-sm text-green-300">Successful</p>
                  <p className="text-3xl font-bold text-green-400">{stats.successfulRequests}</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-red-900/50">
                  <p className="text-sm text-red-300">Failed</p>
                  <p className="text-3xl font-bold text-red-400">{stats.failedRequests}</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/50">
                  <p className="text-sm text-cyan-300">Average Time</p>
                  <p className="text-3xl font-bold text-cyan-400">{stats.averageTime.toFixed(0)}ms</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/50">
                  <p className="text-sm text-cyan-300">P95 Time</p>
                  <p className="text-3xl font-bold text-cyan-400">{stats.p95.toFixed(0)}ms</p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/50">
                  <p className="text-sm text-cyan-300">Max Time</p>
                  <p className="text-3xl font-bold text-cyan-400">{stats.maxTime.toFixed(0)}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <Card className="border-0 bg-gray-800/50 backdrop-blur-sm shadow-lg shadow-cyan-500/20">
            <CardHeader className="border-b border-cyan-900/50">
              <CardTitle className="text-xl font-bold text-cyan-400">Response Time Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-64">
                <LineChart
                  width={800}
                  height={240}
                  data={results}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="requestId" 
                    label={{ value: 'Request #', position: 'insideBottom' }} 
                    stroke="#94a3b8"
                  />
                  <YAxis 
                    label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} 
                    stroke="#94a3b8"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #0891b2',
                      borderRadius: '0.375rem'
                    }} 
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#0891b2"
                    strokeWidth={2}
                    dot={{ fill: '#0891b2' }}
                    name="Response Time"
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StressTest;
