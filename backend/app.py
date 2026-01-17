from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import sqlite3

app = Flask(__name__)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('green_careers.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  email TEXT UNIQUE,
                  career_goal TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # User skills table
    c.execute('''CREATE TABLE IF NOT EXISTS user_skills
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  skill TEXT,
                  proficiency_level TEXT DEFAULT 'beginner',
                  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    # LiFE actions table
    c.execute('''CREATE TABLE IF NOT EXISTS life_actions
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  action TEXT,
                  category TEXT,
                  points INTEGER,
                  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    # Course enrollments
    c.execute('''CREATE TABLE IF NOT EXISTS enrollments
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  course_id INTEGER,
                  status TEXT DEFAULT 'enrolled',
                  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY(user_id) REFERENCES users(id))''')
    
    conn.commit()
    conn.close()

# Green Jobs Database
GREEN_JOBS = [
    {
        "id": 1,
        "title": "Solar Energy Engineer",
        "sector": "Renewable Energy",
        "required_skills": ["Solar PV Design", "Grid Integration", "Python", "AutoCAD"],
        "salary_min": 600000,
        "salary_max": 1200000,
        "demand_growth": 300,
        "ndc_relevance": "Supports India's 500 GW renewable energy target by 2030",
        "description": "Design and implement solar power systems for residential and commercial use"
    },
    {
        "id": 2,
        "title": "Climate Data Analyst",
        "sector": "Climate Tech",
        "required_skills": ["Python", "GIS Mapping", "Climate Modeling", "Data Visualization"],
        "salary_min": 500000,
        "salary_max": 1000000,
        "demand_growth": 250,
        "ndc_relevance": "Essential for emissions tracking toward net-zero by 2070",
        "description": "Analyze climate data to support policy decisions and carbon accounting"
    },
    {
        "id": 3,
        "title": "Precision Agriculture Specialist",
        "sector": "Sustainable Agriculture",
        "required_skills": ["IoT Sensors", "Crop Science", "Data Analytics", "Soil Science"],
        "salary_min": 400000,
        "salary_max": 900000,
        "demand_growth": 200,
        "ndc_relevance": "Reduces agricultural emissions and improves climate resilience",
        "description": "Implement technology-driven farming solutions for climate-smart agriculture"
    },
    {
        "id": 4,
        "title": "Green Building Architect",
        "sector": "Smart Cities",
        "required_skills": ["Sustainable Design", "LEED Certification", "Energy Modeling", "CAD"],
        "salary_min": 700000,
        "salary_max": 1500000,
        "demand_growth": 180,
        "ndc_relevance": "Supports urban climate adaptation and energy efficiency targets",
        "description": "Design energy-efficient, environmentally sustainable buildings"
    },
    {
        "id": 5,
        "title": "Wind Energy Technician",
        "sector": "Renewable Energy",
        "required_skills": ["Wind Turbine Maintenance", "Electrical Systems", "Safety Protocols", "Mechanical Engineering"],
        "salary_min": 400000,
        "salary_max": 800000,
        "demand_growth": 220,
        "ndc_relevance": "Critical for achieving 500 GW renewable capacity",
        "description": "Install, maintain and repair wind turbine systems"
    },
    {
        "id": 6,
        "title": "EV Charging Infrastructure Manager",
        "sector": "Smart Cities",
        "required_skills": ["Electrical Engineering", "Network Planning", "Project Management", "IoT"],
        "salary_min": 600000,
        "salary_max": 1200000,
        "demand_growth": 400,
        "ndc_relevance": "Enables electric mobility transition reducing transport emissions",
        "description": "Plan and manage electric vehicle charging networks"
    },
    {
        "id": 7,
        "title": "Carbon Accounting Specialist",
        "sector": "Climate Tech",
        "required_skills": ["Carbon Accounting", "Sustainability Reporting", "Data Analysis", "GHG Protocols"],
        "salary_min": 500000,
        "salary_max": 1100000,
        "demand_growth": 280,
        "ndc_relevance": "Tracks emissions for net-zero commitments",
        "description": "Measure and report organizational carbon footprints"
    },
    {
        "id": 8,
        "title": "Climate-Resilient Crop Developer",
        "sector": "Sustainable Agriculture",
        "required_skills": ["Plant Biology", "Genetic Research", "Climate Science", "Biotechnology"],
        "salary_min": 600000,
        "salary_max": 1300000,
        "demand_growth": 150,
        "ndc_relevance": "Develops crops resistant to climate change impacts",
        "description": "Research and develop climate-adaptive crop varieties"
    }
]

# Courses Database
COURSES = [
    {"id": 1, "title": "Solar Energy Fundamentals", "provider": "NPTEL", "skills": ["Solar PV Design", "Grid Integration"], "duration": "8 weeks", "level": "Beginner"},
    {"id": 2, "title": "Climate Data Analysis with Python", "provider": "SWAYAM", "skills": ["Python", "Climate Modeling", "Data Visualization"], "duration": "12 weeks", "level": "Intermediate"},
    {"id": 3, "title": "Precision Agriculture & IoT", "provider": "NPTEL", "skills": ["IoT Sensors", "Data Analytics"], "duration": "6 weeks", "level": "Beginner"},
    {"id": 4, "title": "Sustainable Urban Planning", "provider": "Coursera", "skills": ["Sustainable Design", "Energy Modeling"], "duration": "10 weeks", "level": "Intermediate"},
    {"id": 5, "title": "GIS for Climate Analysis", "provider": "SWAYAM", "skills": ["GIS Mapping"], "duration": "8 weeks", "level": "Beginner"},
    {"id": 6, "title": "Wind Energy Technology", "provider": "NPTEL", "skills": ["Wind Turbine Maintenance", "Electrical Systems"], "duration": "6 weeks", "level": "Beginner"},
    {"id": 7, "title": "Carbon Footprint Management", "provider": "edX", "skills": ["Carbon Accounting", "GHG Protocols"], "duration": "4 weeks", "level": "Beginner"},
    {"id": 8, "title": "Electric Vehicle Infrastructure", "provider": "NPTEL", "skills": ["Electrical Engineering", "Network Planning"], "duration": "8 weeks", "level": "Intermediate"}
]

# Mission LiFE Actions
LIFE_ACTIONS = {
    "energy": [
        {"action": "Use LED bulbs throughout home", "points": 10, "skill": "Energy Efficiency", "carbon_saved": 0.5},
        {"action": "Install solar water heater", "points": 30, "skill": "Renewable Energy Basics", "carbon_saved": 2.0},
        {"action": "Conduct home energy audit", "points": 20, "skill": "Energy Conservation", "carbon_saved": 1.0}
    ],
    "transport": [
        {"action": "Use public transport daily", "points": 15, "skill": "Sustainable Mobility", "carbon_saved": 1.5},
        {"action": "Cycle for short distances", "points": 10, "skill": "Urban Planning", "carbon_saved": 0.8},
        {"action": "Advocate for EV adoption", "points": 25, "skill": "Climate Advocacy", "carbon_saved": 0}
    ],
    "waste": [
        {"action": "Start composting", "points": 20, "skill": "Circular Economy", "carbon_saved": 1.2},
        {"action": "Zero plastic challenge", "points": 30, "skill": "Waste Management", "carbon_saved": 0.5},
        {"action": "Proper e-waste disposal", "points": 15, "skill": "Environmental Responsibility", "carbon_saved": 0.3}
    ],
    "water": [
        {"action": "Rainwater harvesting", "points": 35, "skill": "Water Resource Management", "carbon_saved": 0.7},
        {"action": "Drip irrigation for garden", "points": 25, "skill": "Climate Adaptation", "carbon_saved": 0.4},
        {"action": "Fix water leaks", "points": 10, "skill": "Resource Conservation", "carbon_saved": 0.2}
    ]
}

# Skill Matching Algorithm
def calculate_skill_match(user_skills, job_required_skills):
    """Calculate percentage match between user and job skills"""
    user_skills_set = set(user_skills)
    required_skills_set = set(job_required_skills)
    
    matched = user_skills_set.intersection(required_skills_set)
    missing = required_skills_set.difference(user_skills_set)
    
    match_percentage = (len(matched) / len(required_skills_set) * 100) if required_skills_set else 0
    
    return {
        "match_percentage": round(match_percentage, 2),
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "priority": "high" if match_percentage >= 70 else "medium" if match_percentage >= 40 else "low"
    }

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Get all green jobs"""
    sector = request.args.get('sector')
    if sector:
        filtered = [j for j in GREEN_JOBS if j['sector'] == sector]
        return jsonify(filtered)
    return jsonify(GREEN_JOBS)

@app.route('/api/jobs/match', methods=['POST'])
def match_jobs():
    """Match user skills with jobs"""
    data = request.json
    user_skills = data.get('skills', [])
    life_points = data.get('life_points', 0)
    
    matched_jobs = []
    for job in GREEN_JOBS:
        match = calculate_skill_match(user_skills, job['required_skills'])
        
        # LiFE boost for sustainability jobs
        life_boost = 0
        if job['sector'] in ['Renewable Energy', 'Climate Tech', 'Sustainable Agriculture']:
            life_boost = min(15, life_points // 10)
        
        matched_jobs.append({
            **job,
            "match_percentage": match['match_percentage'] + life_boost,
            "base_match": match['match_percentage'],
            "life_boost": life_boost,
            "matched_skills": match['matched_skills'],
            "missing_skills": match['missing_skills'],
            "priority": match['priority']
        })
    
    # Sort by match percentage
    matched_jobs.sort(key=lambda x: x['match_percentage'], reverse=True)
    
    return jsonify(matched_jobs)

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all courses"""
    return jsonify(COURSES)

@app.route('/api/courses/recommend', methods=['POST'])
def recommend_courses():
    """Recommend courses based on missing skills"""
    data = request.json
    missing_skills = data.get('missing_skills', [])
    
    recommended = []
    for course in COURSES:
        # Check if course teaches any missing skills
        teaches_missing = any(skill in course['skills'] for skill in missing_skills)
        if teaches_missing:
            relevance_score = len(set(course['skills']).intersection(set(missing_skills)))
            recommended.append({
                **course,
                "relevance_score": relevance_score,
                "teaches_missing": list(set(course['skills']).intersection(set(missing_skills)))
            })
    
    # Sort by relevance
    recommended.sort(key=lambda x: x['relevance_score'], reverse=True)
    
    return jsonify(recommended)

@app.route('/api/life/actions', methods=['GET'])
def get_life_actions():
    """Get all Mission LiFE actions"""
    return jsonify(LIFE_ACTIONS)

@app.route('/api/user/profile', methods=['POST'])
def save_user_profile():
    """Save or update user profile"""
    data = request.json
    
    conn = sqlite3.connect('green_careers.db')
    c = conn.cursor()
    
    try:
        # Insert or update user
        c.execute('''INSERT OR REPLACE INTO users (name, email, career_goal)
                     VALUES (?, ?, ?)''',
                  (data.get('name'), data.get('email'), data.get('career_goal')))
        
        user_id = c.lastrowid
        
        # Save skills
        c.execute('DELETE FROM user_skills WHERE user_id = ?', (user_id,))
        for skill in data.get('skills', []):
            c.execute('''INSERT INTO user_skills (user_id, skill)
                        VALUES (?, ?)''', (user_id, skill))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "user_id": user_id,
            "message": "Profile saved successfully"
        })
    
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/user/<int:user_id>/life-action', methods=['POST'])
def complete_life_action(user_id):
    """Record completed LiFE action"""
    data = request.json
    
    conn = sqlite3.connect('green_careers.db')
    c = conn.cursor()
    
    try:
        c.execute('''INSERT INTO life_actions (user_id, action, category, points)
                     VALUES (?, ?, ?, ?)''',
                  (user_id, data.get('action'), data.get('category'), data.get('points')))
        
        conn.commit()
        
        # Calculate total points
        c.execute('SELECT SUM(points) FROM life_actions WHERE user_id = ?', (user_id,))
        total_points = c.fetchone()[0] or 0
        
        return jsonify({
            "success": True,
            "total_points": total_points,
            "message": "Action recorded successfully"
        })
    
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    
    finally:
        conn.close()

