'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function ImproveRatingsPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [generatingSurvey, setGeneratingSurvey] = useState(false);

  const mockPractices = [
    { id: '1', name: 'Philadelphia Eye Institute', specialty: 'Ophthalmology' },
    { id: '2', name: 'Bay Area Vision Center', specialty: 'Ophthalmology' },
    { id: '3', name: 'Metro Optometry Associates', specialty: 'Optometry' }
  ];

  const handleAnalyzeMarket = async () => {
    setAnalyzing(true);
    
    // Simulate AI market analysis
    setTimeout(() => {
      setAnalysis({
        yourRatings: {
          google: 4.5,
          healthgrades: 4.3,
          vitals: 4.4,
          zocdoc: 4.6,
          yelp: 4.2,
          average: 4.4
        },
        competitorAverage: {
          google: 4.8,
          healthgrades: 4.7,
          vitals: 4.7,
          zocdoc: 4.8,
          yelp: 4.6,
          average: 4.7
        },
        gaps: [
          { platform: 'Yelp', gap: 0.4, priority: 'High' },
          { platform: 'Healthgrades', gap: 0.4, priority: 'High' },
          { platform: 'Vitals', gap: 0.3, priority: 'Medium' },
          { platform: 'Google', gap: 0.3, priority: 'Medium' },
          { platform: 'Zocdoc', gap: 0.2, priority: 'Low' }
        ],
        topCompetitors: [
          { name: 'Vision Excellence Center', avgRating: 4.9, reviewCount: 1200 },
          { name: 'Premier Eye Care', avgRating: 4.8, reviewCount: 950 },
          { name: 'Advanced Ophthalmology', avgRating: 4.7, reviewCount: 800 }
        ],
        competitorStrengths: [
          'Excellent patient communication and follow-up',
          'Short wait times and efficient scheduling',
          'Modern, comfortable office environment',
          'Friendly and knowledgeable staff',
          'Clear explanation of procedures and costs'
        ],
        improvementAreas: [
          'Enhance patient communication post-visit',
          'Reduce wait times in waiting room',
          'Improve office ambiance and comfort',
          'Streamline check-in/check-out process',
          'Better explain treatment plans and costs upfront'
        ]
      });
      setAnalyzing(false);
    }, 3000);
  };

  const handleGenerateSurvey = () => {
    setGeneratingSurvey(true);
    setTimeout(() => {
      setGeneratingSurvey(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ⭐ Improve My Ratings
            </h1>
            <p className="text-gray-600">
              AI-Powered Competitive Analysis & Survey Generation
            </p>
          </div>
          <Link href="/dashboard/advanced">
            <Button variant="outline">← Dashboard</Button>
          </Link>
        </div>

        {/* Practice Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Your Practice</CardTitle>
            <CardDescription>Choose which practice to analyze and improve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Practice</label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={selectedPractice}
                onChange={(e) => setSelectedPractice(e.target.value)}
              >
                <option value="">Select a practice...</option>
                {mockPractices.map(practice => (
                  <option key={practice.id} value={practice.id}>
                    {practice.name} - {practice.specialty}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              onClick={handleAnalyzeMarket}
              disabled={!selectedPractice || analyzing}
              className="w-full"
            >
              {analyzing ? '🔍 Analyzing Competitive Market...' : '🔍 Analyze My Market'}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Loading */}
        {analyzing && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <h2 className="text-2xl font-bold mb-2">Analyzing Your Competitive Market...</h2>
              <p className="text-gray-600 mb-6">
                AI is analyzing competitors and identifying improvement opportunities
              </p>
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Scraping competitor ratings...</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Analyzing review sentiment...</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Identifying common themes...</span>
                  <span className="text-blue-600">⟳</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Generating improvement strategies...</span>
                  <span className="text-gray-400">○</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && !analyzing && (
          <>
            {/* Rating Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Rating Analysis - You vs. Competitors</CardTitle>
                <CardDescription>See how you stack up against top competitors in your market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <h3 className="font-semibold mb-2">Your Average Rating</h3>
                    <p className="text-4xl font-bold text-blue-600">{analysis.yourRatings.average} ★</p>
                  </div>
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
                    <h3 className="font-semibold mb-2">Competitor Average</h3>
                    <p className="text-4xl font-bold text-orange-600">{analysis.competitorAverage.average} ★</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold mb-3">Platform-by-Platform Comparison</h3>
                  {analysis.gaps.map((gap: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="font-medium w-32">{gap.platform}</span>
                        <div className="flex-1 max-w-md">
                          <div className="flex justify-between text-sm mb-1">
                            <span>You: {analysis.yourRatings[gap.platform.toLowerCase()]}★</span>
                            <span>Competitors: {analysis.competitorAverage[gap.platform.toLowerCase()]}★</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(analysis.yourRatings[gap.platform.toLowerCase()] / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gap.priority === 'High' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {gap.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Competitors */}
            <Card>
              <CardHeader>
                <CardTitle>🏆 Top Competitors in Your Market</CardTitle>
                <CardDescription>Practices you're competing against</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.topCompetitors.map((comp: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{comp.name}</p>
                        <p className="text-sm text-gray-600">{comp.reviewCount} total reviews</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-yellow-600">{comp.avgRating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitor Strengths */}
            <Card>
              <CardHeader>
                <CardTitle>💪 What Competitors Are Doing Well</CardTitle>
                <CardDescription>Common themes from their 5-star reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.competitorStrengths.map((strength: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-600 rounded">
                      <span className="text-green-600 text-xl">✓</span>
                      <span className="text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Your Improvement Opportunities</CardTitle>
                <CardDescription>AI-identified areas to focus on based on competitor analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.improvementAreas.map((area: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 border-l-4 border-orange-600 rounded">
                      <span className="text-orange-600 text-xl">→</span>
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Survey Generation */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle>📝 Step 2: Generate Custom Patient Survey</CardTitle>
                <CardDescription>
                  AI will create platform-specific questions optimized to get positive reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold mb-2">Survey Will Include:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Platform-specific questions for Google, Healthgrades, Vitals, Zocdoc, and Yelp</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Questions designed to highlight your improvement areas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Optimized wording to encourage positive responses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Direct links to post reviews on each platform</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Email and SMS templates for patient outreach</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={handleGenerateSurvey}
                  disabled={generatingSurvey}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {generatingSurvey ? '✨ Generating AI Survey...' : '✨ Generate Custom Survey Questions'}
                </Button>

                {generatingSurvey && (
                  <div className="text-center py-4">
                    <div className="animate-pulse text-purple-600">
                      AI is crafting personalized survey questions...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Survey Results (shown after generation) */}
            {!generatingSurvey && (
              <Link href="/improve-ratings/survey">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-200">
                  <CardContent className="py-8 text-center">
                    <div className="text-5xl mb-3">📋</div>
                    <h3 className="text-xl font-bold mb-2 text-green-700">
                      View Your Custom Survey Questions
                    </h3>
                    <p className="text-gray-600">
                      Click to see platform-specific questions and distribution templates
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </>
        )}

        {/* Empty State */}
        {!analysis && !analyzing && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-2">Ready to Improve Your Ratings</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Select your practice above and let AI analyze your competitive market to generate 
                custom survey questions that will help you get better reviews
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}