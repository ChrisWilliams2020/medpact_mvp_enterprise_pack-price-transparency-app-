'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

type Step = 'welcome' | 'demo' | 'opportunity' | 'login' | 'setup' | 'upload' | 'complete';
type DemoFeature = 'reminder' | 'analytics' | 'exports' | 'templates' | 'scheduling' | 'logic' | 'social' | null;

export default function SurveyGuidePage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [userChoice, setUserChoice] = useState<'gold' | 'unified' | null>(null);
  const [activeDemoFeature, setActiveDemoFeature] = useState<DemoFeature>(null);
  const [teamData, setTeamData] = useState({
    practiceName: '',
    contacts: [{ name: '', phone: '', email: '' }]
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const renderWelcome = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 border-0 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <CardHeader className="relative text-center py-12">
          <div className="text-7xl mb-6 animate-bounce">🏆</div>
          <CardTitle className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to MedPACT Gold
          </CardTitle>
          <CardDescription className="text-xl text-amber-100 max-w-2xl mx-auto">
            Transform Patient Feedback into Practice Growth with AI-Powered Intelligence
          </CardDescription>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm flex-wrap">
            <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full">
              ⚡ Lightning Fast Setup
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full">
              🤖 AI-Powered Insights
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-full">
              📈 Proven Results
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 7 Core Features - Enhanced Grid */}
      <Card className="border-2 border-amber-200 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-3xl flex items-center justify-center gap-3">
            <span className="text-4xl">✨</span>
            7 Powerful Features at Your Fingertips
          </CardTitle>
          <CardDescription className="text-base">
            Everything you need to dominate patient satisfaction
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📧', title: 'Reminder Emails', color: 'blue', desc: 'Auto-pilot communication' },
              { icon: '📊', title: 'Real-time Analytics', color: 'green', desc: 'Live insights dashboard' },
              { icon: '📥', title: 'Multi-format Exports', color: 'purple', desc: 'Export anywhere' },
              { icon: '📋', title: 'Survey Templates', color: 'orange', desc: '100+ proven templates' },
              { icon: '⏰', title: 'Survey Scheduling', color: 'pink', desc: 'Perfect timing, every time' },
              { icon: '🔀', title: 'Logic & Branching', color: 'indigo', desc: 'Smart adaptive surveys' },
              { icon: '📱', title: 'Social Media Booster', color: 'red', desc: 'Viral growth engine' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-5 bg-gradient-to-br from-amber-50 to-white rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <p className="font-bold text-base mb-1">{feature.title}</p>
                <p className="text-xs text-gray-600">{feature.desc}</p>
                <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Choose Your Path - Enhanced CTAs */}
      <Card className="border-2 border-purple-200 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-3xl">Choose Your Journey</CardTitle>
          <CardDescription className="text-base">
            Select the path that fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 border-2 border-blue-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="text-6xl mb-4 transform group-hover:rotate-12 transition-transform">🎬</div>
                <h3 className="font-bold text-2xl mb-3">Interactive Demo</h3>
                <p className="text-sm text-gray-600 mb-6 min-h-[60px]">
                  Experience all 7 features with sample data. No login required - jump in instantly!
                </p>
                <Button 
                  size="lg"
                  onClick={() => setCurrentStep('demo')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  <span className="mr-2">🚀</span>
                  Launch Demo Now
                </Button>
                <p className="text-xs text-gray-500 mt-3">⏱️ 5 minutes • No signup</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 border-2 border-green-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="text-6xl mb-4 transform group-hover:rotate-12 transition-transform">🎯</div>
                <h3 className="font-bold text-2xl mb-3">Find Opportunity</h3>
                <p className="text-sm text-gray-600 mb-6 min-h-[60px]">
                  Discover 4 proven strategies to grow revenue, improve efficiency & reduce costs
                </p>
                <Button 
                  size="lg"
                  onClick={() => setCurrentStep('opportunity')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                >
                  <span className="mr-2">💡</span>
                  Explore Opportunities
                </Button>
                <p className="text-xs text-gray-500 mt-3">📊 ROI Calculator included</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 border-2 border-amber-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="text-6xl mb-4 transform group-hover:rotate-12 transition-transform">🚀</div>
                <h3 className="font-bold text-2xl mb-3">Get Started</h3>
                <p className="text-sm text-gray-600 mb-6 min-h-[60px]">
                  Set up your account in under 3 minutes. Start transforming feedback today
                </p>
                <Button 
                  size="lg"
                  onClick={() => setCurrentStep('login')}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg"
                >
                  <span className="mr-2">⚡</span>
                  Start Free Trial
                </Button>
                <p className="text-xs text-gray-500 mt-3">🎁 30 days free • No credit card</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
        <CardContent className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-sm text-gray-600">Healthcare Practices</p>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-green-600 mb-2">2.5M</div>
              <p className="text-sm text-gray-600">Surveys Sent Monthly</p>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-purple-600 mb-2">87%</div>
              <p className="text-sm text-gray-600">Avg Response Rate</p>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-orange-600 mb-2">4.9★</div>
              <p className="text-sm text-gray-600">Customer Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOpportunity = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 border-0 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <CardHeader className="relative text-center py-10">
          <div className="text-6xl mb-4 animate-pulse">🎯</div>
          <CardTitle className="text-4xl font-extrabold mb-3">
            4 Sectors of Opportunity
          </CardTitle>
          <CardDescription className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover how MedPACT Gold drives measurable results across every aspect of your practice
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 4 Opportunity Sectors - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grow My Practice */}
        <Card 
          className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 transform hover:-translate-y-2 ${
            selectedOpportunity === 'grow' ? 'border-green-500 bg-gradient-to-br from-green-50 to-white ring-4 ring-green-200' : 'border-gray-200'
          }`}
          onClick={() => setSelectedOpportunity('grow')}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 rounded-full -mr-20 -mt-20 opacity-10 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="relative pt-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform">📈</div>
              <h3 className="font-bold text-3xl mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Grow My Practice
              </h3>
              <p className="text-base text-gray-600 font-semibold">Increase patient volume & revenue</p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '🎯', title: 'Patient Satisfaction Surveys', desc: 'Measure & improve patient experience to drive 5-star reviews' },
                { icon: '📱', title: 'Social Media Booster', desc: 'Convert happy patients into online advocates automatically' },
                { icon: '⭐', title: 'Online Reputation Management', desc: 'Boost ratings on Google, Healthgrades, Vitals & more' },
                { icon: '📊', title: 'Real-time Analytics', desc: 'Track trends & identify what drives patient loyalty' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border-2 border-green-100 hover:border-green-300 hover:shadow-md transition-all group/item">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl transform group-hover:item:scale-125 transition-transform">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOpportunity === 'grow' && (
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg transform hover:scale-105 transition-transform"
                onClick={() => setCurrentStep('demo')}
              >
                <span className="mr-2">🚀</span>
                Start Growing →
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Practice Efficiency */}
        <Card 
          className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 transform hover:-translate-y-2 ${
            selectedOpportunity === 'efficiency' ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white ring-4 ring-blue-200' : 'border-gray-200'
          }`}
          onClick={() => setSelectedOpportunity('efficiency')}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-10 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="relative pt-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform">⚡</div>
              <h3 className="font-bold text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Practice Efficiency
              </h3>
              <p className="text-base text-gray-600 font-semibold">Streamline operations & save time</p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '📧', title: 'Automated Reminder Emails', desc: 'Set it & forget it - automatic survey distribution' },
                { icon: '⏰', title: 'Survey Scheduling', desc: 'Send surveys at optimal times for maximum response' },
                { icon: '📋', title: 'Pre-built Templates', desc: '100+ proven survey templates ready to use' },
                { icon: '📥', title: 'Multi-format Exports', desc: 'Export to CSV, PDF, Excel - integrate anywhere' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group/item">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl transform group-hover/item:scale-125 transition-transform">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOpportunity === 'efficiency' && (
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transform hover:scale-105 transition-transform"
                onClick={() => setCurrentStep('demo')}
              >
                <span className="mr-2">⚡</span>
                Increase Efficiency →
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Staff Reallocation */}
        <Card 
          className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 transform hover:-translate-y-2 ${
            selectedOpportunity === 'reallocation' ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-white ring-4 ring-purple-200' : 'border-gray-200'
          }`}
          onClick={() => setSelectedOpportunity('reallocation')}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full -mr-20 -mt-20 opacity-10 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="relative pt-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform">🔄</div>
              <h3 className="font-bold text-3xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Staff Reallocation
              </h3>
              <p className="text-base text-gray-600 font-semibold">Optimize staff for better ROI</p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '🤖', title: 'Automation Replaces Manual Tasks', desc: 'Free staff from data entry & follow-up calls' },
                { icon: '🔀', title: 'Logic & Branching', desc: 'Smart surveys adapt - no staff intervention needed' },
                { icon: '📊', title: 'Instant Insights', desc: 'Real-time dashboards eliminate manual reporting' },
                { icon: '👥', title: 'Redeploy to Patient Care', desc: 'Move staff from admin to revenue-generating roles' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border-2 border-purple-100 hover:border-purple-300 hover:shadow-md transition-all group/item">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl transform group-hover/item:scale-125 transition-transform">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOpportunity === 'reallocation' && (
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg transform hover:scale-105 transition-transform"
                onClick={() => setCurrentStep('demo')}
              >
                <span className="mr-2">🔄</span>
                Optimize Staff →
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Reduce My Staff */}
        <Card 
          className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 transform hover:-translate-y-2 ${
            selectedOpportunity === 'reduce' ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-white ring-4 ring-orange-200' : 'border-gray-200'
          }`}
          onClick={() => setSelectedOpportunity('reduce')}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full -mr-20 -mt-20 opacity-10 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="relative pt-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform">💰</div>
              <h3 className="font-bold text-3xl mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Reduce My Staff
              </h3>
              <p className="text-base text-gray-600 font-semibold">Lower overhead & maximize profit</p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '🤖', title: 'Full Automation', desc: 'Eliminate dedicated survey/feedback staff' },
                { icon: '📧', title: 'No Manual Follow-ups', desc: 'Automated reminders replace staff phone calls' },
                { icon: '📊', title: 'Self-Service Analytics', desc: 'Doctors access insights directly - no analyst needed' },
                { icon: '💵', title: 'ROI: Save $40K-60K/year', desc: 'Average practice saves 1-2 FTE positions' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border-2 border-orange-100 hover:border-orange-300 hover:shadow-md transition-all group/item">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl transform group-hover/item:scale-125 transition-transform">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOpportunity === 'reduce' && (
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg transform hover:scale-105 transition-transform"
                onClick={() => setCurrentStep('demo')}
              >
                <span className="mr-2">💰</span>
                Calculate Savings →
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => setCurrentStep('demo')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl transform hover:scale-105 transition-all"
            >
              <span className="mr-2">🎬</span>
              See Features in Action
            </Button>
            <Button 
              size="lg"
              onClick={() => setCurrentStep('login')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-xl transform hover:scale-105 transition-all"
            >
              <span className="mr-2">🚀</span>
              Start Your Free Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => setCurrentStep('welcome')}
              className="border-2 hover:shadow-lg transform hover:scale-105 transition-all"
            >
              ← Back to Welcome
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDemo = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demo Section</CardTitle>
          <CardDescription>Interactive demo features coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderLogin = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Login Section</CardTitle>
          <CardDescription>Authentication features coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderSetup = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Setup Section</CardTitle>
          <CardDescription>Setup features coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Section</CardTitle>
          <CardDescription>Upload features coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Section</CardTitle>
          <CardDescription>Completion features coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Enhanced Progress Bar */}
        <div className="mb-10 sticky top-6 z-50 bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            {['welcome', 'opportunity', 'demo', 'login', 'setup', 'upload', 'complete'].map((step, idx) => {
              const steps = ['welcome', 'opportunity', 'demo', 'login', 'setup', 'upload', 'complete'];
              const currentIdx = steps.indexOf(currentStep);
              const isCompleted = currentIdx > idx;
              const isCurrent = currentIdx === idx;
              
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex-1 flex items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isCompleted ? 'bg-green-500 text-white shadow-lg scale-110' : 
                        isCurrent ? 'bg-amber-600 text-white shadow-lg scale-125 ring-4 ring-amber-200' : 
                        'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    {idx < 6 && (
                      <div className={`flex-1 h-2 mx-2 rounded-full transition-all duration-500 ${
                        currentIdx > idx ? 'bg-gradient-to-r from-green-500 to-amber-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span className={currentStep === 'welcome' ? 'text-amber-600 font-bold' : ''}>Welcome</span>
            <span className={currentStep === 'opportunity' ? 'text-amber-600 font-bold' : ''}>Opportunity</span>
            <span className={currentStep === 'demo' ? 'text-amber-600 font-bold' : ''}>Demo</span>
            <span className={currentStep === 'login' ? 'text-amber-600 font-bold' : ''}>Login</span>
            <span className={currentStep === 'setup' ? 'text-amber-600 font-bold' : ''}>Setup</span>
            <span className={currentStep === 'upload' ? 'text-amber-600 font-bold' : ''}>Upload</span>
            <span className={currentStep === 'complete' ? 'text-amber-600 font-bold' : ''}>Complete</span>
          </div>
        </div>

        {/* Render Current Step */}
        {currentStep === 'welcome' && renderWelcome()}
        {currentStep === 'opportunity' && renderOpportunity()}
        {currentStep === 'demo' && renderDemo()}
        {currentStep === 'login' && renderLogin()}
        {currentStep === 'setup' && renderSetup()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  );
}