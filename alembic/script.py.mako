"""A generic migration environment.

Revision ID: ${up_revision}
Revises: ${down_revision | none}
Create Date: ${create_date}
"""

from alembic import op
import sqlalchemy as sa


def upgrade():
${upgrades if upgrades else "    pass"}


def downgrade():
${downgrades if downgrades else "    pass"}

// Admin Role Definitions with Passwords
const ADMIN_ROLES = {
  medpact_team: {
    id: 'medpact_team',
    name: 'MedPact Team',
    icon: '🏢',
    password: 'medpact2026',
    access: ['survey', 'csv', 'emr', 'kcn', 'navigator', 'consultant', 'registration', 'onpaceplus', 'payment', 'renewal'],
    description: 'Full platform access'
  },
  owner: {
    id: 'owner',
    name: 'Owner',
    icon: '👔',
    password: 'owner2026',
    access: ['payment', 'renewal', 'survey'],
    description: 'Payment, renewal & survey access'
  },
  administrator: {
    id: 'administrator',
    name: 'Administrator',
    icon: '⚙️',
    password: 'admin2026',
    access: ['survey'],
    description: 'Survey generation access'
  }
};

// OnPacePlus Innovation Phases
const INNOVATION_PHASES = [
  { id: 'discovery', name: 'Discovery', icon: '🔍', color: '#6366F1', description: 'Identify opportunities and challenges' },
  { id: 'ideation', name: 'Ideation', icon: '💡', color: '#8B5CF6', description: 'Generate and evaluate ideas' },
  { id: 'planning', name: 'Planning', icon: '📋', color: '#EC4899', description: 'Define scope and resources' },
  { id: 'development', name: 'Development', icon: '🛠️', color: '#F59E0B', description: 'Build and iterate' },
  { id: 'implementation', name: 'Implementation', icon: '🚀', color: '#10B981', description: 'Deploy and launch' },
  { id: 'optimization', name: 'Optimization', icon: '📈', color: '#06B6D4', description: 'Measure and improve' }
];

// Practice Registration Questions
const REGISTRATION_QUESTIONS = [
  { id: 'practice_name', question: "What is your practice name?", type: 'text', category: 'basic' },
  { id: 'practice_type', question: "What type of practice is this?", type: 'select', options: ['Solo Practice', 'Group Practice', 'Multi-Location', 'Health System'], category: 'basic' },
  { id: 'specialty', question: "What is your primary specialty?", type: 'select', options: ['Ophthalmology', 'Optometry', 'Retina', 'Glaucoma', 'Cornea', 'Oculoplastics', 'Pediatric'], category: 'basic' },
  { id: 'npi', question: "What is your practice NPI number?", type: 'text', category: 'basic' },
  { id: 'tax_id', question: "What is your Tax ID / EIN?", type: 'text', category: 'basic' },
  { id: 'address', question: "What is your primary practice address?", type: 'text', category: 'location' },
  { id: 'city', question: "What city is your practice located in?", type: 'text', category: 'location' },
  { id: 'state', question: "What state?", type: 'select', options: ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'], category: 'location' },
  { id: 'zip', question: "What is your ZIP code?", type: 'text', category: 'location' },
  { id: 'phone', question: "What is your main phone number?", type: 'text', category: 'contact' },
  { id: 'email', question: "What is your practice email?", type: 'text', category: 'contact' },
  { id: 'website', question: "What is your website URL?", type: 'text', category: 'contact' },
  { id: 'provider_count', question: "How many providers work at your practice?", type: 'number', category: 'operations' },
  { id: 'staff_count', question: "How many staff members do you employ?", type: 'number', category: 'operations' },
  { id: 'locations_count', question: "How many locations do you operate?", type: 'number', category: 'operations' },
  { id: 'annual_patients', question: "Approximately how many patients do you see annually?", type: 'number', category: 'operations' },
  { id: 'emr_system', question: "What EMR/EHR system do you use?", type: 'select', options: ['Modernizing Medicine', 'Nextech', 'Epic', 'Athenahealth', 'DrChrono', 'AdvancedMD', 'Other', 'None'], category: 'technology' },
  { id: 'pm_system', question: "What Practice Management system do you use?", type: 'text', category: 'technology' },
  { id: 'payer_mix', question: "What is your approximate payer mix? (e.g., 40% Medicare, 30% Commercial, 30% Medicaid)", type: 'text', category: 'financial' },
  { id: 'annual_revenue', question: "What is your approximate annual revenue range?", type: 'select', options: ['Under $500K', '$500K - $1M', '$1M - $2.5M', '$2.5M - $5M', '$5M - $10M', 'Over $10M'], category: 'financial' },
  { id: 'services', question: "What services do you offer? (e.g., LASIK, Cataract Surgery, Glaucoma Treatment)", type: 'text', category: 'services' },
  { id: 'surgical_volume', question: "How many surgeries do you perform monthly?", type: 'number', category: 'services' },
  { id: 'goals', question: "What are your primary goals for using MedPact?", type: 'text', category: 'goals' },
  { id: 'challenges', question: "What are your biggest operational challenges?", type: 'text', category: 'goals' },
  { id: 'contact_name', question: "Who is the primary contact for this account?", type: 'text', category: 'contact' }
];

// Admin State (add these if not already present)
const [showAdminModal, setShowAdminModal] = useState(false);
const [selectedRole, setSelectedRole] = useState(null);
const [passwordInput, setPasswordInput] = useState('');
const [passwordError, setPasswordError] = useState('');
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentAdminRole, setCurrentAdminRole] = useState(null);
const [adminPanelTab, setAdminPanelTab] = useState('survey');

