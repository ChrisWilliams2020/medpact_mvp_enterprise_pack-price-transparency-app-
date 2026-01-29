'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function SurveyQuestionsPage() {
  const [copiedPlatform, setCopiedPlatform] = useState('');

  const surveyQuestions = {
    google: {
      platform: 'Google',
      icon: '🔍',
      color: 'blue',
      directLink: 'https://g.page/r/YOUR_PRACTICE_ID/review',
      questions: [
        'How would you rate your overall experience at our practice?',
        'Was our office easy to find and access?',
        'How satisfied were you with our scheduling process?',
        'Did our staff greet you warmly and professionally?',
        'Would you recommend us to friends and family?'
      ],
      reviewPrompt: 'If you had a great experience, we\'d love if you could share it on Google!'
    },
    healthgrades: {
      platform: 'Healthgrades',
      icon: '🏥',
      color: 'green',
      directLink: 'https://www.healthgrades.com/physician/YOUR_PRACTICE',
      questions: [
        'How well did your doctor explain your condition and treatment options?',
        'Did you feel your doctor listened to your concerns?',
        'How would you rate the medical expertise of your provider?',
        'Was your doctor thorough during your examination?',
        'Did you feel confident in your treatment plan?'
      ],
      reviewPrompt: 'Help other patients find quality care - share your experience on Healthgrades!'
    },
    vitals: {
      platform: 'Vitals',
      icon: '💊',
      color: 'purple',
      directLink: 'https://www.vitals.com/doctors/YOUR_PRACTICE',
      questions: [
        'How long did you wait before being seen?',
        'Was the office clean and well-maintained?',
        'How would you rate the bedside manner of your doctor?',
        'Did the staff handle insurance and billing clearly?',
        'Was your appointment time convenient and respected?'
      ],
      reviewPrompt: 'Share your care experience on Vitals to help others make informed decisions!'
    },
    zocdoc: {
      platform: 'Zocdoc',
      icon: '📅',
      color: 'yellow',
      directLink: 'https://www.zocdoc.com/practice/YOUR_PRACTICE',
      questions: [
        'How easy was it to book your appointment online?',
        'Did you receive appointment reminders?',
        'Was the check-in process smooth and efficient?',
        'Did your appointment start on time?',
        'Would you book with us again through Zocdoc?'
      ],
      reviewPrompt: 'Loved booking with us? Leave a review on Zocdoc!'
    },
    yelp: {
      platform: 'Yelp',
      icon: '⭐',
      color: 'red',
      directLink: 'https://www.yelp.com/biz/YOUR_PRACTICE',
      questions: [
        'How would you describe the atmosphere of our office?',
        'Was our location convenient for you?',
        'How friendly and helpful was our front desk staff?',
        'Did we make you feel comfortable during your visit?',
        'What did you appreciate most about your experience?'
      ],
      reviewPrompt: 'Share your experience on Yelp to help your community find great care!'
    }
  };

  const handleCopy = (platform: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(''), 2000);
  };

  const emailTemplate = `Subject: We'd Love Your Feedback! 🌟

Dear [Patient Name],

Thank you for choosing Philadelphia Eye Institute for your eye care needs. We hope your recent visit exceeded your expectations!

Your feedback helps us continue to provide exceptional care and helps other patients in our community find quality eye care.

If you had a positive experience, we'd be grateful if you could take 2 minutes to share it on one of these platforms:

📍 Google: ${surveyQuestions.google.directLink}
🏥 Healthgrades: ${surveyQuestions.healthgrades.directLink}
💊 Vitals: ${surveyQuestions.vitals.directLink}
📅 Zocdoc: ${surveyQuestions.zocdoc.directLink}
⭐ Yelp: ${surveyQuestions.yelp.directLink}

Your review makes a real difference!

Thank you for being a valued patient.

Warm regards,
Philadelphia Eye Institute Team`;

  const smsTemplate = `Hi [Name]! Thanks for visiting us! 😊 If you had a great experience, we'd love a quick review: ${surveyQuestions.google.directLink} - Philadelphia Eye Institute`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📋 Your Custom Survey Questions
            </h1>
            <p className="text-gray-600">
              AI-Generated, Platform-Optimized Questions to Boost Your Ratings
            </p>
          </div>
          <Link href="/improve-ratings">
            <Button variant="outline">← Back to Analysis</Button>
          </Link>
        </div>

        {/* Success Banner */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">✨</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-green-700">
                  Survey Generated Successfully!
                </h3>
                <p className="text-gray-600">
                  Below are custom questions for each platform, optimized based on your competitive analysis. 
                  Send these to patients who had positive experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Questions */}
        {Object.entries(surveyQuestions).map(([key, data]) => (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{data.icon}</span>
                  <div>
                    <CardTitle>{data.platform} Survey Questions</CardTitle>
                    <CardDescription>Optimized questions for {data.platform} reviews</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(key, data.questions.join('\n'))}
                >
                  {copiedPlatform === key ? '✓ Copied!' : '📋 Copy Questions'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {data.questions.map((question, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className={`text-${data.color}-600 font-bold`}>{idx + 1}.</span>
                    <span className="flex-1">{question}</span>
                  </div>
                ))}
              </div>

              <div className={`p-4 bg-${data.color}-50 border-l-4 border-${data.color}-600 rounded`}>
                <p className="font-semibold mb-2">Review Request Message:</p>
                <p className="text-sm italic">{data.reviewPrompt}</p>
              </div>

              <div className="flex gap-2">
                <a href={data.directLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full">
                    🔗 Direct {data.platform} Review Link
                  </Button>
                </a>
                <Button 
                  variant="outline"
                  onClick={() => handleCopy(`${key}-prompt`, data.reviewPrompt)}
                >
                  {copiedPlatform === `${key}-prompt` ? '✓' : '📋'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Distribution Templates */}
        <Card>
          <CardHeader>
            <CardTitle>📧 Patient Outreach Templates</CardTitle>
            <CardDescription>Ready-to-use email and SMS templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Template */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Email Template</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy('email', emailTemplate)}
                >
                  {copiedPlatform === 'email' ? '✓ Copied!' : '📋 Copy Email'}
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border font-mono text-sm whitespace-pre-wrap">
                {emailTemplate}
              </div>
            </div>

            {/* SMS Template */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">SMS Template</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy('sms', smsTemplate)}
                >
                  {copiedPlatform === 'sms' ? '✓ Copied!' : '📋 Copy SMS'}
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border font-mono text-sm">
                {smsTemplate}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Best Practices for Using These Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <h4 className="font-semibold mb-2">✓ Do's</h4>
                <ul className="text-sm space-y-1">
                  <li>• Send within 24-48 hours after visit</li>
                  <li>• Only send to patients with positive experiences</li>
                  <li>• Personalize with patient's name</li>
                  <li>• Make it easy with direct links</li>
                  <li>• Follow up once if no response</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
                <h4 className="font-semibold mb-2">✗ Don'ts</h4>
                <ul className="text-sm space-y-1">
                  <li>• Don't incentivize reviews (violates policies)</li>
                  <li>• Don't send to unhappy patients</li>
                  <li>• Don't spam multiple times</li>
                  <li>• Don't ask only for 5-star reviews</li>
                  <li>• Don't make it complicated</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="py-6">
            <div className="flex gap-3 justify-center">
              <Button size="lg">📊 Export All Questions (PDF)</Button>
              <Button variant="outline" size="lg">📧 Email to Team</Button>
              <Button variant="outline" size="lg">📅 Schedule Campaign</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}