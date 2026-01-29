'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PredictionEngine, PredictionResult } from '@/lib/predictionEngine';

export default function AIPredictionsPage() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);

  const generatePredictions = async () => {
    setLoading(true);
    try {
      const contractId = 'mock-contract-id'; // Replace with actual contract ID
      const practiceId = 'mock-practice-id'; // Replace with actual practice ID

      // Get predictions from the PredictionEngine
      const [contractPrediction, patientVolume] = await Promise.all([
        PredictionEngine.predictContractRenewal(contractId),
        PredictionEngine.predictPatientVolume(practiceId)
      ]);

      setPredictions({
        ...contractPrediction,
        patientVolumeForecast: patientVolume
      });
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePredictions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🤖 AI/ML Predictions
            </h1>
            <p className="text-gray-600">
              Advanced machine learning insights for your contracts
            </p>
          </div>
          <Link href="/dashboard/advanced">
            <Button variant="outline">← Dashboard</Button>
          </Link>
        </div>

        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin text-6xl mb-4">🔄</div>
              <h2 className="text-2xl font-bold mb-2">Running AI Analysis...</h2>
              <p className="text-gray-600">
                Machine learning models are processing your data
              </p>
            </CardContent>
          </Card>
        )}

        {predictions && !loading && (
          <>
            {/* Renewal Probability */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle>📊 Contract Renewal Prediction</CardTitle>
                <CardDescription>AI-predicted probability of contract renewal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Renewal Probability</p>
                    <p className="text-5xl font-bold text-green-600">
                      {(predictions.contractRenewalProbability * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full border-8 border-green-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-600">
                        {predictions.contractRenewalProbability > 0.7 ? '✓' : '⚠️'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Confidence: {(predictions.confidenceScore * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
                    style={{ width: `${predictions.contractRenewalProbability * 100}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600">
                  Based on historical data, practice ratings, referral volume, and market trends
                </p>
              </CardContent>
            </Card>

            {/* Revenue Prediction */}
            <Card>
              <CardHeader>
                <CardTitle>💰 Predicted Revenue Impact</CardTitle>
                <CardDescription>Forecasted revenue for next contract period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 mb-2">Predicted Contract Value</p>
                  <p className="text-5xl font-bold text-purple-600 mb-4">
                    ${predictions.predictedRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    ↑ 15% potential increase from current contract
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle>⚠️ Identified Risk Factors</CardTitle>
                <CardDescription>Areas requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {predictions.riskFactors.length > 0 ? (
                  <div className="space-y-2">
                    {predictions.riskFactors.map((risk: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 border-l-4 border-orange-600 rounded">
                        <span className="text-orange-600 text-xl">⚠️</span>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-6">No significant risk factors identified</p>
                )}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>💡 AI-Powered Recommendations</CardTitle>
                <CardDescription>Actionable insights to improve outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {predictions.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                      <span className="text-blue-600 text-xl">→</span>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient Volume Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>📈 6-Month Patient Volume Forecast</CardTitle>
                <CardDescription>AI-predicted patient trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around gap-2">
                  {predictions.patientVolumeForecast.map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                        style={{ height: `${(value / 3000) * 100}%` }}
                      ></div>
                      <p className="text-xs mt-2 font-semibold">{value}</p>
                      <p className="text-xs text-gray-500">M{idx + 1}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔄 Refresh Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={generatePredictions} className="w-full" size="lg">
                  Generate New Predictions
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