// Practice Registration Bot State
const [registrationStep, setRegistrationStep] = useState(0);
const [registrationAnswers, setRegistrationAnswers] = useState({});
const [registrationChat, setRegistrationChat] = useState([]);
const [registeredPractices, setRegisteredPractices] = useState([]);
const [currentInput, setCurrentInput] = useState('');

// OnPacePlus State
const [innovationProjects, setInnovationProjects] = useState([
  {
    id: 'proj-1',
    name: 'AI-Powered Scheduling Optimization',
    phase: 'development',
    priority: 'high',
    lead: 'Dr. Sarah Chen',
    team: ['John Smith', 'Maria Garcia'],
    targetDate: '2026-06-15',
    description: 'Implement ML-based scheduling to reduce no-shows by 30%',
    progress: 65,
    createdAt: '2026-02-01'
  },
  {
    id: 'proj-2',
    name: 'Patient Portal 2.0',
    phase: 'planning',
    priority: 'medium',
    lead: 'Mike Johnson',
    team: ['Lisa Wong'],
    targetDate: '2026-08-01',
    description: 'Enhanced patient portal with telehealth integration',
    progress: 25,
    createdAt: '2026-03-01'
  }
]);
const [showNewProjectModal, setShowNewProjectModal] = useState(false);
const [newProject, setNewProject] = useState({
  name: '',
  phase: 'discovery',
  priority: 'medium',
  lead: '',
  team: [],
  targetDate: '',
  description: ''
});

// Admin Authentication Handler
const handleAdminLogin = () => {
  const role = ADMIN_ROLES[selectedRole];
  if (role && passwordInput === role.password) {
    setIsAuthenticated(true);
    setCurrentAdminRole(role);
    setPasswordError('');
    setPasswordInput('');
    // Initialize registration chat
    setRegistrationChat([{
      type: 'bot',
      message: "👋 Welcome to MedPact Practice Registration! I'm your AI assistant. I'll help you register your practice by asking a few questions. Let's get started!",
      timestamp: new Date()
    }, {
      type: 'bot',
      message: REGISTRATION_QUESTIONS[0].question,
      timestamp: new Date()
    }]);
  } else {
    setPasswordError('Invalid password. Please try again.');
  }
};

