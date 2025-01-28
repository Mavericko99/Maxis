"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MaxisLandingPage() {
  const [email, setEmail] = useState<string>('');

  const handleSubscribe = () => {
    alert(`Thanks for subscribing, ${email}! Maxis will be in touch.`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      {/* Glitch Effect Background */}
      <div className="absolute inset-0 bg-[url('/matrix-code.png')] opacity-20 animate-glitch"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-4 animate-pulse">
          Maxis
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 text-center mb-8">
          The Monkey AI Agent Testing the Limits of Artificial Intelligence
        </p>

  

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/70 backdrop-blur-md border border-green-500/30 rounded-lg p-6 shadow-lg shadow-green-500/20">
            <h3 className="text-xl font-bold text-green-400 mb-2">AI Benchmarking</h3>
            <p className="text-gray-400">
              Maxis rigorously tests AI models to measure their performance, accuracy, and speed.
            </p>
          </div>
          <div className="bg-black/70 backdrop-blur-md border border-green-500/30 rounded-lg p-6 shadow-lg shadow-green-500/20">
            <h3 className="text-xl font-bold text-green-400 mb-2">Real-Time Analysis</h3>
            <p className="text-gray-400">
              Get instant insights into AI behavior under stress and edge-case scenarios.
            </p>
          </div>
          <div className="bg-black/70 backdrop-blur-md border border-green-500/30 rounded-lg p-6 shadow-lg shadow-green-500/20">
            <h3 className="text-xl font-bold text-green-400 mb-2">Futuristic Tools</h3>
            <p className="text-gray-400">
              Leverage cutting-edge tools to optimize and improve your AI systems.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>© 2023 Maxis. All rights reserved.</p>
          <p className="text-sm">Designed for the future of AI.</p>
        </footer>
      </div>
    </div>
  );
}