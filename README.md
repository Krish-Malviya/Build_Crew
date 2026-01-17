# 🌱 Green Career Intelligence Platform

A comprehensive digital platform designed to bridge India's green skills gap and support the Paris Agreement commitments. This application maps academic and professional skills to climate careers, integrates with the government's Mission LiFE program, and provides actionable pathways for students to transition into the green economy.

![Green Career Platform Demo](https://placehold.co/800x400?text=Green+Career+Intelligence+Platform+Demo)

## 🚀 Features

*   **Skill-Based Job Matching**: AI-powered algorithm connecting students to 8+ green job roles across Renewable Energy, Climate Tech, Agriculture, and Smart Cities.
*   **Mission LiFE Integration**: Unique "LiFE Points" system that rewards real-world climate actions with career profile boosts.
*   **Smart Learning Paths**: Automated course recommendations (NPTEL, SWAYAM) to bridge identified skill gaps.
*   **Gap Analysis**: Visualizes missing vs. acquired skills to guide career development.
*   **Paris Agreement Alignment**: Every job and skill is explicitly linked to India's NDC targets (e.g., 500GW Renewable Energy by 2030).
*   **Interactive Dashboard**: Real-time progress tracking of sector readiness and carbon impact.

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React (Icons)
*   **Backend**: Flask (Python), Flask-CORS
*   **Database**: SQLite (built-in, zero-config)
*   **Tools**: npm, pip

## ⚙️ Setup & Installation

Follow these steps to run the application locally.

### Prerequisites

*   Node.js (v18+) & npm
*   Python (v3.8+) & pip
*   Git

### 1. Clone the Repository

```bash
git clone https://github.com/Krish-Malviya/Build_Crew.git
cd newProject
```

### 2. Backend Setup (Flask)

Open a terminal and navigate to the backend directory:

```bash
cd backend
# Create virtual environment (Optional but Recommended)
# python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

*The backend server will start at `http://localhost:5000`*

### 3. Frontend Setup (React)

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

*The frontend application will start at `http://localhost:5173`*

## 🔑 Environment Variables

Currently, the application is pre-configured for local development.

**Backend (.env example - optional):**
```properties
FLASK_ENV=development
FLASK_APP=app.py
```

**Frontend:**
*   Proxy is configured in `vite.config.js` to forward requests to `http://localhost:5000`. No manual configuration needed.

## 📂 Project Structure

```
/
├── backend/
│   ├── app.py              # Main Flask application & API routes
│   ├── green_careers.db    # SQLite Database (auto-generated)
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── GreenCareerPlatform.jsx  # Main UI Component
│   │   ├── App.jsx         # App Entry
│   │   └── main.jsx        # Bootstrapper
│   ├── vite.config.js      # Vite Configuration (Proxy setup)
│   └── tailwind.config.js  # Tailwind Configuration
│
└── README.md               # Project Documentation
```

## 🔒 Security & Contribution

*   **No Secrets**: This repository does not contain any API keys or secrets.
*   **Contributing**: We welcome contributions! Please fork the repo and submit a Pull Request.

## 👥 Contributors

*   **IEEE AUSB** ([@IEEE-Ahmedabad-University-SB-Official](https://github.com/IEEE-Ahmedabad-University-SB-Official))
*   **Krish Malviya** (Maintainer)

---

**Built for the "Holistic Academic and Professional Skill Intelligence System" Hackathon Challenge.**