@app.route('/api/analytics/sector-readiness', methods=['POST'])
def analyze_sector_readiness():
    """Analyze user readiness across different sectors"""
    data = request.json
    user_skills = data.get('skills', [])
    
    sector_analysis = {}
    
    for sector in ['Renewable Energy', 'Climate Tech', 'Sustainable Agriculture', 'Smart Cities']:
        sector_jobs = [j for j in GREEN_JOBS if j['sector'] == sector]
        
        if sector_jobs:
            matches = [calculate_skill_match(user_skills, j['required_skills'])['match_percentage'] 
                      for j in sector_jobs]
            avg_match = sum(matches) / len(matches)
            
            sector_analysis[sector] = {
                "average_match": round(avg_match, 2),
                "job_count": len(sector_jobs),
                "readiness_level": "High" if avg_match >= 70 else "Medium" if avg_match >= 40 else "Low"
            }
    
    return jsonify(sector_analysis)

@app.route('/api/analytics/ndc-impact', methods=['GET'])
def get_ndc_impact():
    """Get platform's contribution to NDC targets"""
    conn = sqlite3.connect('green_careers.db')
    c = conn.cursor()
    
    # Calculate metrics
    c.execute('SELECT COUNT(*) FROM users')
    total_users = c.fetchone()[0]
    
    c.execute('SELECT SUM(points) FROM life_actions')
    total_life_points = c.fetchone()[0] or 0
    
    c.execute('SELECT COUNT(*) FROM enrollments')
    total_enrollments = c.fetchone()[0]
    
    conn.close()
    
    # Estimate carbon impact (rough calculation)
    estimated_carbon_saved = total_life_points * 0.01  # tons CO2
    
    return jsonify({
        "total_users": total_users,
        "total_life_points": total_life_points,
        "total_enrollments": total_enrollments,
        "estimated_carbon_saved_tons": round(estimated_carbon_saved, 2),
        "green_jobs_available": len(GREEN_JOBS),
        "ndc_alignment": {
            "renewable_energy_jobs": len([j for j in GREEN_JOBS if j['sector'] == 'Renewable Energy']),
            "climate_tech_jobs": len([j for j in GREEN_JOBS if j['sector'] == 'Climate Tech']),
            "contribution": "Supporting India's 500 GW renewable target and net-zero by 2070"
        }
    })

if __name__ == '__main__':
    init_db()
    print("✅ Database initialized")
    print("🚀 Starting Green Career Intelligence API...")
    print("📊 Jobs available:", len(GREEN_JOBS))
    print("📚 Courses available:", len(COURSES))
    app.run(debug=True, port=5000)
