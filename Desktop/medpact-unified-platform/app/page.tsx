'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/PageNavigation';
import { IntegrationDashboard } from '@/components/IntegrationDashboard';
import { 
  TrendingUp, 
  Calculator, 
  BarChart3, 
  Link2, 
  FileText,
  DollarSign,
  RefreshCw,
  Target,
  ArrowRight,
  Bell,
  Menu,
  X,
  Settings,
  LayoutTemplate,
  Share2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  // Removed useState for demo mode

  const features = [
    {
      title: 'Survey Templates',
      description: '8 professional pre-built surveys for patient experience, staff satisfaction, and more',
      icon: LayoutTemplate,
      path: '/surveys/templates',
      color: 'from-pink-500 to-rose-600',
      badge: 'NEW'
    },
    {
      title: 'Social Media Booster',
      description: 'Auto-post positive patient reviews to Facebook, Google, LinkedIn, and more',
      icon: Share2,
      path: '/social-media',
      color: 'from-blue-500 to-sky-600',
      badge: 'NEW'
    },
    {
      title: 'Outcome-Based Surveys',
      description: 'AI-powered survey builder with 140+ questions for efficiency, growth, and optimization',
      icon: FileText,
      path: '/surveys/builder',
      color: 'from-indigo-500 to-indigo-600',
      badge: 'NEW'
    },
    {
      title: 'C-Suite Dashboard',
      description: 'Executive command center with mission, stakeholders, and automated surveys',
      icon: Target,
      path: '/csuite',
      color: 'from-violet-500 to-violet-600',
      badge: 'NEW'
    },
    {
      title: 'Stakeholder Management',
      description: 'Organize employees, patients, customers, and vendors into targeted groups',
      icon: Settings,
      path: '/stakeholders',
      color: 'from-cyan-500 to-cyan-600',
      badge: 'NEW'
    },
    {
      title: 'Survey Calendar',
      description: 'Schedule recurring surveys with daily, weekly, monthly, or quarterly automation',
      icon: RefreshCw,
      path: '/surveys/calendar',
      color: 'from-emerald-500 to-emerald-600',
      badge: 'NEW'
    },
    {
      title: 'Consultant Marketplace',
      description: 'Find expert consultants, AI avatars, and integration apps for your needs',
      icon: Link2,
      path: '/marketplace/consultants',
      color: 'from-amber-500 to-amber-600',
      badge: 'NEW'
    },
    {
      title: '5-Stage Revenue Optimization',
      description: 'AI-powered contract analysis, market benchmarking, and automated payer negotiations',
      icon: TrendingUp,
      path: '/revenue-optimization',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate your revenue optimization potential with industry benchmarks',
      icon: Calculator,
      path: '/roi-calculator',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Financial Analytics',
      description: 'Real-time market insights, SEC filings, and payer intelligence',
      icon: BarChart3,
      path: '/financial-dashboard',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Integration Hub',
      description: 'Unified access to EHR, billing, analytics, and healthcare systems',
      icon: Link2,
      path: '/integrations',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Real-Time Alerts',
      description: 'Revenue opportunities, contract renewals, and critical notifications',
      icon: Bell,
      path: '/alerts',
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    { label: 'Avg Revenue Increase', value: '47%', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Avg Annual Savings', value: '$2.3M', icon: DollarSign, color: 'text-green-600' },
    { label: 'Contract Optimization', value: '94%', icon: Target, color: 'text-purple-600' },
    { label: 'System Uptime', value: '99.7%', icon: RefreshCw, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MedPact Platinum
            </h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" onClick={() => router.push('/csuite')}>
                <Target className="w-4 h-4 mr-2" />
                C-Suite
              </Button>
              <Button variant="ghost" onClick={() => router.push('/surveys/builder')}>
                <FileText className="w-4 h-4 mr-2" />
                Surveys
              </Button>
              <Button variant="ghost" onClick={() => router.push('/alerts')}>
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => router.push('/auth/signup')}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            {/* Mobile menu button removed for demo mode */}
          </div>

          {/* Mobile menu removed for demo mode */}
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4">
            MedPact Platinum Enterprise Platform
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            AI-powered surveys, revenue optimization, and business intelligence for Medical, Pharmaceutical, MedTech, and Diagnostics organizations
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 w-full sm:w-auto"
              onClick={() => router.push('/auth/signup')}
            >
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push('/surveys/builder')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Try Survey Builder
            </Button>
          </div>
          
          {/* Quick Access Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 mt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => router.push('/csuite')}
            >
              <Target className="w-4 h-4 mr-2" />
              C-Suite Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => router.push('/stakeholders')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Stakeholders
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => router.push('/marketplace/consultants')}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Find Consultants
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Dashboard Widgets - Phase 8 */}
        <div className="mb-16">
          <IntegrationDashboard />
        </div>

        {/* Features Grid */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800 px-4">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-purple-200 relative"
                onClick={() => router.push(feature.path)}
              >
                {feature.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {feature.badge}
                  </div>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise Benefits */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Enterprise-Grade Solution</CardTitle>
            <CardDescription className="text-blue-100">
              Built for healthcare organizations that demand excellence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  HIPAA Compliant
                </h4>
                <p className="text-sm text-blue-100">
                  Enterprise-level security and healthcare data protection
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Real-Time Analytics
                </h4>
                <p className="text-sm text-blue-100">
                  Live data processing and instant insights
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Seamless Integration
                </h4>
                <p className="text-sm text-blue-100">
                  Connect with your existing healthcare systems
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Navigation */}
      <PageNavigation
        previousPage={{ title: 'Alerts', path: '/alerts' }}
        nextPage={{ title: 'Revenue Optimization', path: '/revenue-optimization' }}
      />
    </div>
  );
}
