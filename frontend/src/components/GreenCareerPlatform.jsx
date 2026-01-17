import React, { useState, useEffect } from 'react';
import { User, Briefcase, BookOpen, TrendingUp, Award, Leaf, Target, ChevronRight, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

// Initial State Constants (Fallbacks)
const INITIAL_PROFILE = {
  name: '',
  skills: [],
  careerGoal: '',
  lifeActions: [],
  lifePoints: 0
};

const GreenCareerPlatform = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data States
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lifeActions, setLifeActions] = useState({});
  const [userProfile, setUserProfile] = useState(INITIAL_PROFILE);
  
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Available Skills for Selection
  const [availableSkills] = useState([
    "Python", "Solar PV Design", "Grid Integration", "AutoCAD", "GIS Mapping", 
    "Climate Modeling", "Data Visualization", "IoT Sensors", "Crop Science", 
    "Data Analytics", "Soil Science", "Sustainable Design", "LEED Certification",
    "Energy Modeling", "CAD", "Wind Turbine Maintenance", "Electrical Systems",
    "Safety Protocols", "Mechanical Engineering", "Network Planning", "Project Management",
    "Carbon Accounting", "Sustainability Reporting", "GHG Protocols", "Plant Biology",
    "Genetic Research", "Climate Science", "Biotechnology"
  ]);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, coursesRes, lifeRes] = await Promise.all([
          axios.get('/api/jobs'),
          axios.get('/api/courses'),
          axios.get('/api/life/actions')
        ]);
        
        setJobs(jobsRes.data);
        setCourses(coursesRes.data);
        setLifeActions(lifeRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load platform data. Please ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Match Jobs API Call
  useEffect(() => {
    const fetchMatches = async () => {
      if (userProfile.skills.length > 0) {
        try {
          const res = await axios.post('/api/jobs/match', {
            skills: userProfile.skills,
            life_points: userProfile.lifePoints
          });
          setMatchedJobs(res.data);
          
          // Recommend courses based on missing skills of top job
          if (res.data.length > 0) {
            const topJob = res.data[0];
            const courseRes = await axios.post('/api/courses/recommend', {
              missing_skills: topJob.missing_skills || []
            });
            setRecommendedCourses(courseRes.data);
          }
        } catch (err) {
          console.error("Error matching jobs:", err);
        }
      }
    };

    fetchMatches();
  }, [userProfile.skills, userProfile.lifePoints]);

  // Save Profile API Call
  const saveProfile = async (updatedProfile) => {
    try {
      await axios.post('/api/user/profile', {
        name: updatedProfile.name,
        email: 'user@example.com', // Placeholder
        career_goal: updatedProfile.careerGoal,
        skills: updatedProfile.skills
      });
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const toggleSkill = (skill) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        skills: prev.skills.includes(skill)
          ? prev.skills.filter(s => s !== skill)
          : [...prev.skills, skill]
      };
      saveProfile(updated);
      return updated;
    });
  };

  const addLifeAction = async (category, actionIndex) => {
    const action = lifeActions[category][actionIndex];
    
    try {
      // Optimistic update
      setUserProfile(prev => ({
        ...prev,
        lifeActions: [...prev.lifeActions, action.action],
        lifePoints: prev.lifePoints + action.points
      }));

      // API Call
      await axios.post('/api/user/1/life-action', { // Using ID 1 as placeholder
        action: action.action,
        category: category,
        points: action.points
      });

    } catch (err) {
      console.error("Error recording life action:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Green Career Intelligence...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

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
                          <div className={`text-3xl font-bold ${job.match_percentage >= 70 ? 'text-green-600' : job.match_percentage >= 40 ? 'text-yellow-600' : 'text-gray-400'}`}>
                            {job.match_percentage}%
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
                          <p className="font-semibold text-gray-900">₹{job.salary_min/100000}-{job.salary_max/100000} LPA</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Market Demand</p>
                          <p className="font-semibold text-gray-900">{job.demand_growth}% growth</p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 mb-1">🇮🇳 Paris Agreement Impact:</p>
                        <p className="text-sm text-blue-800">{job.ndc_relevance}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">✓ Skills You Have ({job.matched_skills ? job.matched_skills.length : 0}):</p>
                          <div className="flex flex-wrap gap-2">
                            {job.matched_skills && job.matched_skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {job.missing_skills && job.missing_skills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">📚 Skills to Learn ({job.missing_skills ? job.missing_skills.length : 0}):</p>
                            <div className="flex flex-wrap gap-2">
                              {job.missing_skills && job.missing_skills.map(skill => (
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

            {Object.entries(lifeActions).map(([category, actions]) => (
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
                        {matchedJobs.filter(j => j.match_percentage >= 50).length}
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
                    ? Math.round(sectorJobs.reduce((acc, j) => acc + j.match_percentage, 0) / sectorJobs.length)
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
                  {matchedJobs.length > 0 && matchedJobs[0].missing_skills && matchedJobs[0].missing_skills.slice(0, 3).map((skill, idx) => {
                    const relatedCourse = courses.find(c => c.skills.includes(skill));
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
                  <p className="text-green-800">{selectedJob.ndc_relevance}</p>
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
                      {selectedJob.matched_skills && selectedJob.matched_skills.map(skill => (
                        <span key={skill} className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-2">📚 To Learn:</p>
                      {selectedJob.missing_skills && selectedJob.missing_skills.map(skill => (
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
