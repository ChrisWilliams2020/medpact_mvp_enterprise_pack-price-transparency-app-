'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { WebScrapingService } from '@/lib/shared/services/webScrapingService';
import { CompetitiveAnalysisService } from '@/lib/shared/services/competitiveAnalysisService';

export default function CompetitiveAnalysisPage() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!websiteUrl) return;

    setLoading(true);
    try {
      // Step 1: Scrape competitor website
      const scrapedData = await WebScrapingService.scrapePracticeWebsite(
        websiteUrl,
        'competitor-1'
      );

      // Step 2: Generate competitive analysis
      const analysisResult = await CompetitiveAnalysisService.generateAnalysis(
        'my-practice-1',
        scrapedData
      );

      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze competitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🔍 Competitive Analysis
            </h1>
            <p className="text-gray-600">
              Compare your practice to competitors
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Analyze Competitor</CardTitle>
            <CardDescription>
              Enter a competitor's website URL to scrape and analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="https://competitor-practice.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAnalyze} disabled={loading || !websiteUrl}>
                {loading ? '🔄 Analyzing...' : '🚀 Analyze'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <>
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Overlap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">
                    {analysis.comparison.service_overlap}%
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Services you both offer
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">
                    {analysis.comparison.physician_quality_score}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Physician credentials rating
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specialty Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600">
                    {analysis.comparison.specialty_coverage}%
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Market coverage comparison
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Advantages */}
            <Card>
              <CardHeader>
                <CardTitle>Your Competitive Advantages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.comparison.competitive_advantage.map((advantage: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600">✅</span>
                      <span>{advantage}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas to Improve */}
            <Card>
              <CardHeader>
                <CardTitle>Areas to Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.comparison.areas_to_improve.map((area: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-600">⚠️</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Service Gaps */}
            <Card>
              <CardHeader>
                <CardTitle>Service Gaps ({analysis.gaps.length})</CardTitle>
                <CardDescription>Services your competitor offers that you don't</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.gaps.map((gap: any, i: number) => (
                    <div key={i} className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{gap.service}</p>
                          <p className="text-sm text-gray-600 mt-1">{gap.recommendation}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          gap.market_demand === 'high' ? 'bg-red-100 text-red-800' :
                          gap.market_demand === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {gap.market_demand} demand
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                      <span className="text-blue-600 text-xl">💡</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Competitor Physicians */}
            <Card>
              <CardHeader>
                <CardTitle>Competitor Physicians ({analysis.competitor.physicians.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.competitor.physicians.map((physician: any, i: number) => (
                    <div key={i} className="p-4 border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{physician.name}</p>
                          <p className="text-sm text-gray-600">{physician.title}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {physician.credentials.join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{physician.years_experience} years</p>
                          <p className="text-xs text-gray-500">experience</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium">Certifications:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {physician.board_certifications.map((cert: string, j: number) => (
                            <span key={j} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                      {physician.medical_school && (
                        <p className="text-sm text-gray-600 mt-2">
                          �� {physician.medical_school}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Report */}
            <Card>
              <CardHeader>
                <CardTitle>Export Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="w-full">📄 Download PDF</Button>
                  <Button className="w-full" variant="outline">📊 Export Excel</Button>
                  <Button className="w-full" variant="outline">📧 Email Report</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Instructions */}
        {!analysis && (
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔬</div>
                <p className="text-xl font-semibold mb-2">
                  Analyze Your Competition
                </p>
                <p className="text-gray-600 mb-4">
                  Enter a competitor's website to extract:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                  <div className="p-3 bg-white rounded">
                    <span className="text-2xl">👨‍⚕️</span>
                    <p className="text-sm font-medium mt-1">Physician Credentials</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="text-2xl">🏥</span>
                    <p className="text-sm font-medium mt-1">Services Offered</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="text-2xl">🎓</span>
                    <p className="text-sm font-medium mt-1">Training & Education</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="text-2xl">⏰</span>
                    <p className="text-sm font-medium mt-1">Office Hours</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="text-2xl">💳</span>
                    <p className="text-sm font-medium mt-1">Insurance Coverage</p>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <span className="text-2xl">📊</span>
                    <p className="text-sm font-medium mt-1">Competitive Gaps</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
