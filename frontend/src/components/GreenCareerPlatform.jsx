import React, { useState, useEffect } from 'react';
import { User, Briefcase, BookOpen, TrendingUp, Award, Leaf, Target, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Green Jobs Database
const GREEN_JOBS = [
  {
    id: 1,
    title: "Solar Energy Engineer",
    sector: "Renewable Energy",
    requiredSkills: ["Solar PV Design", "Grid Integration", "Python", "AutoCAD"],
    salary: "6-12 LPA",
    demand: "300% growth by 2030",
    ndc: "Supports India's 500 GW renewable energy target by 2030",
    description: "Design and implement solar power systems for residential and commercial use"
  },
  {
    id: 2,
    title: "Climate Data Analyst",
    sector: "Climate Tech",
    requiredSkills: ["Python", "GIS Mapping", "Climate Modeling", "Data Visualization"],
    salary: "5-10 LPA",
    demand: "250% growth by 2030",
    ndc: "Essential for emissions tracking toward net-zero by 2070",
    description: "Analyze climate data to support policy decisions and carbon accounting"
  },
  {
    id: 3,
    title: "Precision Agriculture Specialist",
    sector: "Sustainable Agriculture",
    requiredSkills: ["IoT Sensors", "Crop Science", "Data Analytics", "Soil Science"],
    salary: "4-9 LPA",
    demand: "200% growth by 2030",
    ndc: "Reduces agricultural emissions and improves climate resilience",
    description: "Implement technology-driven farming solutions for climate-smart agriculture"
  },
  {
    id: 4,
    title: "Green Building Architect",
    sector: "Smart Cities",
    requiredSkills: ["Sustainable Design", "LEED Certification", "Energy Modeling", "CAD"],
    salary: "7-15 LPA",
    demand: "180% growth by 2030",
    ndc: "Supports urban climate adaptation and energy efficiency targets",
    description: "Design energy-efficient, environmentally sustainable buildings"
  },
  {
    id: 5,
    title: "Wind Energy Technician",
    sector: "Renewable Energy",
    requiredSkills: ["Wind Turbine Maintenance", "Electrical Systems", "Safety Protocols", "Mechanical Engineering"],
    salary: "4-8 LPA",
    demand: "220% growth by 2030",
    ndc: "Critical for achieving 500 GW renewable capacity",
    description: "Install, maintain and repair wind turbine systems"
  },
  {
    id: 6,
    title: "EV Charging Infrastructure Manager",
    sector: "Smart Cities",
    requiredSkills: ["Electrical Engineering", "Network Planning", "Project Management", "IoT"],
    salary: "6-12 LPA",
    demand: "400% growth by 2030",
    ndc: "Enables electric mobility transition reducing transport emissions",
    description: "Plan and manage electric vehicle charging networks"
  },
  {
    id: 7,
    title: "Carbon Accounting Specialist",
    sector: "Climate Tech",
    requiredSkills: ["Carbon Accounting", "Sustainability Reporting", "Data Analysis", "GHG Protocols"],
    salary: "5-11 LPA",
    demand: "280% growth by 2030",
    ndc: "Tracks emissions for net-zero commitments",
    description: "Measure and report organizational carbon footprints"
  },
  {
    id: 8,
    title: "Climate-Resilient Crop Developer",
    sector: "Sustainable Agriculture",
    requiredSkills: ["Plant Biology", "Genetic Research", "Climate Science", "Biotechnology"],
    salary: "6-13 LPA",
    demand: "150% growth by 2030",
    ndc: "Develops crops resistant to climate change impacts",
    description: "Research and develop climate-adaptive crop varieties"
  }
];

// Courses Database
const COURSES = [
  { id: 1, title: "Solar Energy Fundamentals", provider: "NPTEL", skills: ["Solar PV Design", "Grid Integration"], duration: "8 weeks", link: "#" },
  { id: 2, title: "Climate Data Analysis with Python", provider: "SWAYAM", skills: ["Python", "Climate Modeling", "Data Visualization"], duration: "12 weeks", link: "#" },
  { id: 3, title: "Precision Agriculture & IoT", provider: "NPTEL", skills: ["IoT Sensors", "Data Analytics"], duration: "6 weeks", link: "#" },
  { id: 4, title: "Sustainable Urban Planning", provider: "Coursera", skills: ["Sustainable Design", "Energy Modeling"], duration: "10 weeks", link: "#" },
  { id: 5, title: "GIS for Climate Analysis", provider: "SWAYAM", skills: ["GIS Mapping"], duration: "8 weeks", link: "#" },
  { id: 6, title: "Wind Energy Technology", provider: "NPTEL", skills: ["Wind Turbine Maintenance", "Electrical Systems"], duration: "6 weeks", link: "#" },
  { id: 7, title: "Carbon Footprint Management", provider: "edX", skills: ["Carbon Accounting", "GHG Protocols"], duration: "4 weeks", link: "#" },
  { id: 8, title: "Electric Vehicle Infrastructure", provider: "NPTEL", skills: ["Electrical Engineering", "Network Planning"], duration: "8 weeks", link: "#" }
];

// Mission LiFE Actions
const LIFE_ACTIONS = {
  energy: [
    { action: "Use LED bulbs throughout home", points: 10, skill: "Energy Efficiency" },
    { action: "Install solar water heater", points: 30, skill: "Renewable Energy Basics" },
    { action: "Conduct home energy audit", points: 20, skill: "Energy Conservation" }
  ],
  transport: [
    { action: "Use public transport daily", points: 15, skill: "Sustainable Mobility" },
    { action: "Cycle for short distances", points: 10, skill: "Urban Planning" },
    { action: "Advocate for EV adoption", points: 25, skill: "Climate Advocacy" }
  ],
  waste: [
    { action: "Start composting", points: 20, skill: "Circular Economy" },
    { action: "Zero plastic challenge", points: 30, skill: "Waste Management" },
    { action: "Proper e-waste disposal", points: 15, skill: "Environmental Responsibility" }
  ],
  water: [
    { action: "Rainwater harvesting", points: 35, skill: "Water Resource Management" },
    { action: "Drip irrigation for garden", points: 25, skill: "Climate Adaptation" },
    { action: "Fix water leaks", points: 10, skill: "Resource Conservation" }
  ]
};

const GreenCareerPlatform = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    name: '',
    skills: [],
    careerGoal: '',
    lifeActions: [],
    lifePoints: 0
  });
  const [availableSkills] = useState([
    "Python", "Solar PV Design", "Grid Integration", "AutoCAD", "GIS Mapping", 
    "Climate Modeling", "Data Visualization", "IoT Sensors", "Crop Science", 
    "Data Analytics", "Soil Science", "Sustainable Design", "LEED Certification",
    "Energy Modeling", "CAD", "Wind Turbine Maintenance", "Electrical Systems",
    "Safety Protocols", "Mechanical Engineering", "Network Planning", "Project Management",
    "Carbon Accounting", "Sustainability Reporting", "GHG Protocols", "Plant Biology",
    "Genetic Research", "Climate Science", "Biotechnology"
  ]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Calculate skill match
  const calculateMatch = (userSkills, jobSkills) => {
    const matched = userSkills.filter(skill => jobSkills.includes(skill));
    const percentage = (matched.length / jobSkills.length) * 100;
    return {
      percentage: Math.round(percentage),
      matched,
      missing: jobSkills.filter(skill => !userSkills.includes(skill))
    };
  };

  // Analyze jobs when skills change
  useEffect(() => {
    if (userProfile.skills.length > 0) {
      const analyzed = GREEN_JOBS.map(job => {
        const match = calculateMatch(userProfile.skills, job.requiredSkills);
        let lifeBoost = 0;
        
        // LiFE boost for sustainability-focused jobs
        if (['Renewable Energy', 'Climate Tech', 'Sustainable Agriculture'].includes(job.sector)) {
          lifeBoost = Math.min(15, Math.floor(userProfile.lifePoints / 10));
        }
        
        return {
          ...job,
          match: match.percentage + lifeBoost,
          matchedSkills: match.matched,
          missingSkills: match.missing,
          lifeBoost
        };
      }).sort((a, b) => b.match - a.match);
      
      setMatchedJobs(analyzed);
      
      // Recommend courses for top 3 jobs
      const topJobs = analyzed.slice(0, 3);
      const allMissingSkills = [...new Set(topJobs.flatMap(j => j.missingSkills))];
      const recommended = COURSES.filter(course => 
        course.skills.some(skill => allMissingSkills.includes(skill))
      ).slice(0, 6);
      
      setRecommendedCourses(recommended);
    }
  }, [userProfile.skills, userProfile.lifePoints]);

  const toggleSkill = (skill) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addLifeAction = (category, actionIndex) => {
    const action = LIFE_ACTIONS[category][actionIndex];
    setUserProfile(prev => ({
      ...prev,
      lifeActions: [...prev.lifeActions, action.action],
      lifePoints: prev.lifePoints + action.points
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Green Career Intelligence</h1>
                <p className="text-sm text-gray-600">Supporting India's Net-Zero Journey</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Mission LiFE Points</p>
                <p className="text-xl font-bold text-green-600">{userProfile.lifePoints}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'profile', label: 'Profile & Skills', icon: User },
              { id: 'jobs', label: 'Career Match', icon: Briefcase },
              { id: 'courses', label: 'Learning Path', icon: BookOpen },
              { id: 'life', label: 'Climate Action', icon: Leaf },
              { id: 'progress', label: 'My Progress', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Your Green Profile</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Career Goal</label>
                <select
                  value={userProfile.careerGoal}
                  onChange={(e) => setUserProfile({...userProfile, careerGoal: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a sector...</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Climate Tech">Climate Tech</option>
                  <option value="Sustainable Agriculture">Sustainable Agriculture</option>
                  <option value="Smart Cities">Smart Cities</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Skills (Click to add/remove)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        userProfile.skills.includes(skill)
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {userProfile.skills.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    ✓ {userProfile.skills.length} skills selected. Ready to find your green career!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {userProfile.skills.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Skills First</h3>
                <p className="text-gray-600 mb-4">Please go to Profile & Skills tab and select your skills to see job matches.</p>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Go to Profile
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Your Green Career Matches</h2>
                  <p className="text-green-100">Based on your skills and Mission LiFE commitment</p>
                </div>

                <div className="grid gap-4">
                  {matchedJobs.slice(0, 6).map(job => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {job.sector}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`text-3xl font-bold ${job.match >= 70 ? 'text-green-600' : job.match >= 40 ? 'text-yellow-600' : 'text-gray-400'}`}>
                            {job.match}%
                          </div>
                          <p className="text-xs text-gray-500">Match</p>
                          {job.lifeBoost > 0 && (
                            <p className="text-xs text-green-600 mt-1">+{job.lifeBoost}% LiFE boost</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500">Salary Range</p>
                          <p className="font-semibold text-gray-900">{job.salary}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Market Demand</p>
                          <p className="font-semibold text-gray-900">{job.demand}</p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 mb-1">🇮🇳 Paris Agreement Impact:</p>
                        <p className="text-sm text-blue-800">{job.ndc}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">✓ Skills You Have ({job.matchedSkills.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {job.matchedSkills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {job.missingSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">📚 Skills to Learn ({job.missingSkills.length}):</p>
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                      >
                        View Career Pathway
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {recommendedCourses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600">Add skills and explore jobs to get personalized course recommendations.</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Learning Path</h2>
                  <p className="text-gray-600">Courses to help you achieve your green career goals</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {recommendedCourses.map(course => (
                    <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">{course.title}</h3>
                        <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Provider:</span>
                          <span className="font-medium text-gray-900">{course.provider}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium text-gray-900">{course.duration}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills Covered:</p>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Enroll Now
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* LiFE Actions Tab */}
        {activeTab === 'life' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Mission LiFE - Lifestyle for Environment</h2>
              </div>
              <p className="text-green-100">Take climate actions to boost your green career profile!</p>
              <p className="text-2xl font-bold mt-4">Your Points: {userProfile.lifePoints}</p>
            </div>

            {Object.entries(LIFE_ACTIONS).map(([category, actions]) => (
              <div key={category} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">{category} Conservation</h3>
                <div className="space-y-3">
                  {actions.map((action, idx) => {
                    const completed = userProfile.lifeActions.includes(action.action);
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{action.action}</p>
                          <p className="text-sm text-gray-600">Skill gained: {action.skill}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            +{action.points} pts
                          </span>
                          <button
                            onClick={() => addLifeAction(category, idx)}
                            disabled={completed}
                            className={`px-4 py-2 rounded-lg font-medium ${
                              completed
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            {completed ? 'Completed ✓' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Climate Career Progress</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Skills Acquired</p>
                      <p className="text-3xl font-bold text-blue-600">{userProfile.skills.length}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Leaf className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">LiFE Points</p>
                      <p className="text-3xl font-bold text-green-600">{userProfile.lifePoints}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Career Matches</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {matchedJobs.filter(j => j.match >= 50).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {userProfile.lifePoints >= 100 && (
                <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-10 h-10 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">🌟 Climate Champion Badge Earned!</h3>
                      <p className="text-sm text-gray-700">Your commitment to sustainability makes you stand out to employers!</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Career Readiness by Sector</h3>
                
                {['Renewable Energy', 'Climate Tech', 'Sustainable Agriculture', 'Smart Cities'].map(sector => {
                  const sectorJobs = matchedJobs.filter(j => j.sector === sector);
                  const avgMatch = sectorJobs.length > 0 
                    ? Math.round(sectorJobs.reduce((acc, j) => acc + j.match, 0) / sectorJobs.length)
                    : 0;
                  
                  return (
                    <div key={sector} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{sector}</span>
                        <span className="text-sm font-semibold text-gray-700">{avgMatch}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            avgMatch >= 70 ? 'bg-green-500' : 
                            avgMatch >= 40 ? 'bg-yellow-500' : 
                            'bg-gray-400'
                          }`}
                          style={{ width: `${avgMatch}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {userProfile.skills.length > 0 && matchedJobs.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Next Steps to Boost Your Profile</h3>
                <div className="space-y-3">
                  {matchedJobs[0].missingSkills.slice(0, 3).map((skill, idx) => {
                    const relatedCourse = COURSES.find(c => c.skills.includes(skill));
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Learn {skill}</p>
                          {relatedCourse && (
                            <p className="text-sm text-gray-600">Recommended: {relatedCourse.title}</p>
                          )}
                        </div>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                          Start
                        </button>
                      </div>
                    );
                  })}
                  
                  {userProfile.lifePoints < 50 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Complete Mission LiFE Actions</p>
                        <p className="text-sm text-gray-600">Earn {50 - userProfile.lifePoints} more points to unlock Climate Champion badge</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('life')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Take Action
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.sector}</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-900 mb-2">🇮🇳 Paris Agreement Impact</h3>
                  <p className="text-green-800">{selectedJob.ndc}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Career Pathway</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <div>
                        <p className="font-medium text-gray-900">Entry Level: Junior {selectedJob.title}</p>
                        <p className="text-sm text-gray-600">Complete recommended courses, build portfolio</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <div>
                        <p className="font-medium text-gray-900">Mid Level: {selectedJob.title}</p>
                        <p className="text-sm text-gray-600">2-3 years experience, lead small projects</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <div>
                        <p className="font-medium text-gray-900">Senior Level: Lead {selectedJob.title}</p>
                        <p className="text-sm text-gray-600">5+ years, manage teams and major initiatives</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-2 border-green-300">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                      <div>
                        <p className="font-medium text-gray-900">Expert: Chief Sustainability Officer</p>
                        <p className="text-sm text-gray-600">Lead organization's climate strategy</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Skills Required</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-2">✓ You Have:</p>
                      {selectedJob.matchedSkills.map(skill => (
                        <span key={skill} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-2">📚 To Learn:</p>
                      {selectedJob.missingSkills.map(skill => (
                        <span key={skill} className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setActiveTab('courses');
                  }}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                >
                  View Recommended Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GreenCareerPlatform;
