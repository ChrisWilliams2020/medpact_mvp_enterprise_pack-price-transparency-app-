// filepath: /Users/christopherwilliams/Projects/medpact-practice-intelligence/apps/web/src/components/AdminPanel.jsx

import React, { useState } from 'react';
import { 
  ADMIN_ROLES, 
  ADMIN_FEATURES, 
  CONSULTANTS, 
  EMR_SYSTEMS, 
  SURVEY_TEMPLATES 
} from '../config/adminConfig';

// ============================================
// Admin Login Modal Component
// ============================================
export const AdminLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setPassword('');
    setError('');
  };

  const handleLogin = async () => {
    if (!selectedRole || !password) {
      setError('Please select a role and enter password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const role = ADMIN_ROLES[selectedRole];
    if (role && role.password === password) {
      onLogin(selectedRole, role);
      setPassword('');
      setSelectedRole(null);
    } else {
      setError('Invalid password. Please try again.');
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔐</span>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Management</h2>
                <p className="text-indigo-200 text-sm">Select your role to continue</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Role Selection */}
          {!selectedRole ? (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Choose your administrative role to access the management panel:
              </p>
              
              {Object.entries(ADMIN_ROLES).map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => handleRoleSelect(key)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    role.color === 'purple' ? 'border-purple-200 hover:border-purple-400 hover:bg-purple-50' :
                    role.color === 'blue' ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' :
                    'border-green-200 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      role.color === 'purple' ? 'bg-purple-100' :
                      role.color === 'blue' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-400">
                          {role.permissions.length} permissions
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Password Entry */
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                ← Back to role selection
              </button>

              <div className={`p-4 rounded-xl ${
                ADMIN_ROLES[selectedRole].color === 'purple' ? 'bg-purple-50 border border-purple-200' :
                ADMIN_ROLES[selectedRole].color === 'blue' ? 'bg-blue-50 border border-blue-200' :
                'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ADMIN_ROLES[selectedRole].icon}</span>
                  <div>
                    <h3 className="font-semibold">{ADMIN_ROLES[selectedRole].name}</h3>
                    <p className="text-sm text-gray-600">{ADMIN_ROLES[selectedRole].description}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading || !password}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  isLoading || !password
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔓 Access Admin Panel
                  </span>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Contact MedPact support if you've forgotten your credentials
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Admin Panel Component
// ============================================
export const AdminPanel = ({ isOpen, onClose, role, roleData }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [surveyPrompt, setSurveyPrompt] = useState('');
  const [generatedSurvey, setGeneratedSurvey] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvAnalysis, setCsvAnalysis] = useState(null);
  const [selectedEMR, setSelectedEMR] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  if (!isOpen || !roleData) return null;

  const hasPermission = (permissionId) => {
    return roleData.permissions.includes(permissionId) || roleData.permissions.includes('full_access');
  };

  const getAccessibleFeatures = () => {
    return Object.values(ADMIN_FEATURES).filter(feature => hasPermission(feature.id));
  };

  const handleGenerateSurvey = async () => {
    if (!surveyPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedQuestions = [
      { id: 1, question: `Based on your request about "${surveyPrompt}", how would you rate the overall experience?`, type: 'rating' },
      { id: 2, question: 'What aspects exceeded your expectations?', type: 'text' },
      { id: 3, question: 'What areas need improvement?', type: 'text' },
      { id: 4, question: 'How likely are you to recommend our services?', type: 'nps' },
      { id: 5, question: 'Any additional comments or suggestions?', type: 'text' }
    ];
    
    setGeneratedSurvey({
      title: `AI-Generated Survey: ${surveyPrompt}`,
      questions: generatedQuestions,
      createdAt: new Date().toISOString()
    });
    
    setIsGenerating(false);
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCsvFile(file);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCsvAnalysis({
      fileName: file.name,
      rows: Math.floor(Math.random() * 500) + 100,
      columns: ['Patient ID', 'Name', 'DOB', 'Insurance', 'Last Visit', 'Provider'],
      issues: [
        { type: 'warning', message: '12 rows have missing DOB values' },
        { type: 'info', message: 'Date format detected: MM/DD/YYYY' },
        { type: 'success', message: 'Insurance column matches expected format' }
      ],
      recommendations: [
        'Convert date format to ISO 8601 for compatibility',
        'Fill missing DOB values or mark as "Unknown"',
        'Validate Insurance codes against payer list'
      ]
    });
  };

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'ai_survey_generation':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">🤖 AI Survey Generation</h3>
              <p className="text-gray-600 text-sm">
                Describe the survey you need, and our AI will generate customized questions.
              </p>
            </div>

            {/* Quick Templates */}
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Quick Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {SURVEY_TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSurveyPrompt(`Create a ${template.name.toLowerCase()} for our ophthalmology practice`)}
                    className="p-3 bg-gray-50 rounded-lg text-left hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span>{template.icon}</span>
                      <span className="text-sm font-medium">{template.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{template.questions} questions</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Survey
              </label>
              <textarea
                value={surveyPrompt}
                onChange={(e) => setSurveyPrompt(e.target.value)}
                placeholder="E.g., Create a post-cataract surgery follow-up survey focusing on recovery experience and vision improvement..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
              />
            </div>

            <button
              onClick={handleGenerateSurvey}
              disabled={isGenerating || !surveyPrompt.trim()}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isGenerating || !surveyPrompt.trim()
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isGenerating ? '🔄 Generating...' : '✨ Generate Survey'}
            </button>

            {/* Generated Survey */}
            {generatedSurvey && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-800">✅ Survey Generated!</h4>
                  <button className="text-sm text-green-700 hover:underline">Export</button>
                </div>
                <div className="space-y-2">
                  {generatedSurvey.questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-white rounded-lg border border-green-100">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">{idx + 1}.</span>
                        <div>
                          <p className="text-sm">{q.question}</p>
                          <span className="text-xs text-gray-400 capitalize">{q.type} response</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'csv_conversion':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">📄 AI-Guided CSV Conversion</h3>
              <p className="text-gray-600 text-sm">
                Upload your data files and let AI analyze, validate, and convert them for seamless integration.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleCSVUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">📤</div>
                <p className="font-medium">Drop your file here or click to upload</p>
                <p className="text-sm text-gray-500 mt-1">Supports CSV, XLSX, XLS files</p>
              </label>
            </div>

            {csvFile && csvAnalysis && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 File Analysis: {csvAnalysis.fileName}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Rows:</span>
                      <span className="ml-2 font-medium">{csvAnalysis.rows}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Columns:</span>
                      <span className="ml-2 font-medium">{csvAnalysis.columns.length}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {csvAnalysis.columns.map(col => (
                      <span key={col} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{col}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {csvAnalysis.issues.map((issue, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex items-start gap-2 ${
                      issue.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                      issue.type === 'success' ? 'bg-green-50 border border-green-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <span>{issue.type === 'warning' ? '⚠️' : issue.type === 'success' ? '✅' : 'ℹ️'}</span>
                      <span className="text-sm">{issue.message}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">💡 AI Recommendations</h4>
                  <ul className="space-y-1">
                    {csvAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                        <span>•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700">
                  ✅ Apply Fixes & Convert
                </button>
              </div>
            )}
          </div>
        );

      case 'emr_integration':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">🏥 EMR Integration</h3>
              <p className="text-gray-600 text-sm">
                Connect your Electronic Medical Records system for seamless data synchronization.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {EMR_SYSTEMS.map(emr => (
                <button
                  key={emr.id}
                  onClick={() => setSelectedEMR(emr)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedEMR?.id === emr.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${emr.status === 'Coming Soon' ? 'opacity-60' : ''}`}
                  disabled={emr.status === 'Coming Soon'}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{emr.icon}</span>
                    <div>
                      <div className="font-medium">{emr.name}</div>
                      <div className={`text-xs ${
                        emr.status === 'Available' ? 'text-green-600' :
                        emr.status === 'Coming Soon' ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>{emr.status}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedEMR && selectedEMR.status === 'Available' && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <h4 className="font-semibold text-indigo-800 mb-3">Configure {selectedEMR.name} Integration</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                    <input type="text" placeholder="https://your-emr-instance.com/api" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="password" placeholder="Enter your API key" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    🔗 Connect EMR
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'kcn_access':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">🔑 KCN Access</h3>
              <p className="text-gray-600 text-sm">
                Knowledge Clinical Network - Access clinical protocols, best practices, and peer insights.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { icon: '📚', title: 'Clinical Protocols', desc: '250+ ophthalmology protocols', count: 250 },
                { icon: '🔬', title: 'Research Database', desc: 'Latest clinical studies', count: 1200 },
                { icon: '👥', title: 'Peer Network', desc: 'Connect with specialists', count: 450 },
                { icon: '📊', title: 'Benchmarking Data', desc: 'Anonymous practice comparisons', count: 89 }
              ].map(item => (
                <div key={item.title} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {item.count}+
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'navigation_expert':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">🧭 Navigation Expert</h3>
              <p className="text-gray-600 text-sm">
                AI-powered assistant to help you navigate practice management decisions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Ask the Navigation Expert</h4>
                  <p className="text-sm text-indigo-100 mb-4">
                    Get guidance on practice decisions, regulations, best practices, and more.
                  </p>
                  <div className="bg-white/10 rounded-lg p-3">
                    <input
                      type="text"
                      placeholder="Ask a question... e.g., 'How do I improve patient retention?'"
                      className="w-full bg-transparent outline-none placeholder-indigo-200 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Popular Questions</h4>
              <div className="space-y-2">
                {[
                  'How can I reduce patient no-shows?',
                  'What are the best payer negotiation strategies?',
                  'How do I improve staff productivity?',
                  'What marketing channels work best for ophthalmology?'
                ].map((q, idx) => (
                  <button key={idx} className="w-full p-3 bg-gray-50 rounded-lg text-left hover:bg-indigo-50 text-sm">
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'select_consultant':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">👨‍💼 Select a Consultant</h3>
              <p className="text-gray-600 text-sm">
                Connect with MedPact practice consultants for personalized guidance.
              </p>
            </div>

            <div className="space-y-3">
              {CONSULTANTS.map(consultant => (
                <button
                  key={consultant.id}
                  onClick={() => setSelectedConsultant(consultant)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedConsultant?.id === consultant.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {consultant.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{consultant.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          consultant.availability === 'Available' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {consultant.availability}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{consultant.specialty} • {consultant.experience}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{consultant.rating}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {consultant.expertise.map(exp => (
                          <span key={exp} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{exp}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedConsultant && (
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700">
                📅 Schedule Consultation with {selectedConsultant.name.split(' ')[0]}
              </button>
            )}
          </div>
        );

      case 'payment_management':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">💳 Payment Management</h3>
              <p className="text-gray-600 text-sm">
                Manage your subscription billing and payment methods.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Current Plan</p>
                  <h4 className="text-2xl font-bold">MedPact Professional</h4>
                  <p className="text-sm text-blue-100 mt-1">$499/month • Renews April 20, 2026</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Active</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium mb-2">💳 Payment Method</h4>
                <p className="text-sm text-gray-600">Visa ending in 4242</p>
                <button className="text-sm text-indigo-600 hover:underline mt-2">Update</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium mb-2">📧 Billing Email</h4>
                <p className="text-sm text-gray-600">billing@bayareaeye.com</p>
                <button className="text-sm text-indigo-600 hover:underline mt-2">Change</button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium mb-3">Recent Invoices</h4>
              <div className="space-y-2">
                {[
                  { date: 'Mar 20, 2026', amount: '$499.00', status: 'Paid' },
                  { date: 'Feb 20, 2026', amount: '$499.00', status: 'Paid' },
                  { date: 'Jan 20, 2026', amount: '$499.00', status: 'Paid' }
                ].map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{inv.date}</span>
                    <span className="text-sm font-medium">{inv.amount}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{inv.status}</span>
                    <button className="text-sm text-indigo-600 hover:underline">Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'renewal_management':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">🔄 Renewal Management</h3>
              <p className="text-gray-600 text-sm">
                Manage your subscription renewals and contract terms.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="font-semibold text-yellow-800">Upcoming Renewal</h4>
                  <p className="text-sm text-yellow-700">Your subscription renews on April 20, 2026 (31 days)</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-Renewal</h4>
                    <p className="text-sm text-gray-500">Automatically renew subscription</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <h4 className="font-medium mb-3">Upgrade Options</h4>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">MedPact Enterprise</span>
                        <p className="text-sm text-purple-200">Multi-location support, API access</p>
                      </div>
                      <span className="font-bold">$999/mo</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">👈</div>
            <p>Select a feature from the sidebar to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{roleData.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">Administration Panel</h2>
              <p className="text-indigo-200 text-sm">Logged in as: {roleData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {roleData.permissions.length} permissions
            </span>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Available Features</h3>
              <div className="space-y-1">
                {getAccessibleFeatures().map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      activeFeature === feature.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{feature.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.category}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderFeatureContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
