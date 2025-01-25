"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

export default function StressTest() {
  const [apiKey, setApiKey] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('');
  const [concurrent, setConcurrent] = useState<number>(5);
  const [totalRequests, setTotalRequests] = useState<number>(20);
  const [prompt, setPrompt] = useState<string>('Tell me a brief joke');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats | null>(null);

  const runTest = async () => {
    setIsLoading(true);
    setResults([]);
    const testResults: TestResult[] = [];
    let completedRequests = 0;
    
    // Create batches of concurrent requests
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
      
      // Update results after each batch
      setResults([...testResults]);
    }
    
    // Calculate statistics
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

  const calculateStats = (results: TestResult[]) => {
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
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI API Stress Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e:any) => setApiKey(e.target.value)}
                placeholder="Enter API Key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">API Endpoint</label>
              <Input
                value={endpoint}
                onChange={(e:any) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/v1/chat"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Concurrent Requests</label>
              <Input
                type="number"
                value={concurrent}
                onChange={(e:any) => setConcurrent(parseInt(e.target.value))}
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Requests</label>
              <Input
                type="number"
                value={totalRequests}
                onChange={(e:any) => setTotalRequests(parseInt(e.target.value))}
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Test Prompt</label>
              <Input
                value={prompt}
                onChange={(e: any) => setPrompt(e.target.value)}
                placeholder="Enter test prompt"
              />
            </div>
            
            <Button 
              onClick={runTest} 
              disabled={isLoading || !apiKey || !endpoint}
              className="w-full"
            >
              {isLoading ? 'Running Test...' : 'Start Test'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successfulRequests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedRequests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Time</p>
                <p className="text-2xl font-bold">{stats.averageTime.toFixed(0)}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">P95 Time</p>
                <p className="text-2xl font-bold">{stats.p95.toFixed(0)}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Time</p>
                <p className="text-2xl font-bold">{stats.maxTime.toFixed(0)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Response Time Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <LineChart
                width={800}
                height={240}
                data={results}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="requestId" label={{ value: 'Request #', position: 'insideBottom' }} />
                <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#8884d8"
                  name="Response Time"
                />
              </LineChart>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