// Practice Registration Handlers
const handleRegistrationInput = () => {
  if (!currentInput.trim()) return;
  
  const currentQuestion = REGISTRATION_QUESTIONS[registrationStep];
  
  // Add user response to chat
  setRegistrationChat(prev => [...prev, {
    type: 'user',
    message: currentInput,
    timestamp: new Date()
  }]);
  
  // Save answer
  setRegistrationAnswers(prev => ({
    ...prev,
    [currentQuestion.id]: currentInput
  }));
  
  // Move to next question or complete
  if (registrationStep < REGISTRATION_QUESTIONS.length - 1) {
    const nextStep = registrationStep + 1;
    setRegistrationStep(nextStep);
    
    setTimeout(() => {
      setRegistrationChat(prev => [...prev, {
        type: 'bot',
        message: `Great! ${REGISTRATION_QUESTIONS[nextStep].question}`,
        timestamp: new Date()
      }]);
    }, 500);
  } else {
    // Registration complete
    const practiceData = { ...registrationAnswers, [currentQuestion.id]: currentInput, id: `practice-${Date.now()}`, registeredAt: new Date().toISOString() };
    setRegisteredPractices(prev => [...prev, practiceData]);
    
    setTimeout(() => {
      setRegistrationChat(prev => [...prev, {
        type: 'bot',
        message: "🎉 Excellent! I've collected all the information. Your practice has been registered successfully!",
        timestamp: new Date()
      }, {
        type: 'bot',
        message: "📄 I'm generating your practice CSV file now. You can download it or view all registered practices.",
        timestamp: new Date()
      }]);
    }, 500);
  }
  
  setCurrentInput('');
};

const generatePracticeCSV = (practice) => {
  const headers = Object.keys(practice).join(',');
  const values = Object.values(practice).map(v => `"${v}"`).join(',');
  const csv = `${headers}\n${values}`;
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `practice_${practice.practice_name?.replace(/\s+/g, '_') || 'registration'}_${Date.now()}.csv`;
  a.click();
};

const resetRegistration = () => {
  setRegistrationStep(0);
  setRegistrationAnswers({});
  setRegistrationChat([{
    type: 'bot',
    message: "👋 Welcome to MedPact Practice Registration! I'm your AI assistant. I'll help you register your practice by asking a few questions. Let's get started!",
    timestamp: new Date()
  }, {
    type: 'bot',
    message: REGISTRATION_QUESTIONS[0].question,
    timestamp: new Date()
  }]);
  setCurrentInput('');
};

// OnPacePlus Handlers
const handleCreateProject = () => {
  const project = {
    ...newProject,
    id: `proj-${Date.now()}`,
    progress: 0,
    createdAt: new Date().toISOString(),
    team: newProject.team.split(',').map(t => t.trim()).filter(Boolean)
  };
  setInnovationProjects(prev => [...prev, project]);
  setShowNewProjectModal(false);
  setNewProject({
    name: '',
    phase: 'discovery',
    priority: 'medium',
    lead: '',
    team: [],
    targetDate: '',
    description: ''
  });
};

const updateProjectPhase = (projectId, newPhase) => {
  setInnovationProjects(prev => prev.map(p => 
    p.id === projectId ? { ...p, phase: newPhase } : p
  ));
};

// Admin Modal Component
const AdminModal = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🔐 Admin Management</h2>
        <button 
          onClick={() => {
            setShowAdminModal(false);
            setSelectedRole(null);
            setPasswordInput('');
            setPasswordError('');
          }}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >×</button>
      </div>
      
      {!selectedRole ? (
        <div className="space-y-3">
          <p className="text-gray-600 mb-4">Select your role to continue:</p>
          {Object.values(ADMIN_ROLES).map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className="w-full p-4 border-2 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4"
            >
              <span className="text-3xl">{role.icon}</span>
              <div className="text-left">
                <h3 className="font-semibold">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <span className="text-2xl">{ADMIN_ROLES[selectedRole].icon}</span>
            <span className="font-semibold">{ADMIN_ROLES[selectedRole].name}</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="••••••••"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedRole(null);
                setPasswordInput('');
                setPasswordError('');
              }}
              className="flex-1 py-3 border-2 rounded-xl hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleAdminLogin}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

// Admin Panel Component
const AdminPanel = () => {
  const hasAccess = (feature) => currentAdminRole?.access.includes(feature);
  
  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-2xl">{currentAdminRole?.icon}</span>
            <div>
              <h1 className="text-xl font-bold">Admin Panel - {currentAdminRole?.name}</h1>
              <p className="text-sm opacity-80">MedPact Practice Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentAdminRole(null);
              setShowAdminModal(false);
              setAdminPanelTab('survey');
            }}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
          >
            🚪 Logout
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {hasAccess('survey') && (
              <button
                onClick={() => setAdminPanelTab('survey')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'survey' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                🤖 AI Survey Generation
              </button>
            )}
            {hasAccess('registration') && (
              <button
                onClick={() => setAdminPanelTab('registration')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'registration' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                🏥 Practice Registration
              </button>
            )}
            {hasAccess('onpaceplus') && (
              <button
                onClick={() => setAdminPanelTab('onpaceplus')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'onpaceplus' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                📊 OnPacePlus Protocol
              </button>
            )}
            {hasAccess('csv') && (
              <button
                onClick={() => setAdminPanelTab('csv')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'csv' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                📄 CSV Conversion
              </button>
            )}
            {hasAccess('emr') && (
              <button
                onClick={() => setAdminPanelTab('emr')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'emr' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                🏥 EMR Integration
              </button>
            )}
            {hasAccess('kcn') && (
              <button
                onClick={() => setAdminPanelTab('kcn')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'kcn' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                🔑 KCN Access
              </button>
            )}
            {hasAccess('navigator') && (
              <button
                onClick={() => setAdminPanelTab('navigator')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'navigator' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                🧭 Navigation Expert
              </button>
            )}
            {hasAccess('consultant') && (
              <button
                onClick={() => setAdminPanelTab('consultant')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'consultant' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                👨‍💼 Select Consultant
              </button>
            )}
            {hasAccess('payment') && (
              <button
                onClick={() => setAdminPanelTab('payment')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'payment' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                💳 Payment
              </button>
            )}
            {hasAccess('renewal') && (
              <button
                onClick={() => setAdminPanelTab('renewal')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${adminPanelTab === 'renewal' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              >
                🔄 Renewal
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Practice Registration Bot */}
        {adminPanelTab === 'registration' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Chat Interface */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>🤖</span> AI Practice Registration Bot
                </h2>
                <p className="text-sm opacity-80">Interactive registration interview</p>
              </div>
              
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {registrationChat.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-purple-500 text-white rounded-br-md' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {msg.type === 'bot' && <span className="mr-2">🤖</span>}
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="border-t p-4">
                {registrationStep < REGISTRATION_QUESTIONS.length ? (
                  <div className="flex gap-2">
                    {REGISTRATION_QUESTIONS[registrationStep].type === 'select' ? (
                      <select
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        className="flex-1 p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select an option...</option>
                        {REGISTRATION_QUESTIONS[registrationStep].options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={REGISTRATION_QUESTIONS[registrationStep].type === 'number' ? 'number' : 'text'}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleRegistrationInput()}
                        className="flex-1 p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="Type your answer..."
                      />
                    )}
                    <button
                      onClick={handleRegistrationInput}
                      className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
                    >
                      Send
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={resetRegistration}
                      className="flex-1 py-3 border-2 rounded-xl hover:bg-gray-50"
                    >
                      🔄 Register Another Practice
                    </button>
                    <button
                      onClick={() => generatePracticeCSV(registeredPractices[registeredPractices.length - 1])}
                      className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
                    >
                      📄 Download CSV
                    </button>
                  </div>
                )}
                
                {/* Progress Indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{registrationStep}/{REGISTRATION_QUESTIONS.length} questions</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${(registrationStep / REGISTRATION_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registered Practices List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>📋</span> Registered Practices
                </h2>
                <p className="text-sm opacity-80">{registeredPractices.length} practices registered</p>
              </div>
              
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {registeredPractices.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <span className="text-4xl block mb-3">🏥</span>
                    <p>No practices registered yet</p>
                    <p className="text-sm">Complete the registration interview to add a practice</p>
                  </div>
                ) : (
                  registeredPractices.map(practice => (
                    <div key={practice.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{practice.practice_name}</h3>
                          <p className="text-sm text-gray-500">{practice.specialty} • {practice.practice_type}</p>
                          <p className="text-sm text-gray-500">{practice.city}, {practice.state}</p>
                        </div>
                        <button
                          onClick={() => generatePracticeCSV(practice)}
                          className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          📄 CSV
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* OnPacePlus Protocol */}
        {adminPanelTab === 'onpaceplus' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">📊 OnPacePlus Protocol</h2>
                <p className="text-gray-500">Innovation Management System - 6 Phase Pipeline</p>
              </div>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600"
              >
                + New Project
              </button>
            </div>
            
            {/* Phase Pipeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4">Innovation Phases</h3>
              <div className="grid grid-cols-6 gap-2">
                {INNOVATION_PHASES.map((phase, idx) => (
                  <div key={phase.id} className="text-center">
                    <div 
                      className="w-full p-4 rounded-xl text-white mb-2"
                      style={{ backgroundColor: phase.color }}
                    >
                      <span className="text-2xl block">{phase.icon}</span>
                      <span className="text-sm font-semibold">{phase.name}</span>
                    </div>
                    <p className="text-xs text-gray-500">{phase.description}</p>
                    {idx < INNOVATION_PHASES.length - 1 && (
                      <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Projects by Phase */}
            <div className="grid lg:grid-cols-3 gap-4">
              {INNOVATION_PHASES.map(phase => {
                const phaseProjects = innovationProjects.filter(p => p.phase === phase.id);
                return (
                  <div key={phase.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div 
                      className="p-3 text-white flex items-center gap-2"
                      style={{ backgroundColor: phase.color }}
                    >
                      <span>{phase.icon}</span>
                      <span className="font-semibold">{phase.name}</span>
                      <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
                        {phaseProjects.length}
                      </span>
                    </div>
                    <div className="p-3 space-y-2 min-h-[200px]">
                      {phaseProjects.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No projects in this phase</p>
                      ) : (
                        phaseProjects.map(project => (
                          <div key={project.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-sm">{project.name}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                project.priority === 'high' ? 'bg-red-100 text-red-700' :
                                project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {project.priority}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{project.description}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">👤 {project.lead}</span>
                              <span className="text-gray-400">📅 {project.targetDate}</span>
                            </div>
                            <div className="mt-2">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{project.progress}% complete</span>
                            </div>
                            {/* Phase Navigation */}
                            <div className="mt-2 flex gap-1">
                              {INNOVATION_PHASES.map(p => (
                                <button
                                  key={p.id}
                                  onClick={() => updateProjectPhase(project.id, p.id)}
                                  className={`flex-1 py-1 rounded text-xs ${
                                    project.phase === p.id 
                                      ? 'text-white' 
                                      : 'bg-gray-100 hover:bg-gray-200'
                                  }`}
                                  style={project.phase === p.id ? { backgroundColor: p.color } : {}}
                                  title={p.name}
                                >
                                  {p.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* New Project Modal */}
            {showNewProjectModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">📊 Create New Innovation Project</h2>
                    <button onClick={() => setShowNewProjectModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Project Name</label>
                      <input
                        type="text"
                        value={newProject.name}
                        onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., AI Scheduling System"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Starting Phase</label>
                        <select
                          value={newProject.phase}
                          onChange={(e) => setNewProject(prev => ({ ...prev, phase: e.target.value }))}
                          className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                        >
                          {INNOVATION_PHASES.map(phase => (
                            <option key={phase.id} value={phase.id}>{phase.icon} {phase.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select
                          value={newProject.priority}
                          onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value }))}
                          className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                        >
                          <option value="high">🔴 High</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="low">🟢 Low</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Project Lead</label>
                      <input
                        type="text"
                        value={newProject.lead}
                        onChange={(e) => setNewProject(prev => ({ ...prev, lead: e.target.value }))}
                        className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., Dr. Sarah Chen"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Team Members (comma-separated)</label>
                      <input
                        type="text"
                        value={newProject.team}
                        onChange={(e) => setNewProject(prev => ({ ...prev, team: e.target.value }))}
                        className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="e.g., John Smith, Maria Garcia"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Target Date</label>
                      <input
                        type="date"
                        value={newProject.targetDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, targetDate: e.target.value }))}
                        className="w-full p-3 border-2 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={newProject.description}
   