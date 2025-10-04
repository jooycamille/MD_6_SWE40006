# MD_6_SWE40006
Design and Deployment of a Continuous Integration and Delivery Pipeline

## Assignment Timeline
**Project Duration**: October 4 - October 26, 2025 (22 days)
**Delivery Deadline**: All 4 levels must be completed by October 26, 2025

## Assignment Overview
This project implements a progressive DevOps pipeline through 4 levels, demonstrating continuous integration and delivery practices with a full-stack web application.

## Assignment Levels & Timeline

### **Level 1: Basic DevOps Pipeline** (October 4-10, 2025)
**Duration**: 7 days
**Goal**: Create a simple DevOps pipeline including:
- Code repository server (GitHub) - COMPLETED
- CI/build server (Jenkins) - IN PROGRESS
- Test server (Local testing environment) - IN PROGRESS
- Production server (Deployment target) - PLANNED

**Target Completion**: October 10, 2025

### **Level 2: Add Monitoring** (October 11-15, 2025)
**Duration**: 5 days
**Goal**: Complete Level 1 + Add instrumentation to production server
- Performance monitoring
- Server stats collection
- Health checks
- Logging and alerting

**Target Completion**: October 15, 2025

### **Level 3: Deploy Application** (October 16-21, 2025)
**Duration**: 6 days
**Goal**: Complete Level 2 + Deploy simple application using DevOps pipeline
- Application deployment automation
- Verify functionality and accessibility
- End-to-end testing
- User acceptance testing

**Target Completion**: October 21, 2025

### **Level 4: Test Automation** (October 22-26, 2025)
**Duration**: 5 days (Final sprint)
**Goal**: Complete Level 3 + Advanced test automation
- Automatic deployment triggers
- Source code change detection
- Deferred/automatic deployment testing
- Load testing and performance validation
- Security testing integration

**Final Deadline**: October 26, 2025

## Progress Tracking
- **Week 1 (Oct 4-10)**: Level 1 Implementation
- **Week 2 (Oct 11-17)**: Levels 2 & 3 Development  
- **Week 3 (Oct 18-24)**: Level 4 & Final Testing
- **Final Days (Oct 25-26)**: Documentation & Submission

## Tech Stack

- **Frontend**: React 18.2.0 with Create React App
- **Backend**: Python with Flask framework (Level 2+)
- **Storage**: Browser Local Storage (Level 1), SQLite/PostgreSQL (Level 2+)
- **Repository**: GitHub
- **CI/CD**: Jenkins (updated from GitHub Actions)
- **Testing**: Jest (Frontend), Pytest (Backend - Level 2+)
- **Monitoring**: TBD (Level 2)
- **Deployment**: TBD (Level 3)

## Project Structure
```
/MD_6_SWE40006
├── /backend
│   ├── .env.example          # Environment variables template
│   ├── .venv/               # Python virtual environment
│   ├── docker-compose.yml   # Docker configuration
│   ├── requirements.txt     # Python dependencies
│   └── [Flask application files]
├── /frontend
│   ├── /public             # Static files
│   ├── /src                # React source code
│   ├── package.json        # Node.js dependencies
│   └── [React application files]
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jooycamille/MD_6_SWE40006.git
cd MD_6_SWE40006
```

2. **Backend Setup (Python/Flask)**
```bash
cd backend
   
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   
# Install dependencies
pip install -r requirements.txt
   
# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup (React)**
```bash
cd frontend
   
# Install dependencies
npm install

# Start development server
npm start
```

## Common Issues & Troubleshooting

### React Startup Error: "Cannot find module 'ajv/dist/compile/codegen'"

**Problem**: When running `npm start`, you may encounter this error:
```
Cannot find module 'ajv/dist/compile/codegen'
Require stack:
- .../node_modules/ajv-keywords/dist/definitions/typeof.js
- .../node_modules/schema-utils/dist/validate.js
- .../node_modules/webpack-dev-server/lib/Server.js
- .../node_modules/react-scripts/scripts/start.js
```

**Root Cause**: This error occurs due to version incompatibility between React and react-scripts, particularly when using newer React versions (19.x) with older react-scripts versions.

**Solution**:
1. Clean node_modules and package-lock.json:
```bash
cd frontend
rm -rf node_modules package-lock.json
```

2. Downgrade React to a compatible version (React 18.2.0 works well with react-scripts 5.0.1)

3. Install the correct ajv version:
```bash
npm install ajv@^8.12.0
```

4. Reinstall dependencies:
```bash
npm install
npm start
```

**Prevention**: Always check compatibility between React versions and react-scripts when upgrading.

## Jenkins Setup & Management

### Prerequisites
Jenkins LTS is required for this project's CI/CD pipeline (Level 1).

### Installation

#### macOS (via Homebrew)
```bash
# Install Jenkins LTS
brew install jenkins-lts

# Start Jenkins service
brew services start jenkins-lts
```

#### Windows
**Option 1: Download Installer (Recommended)**
1. Download Jenkins LTS from: https://www.jenkins.io/download/
2. Run the `.msi` installer
3. Follow the installation wizard
4. Jenkins will start automatically as a Windows service

**Option 2: Via Chocolatey (if installed)**
```powershell
# Install Jenkins via Chocolatey
choco install jenkins

# Start Jenkins service
net start jenkins
```

### Jenkins Service Management

#### macOS
```bash
# Check if Jenkins is installed
brew list | grep jenkins

# Check Jenkins service status
brew services list | grep jenkins

# Start Jenkins (if stopped)
brew services start jenkins-lts

# Stop Jenkins
brew services stop jenkins-lts

# Restart Jenkins
brew services restart jenkins-lts

# Check Jenkins version
brew list --versions jenkins-lts
```

#### Windows
```powershell
# Check Jenkins service status
sc query jenkins

# Start Jenkins service
net start jenkins

# Stop Jenkins service
net stop jenkins

# Restart Jenkins service
net stop jenkins && net start jenkins

# Check if Jenkins is running (alternative)
Get-Service jenkins
```

### Accessing Jenkins
- **Jenkins Web Interface**: `http://localhost:8080` (all platforms)
- **Default Port**: 8080 (can be changed in configuration)

### Platform-Specific Configuration Locations

#### macOS
- **Service Configuration**: `~/Library/LaunchAgents/homebrew.mxcl.jenkins-lts.plist`
- **Jenkins Home**: `~/.jenkins/`
- **Initial Admin Password**: `~/.jenkins/secrets/initialAdminPassword`

#### Windows
- **Service Configuration**: Windows Services (`services.msc`)
- **Jenkins Home**: `C:\Users\{username}\.jenkins\` or `C:\Program Files\Jenkins\`
- **Initial Admin Password**: `C:\Users\{username}\.jenkins\secrets\initialAdminPassword`

### Initial Setup (All Platforms)
1. Navigate to `http://localhost:8080` in your browser
2. Retrieve the initial admin password:

**macOS:**
```bash
cat ~/.jenkins/secrets/initialAdminPassword
```

**Windows (PowerShell):**
```powershell
Get-Content "$env:USERPROFILE\.jenkins\secrets\initialAdminPassword"
# or if installed system-wide:
Get-Content "C:\Program Files\Jenkins\secrets\initialAdminPassword"
```

3. Complete the setup wizard in the web interface
4. Install recommended plugins for CI/CD pipeline
5. Create your first admin user

### Troubleshooting

#### Common Issues
- **Port 8080 already in use**: Change Jenkins port in configuration or stop conflicting service
- **Permission denied**: Run commands with appropriate privileges (Administrator on Windows)
- **Service won't start**: Check system logs and ensure Java is installed (Java 11 or 17 required)

## Running Tests

### Frontend Tests
```bash
cd frontend
npm test                    # Interactive mode
npm test -- --coverage     # With coverage report
npm test -- --ci --watchAll=false  # CI mode
```

### Backend Tests
```bash
cd backend
source .venv/bin/activate
pytest                      # Run all tests
pytest --cov=.             # With coverage
pytest --cov=. --cov-report=html  # HTML coverage report
```

## Development

### Local Development
```bash
# Frontend (runs on http://localhost:3000)
cd frontend && npm start

# Backend (configure your Flask app to run on desired port)
cd backend && source .venv/bin/activate && python app.py
```

### Production Deployment
The project is configured for containerized deployment using Docker. Deployment configurations are included in the CI/CD pipeline and can be customized for various cloud platforms (AWS, Azure, Heroku, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Best Practices
- Write meaningful commit messages
- Test your changes locally before pushing
- Follow conventional commit messages
- Maintain test coverage above 80%

## Environment Variables

### Backend (.env)
Create a `.env` file in the backend directory using `.env.example` as a template:
```env
# Copy from .env.example and fill in your values
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://username:password@localhost/database_name
SECRET_KEY=your_secret_key_here
# Add other environment-specific variables as needed
```

### Frontend
Environment variables can be added to `.env` files in the frontend directory following Create React App conventions (prefixed with `REACT_APP_`). 

**Important**: Never commit actual environment files to the repository. Always use `.env.example` templates and add `.env` to your `.gitignore`.

## License

This project is part of SWE40006 Group 6 Semester 2, 2025 Friday 4:30-6:30 PM coursework and follows university guidelines.

## Author

- **Joy Mena: jooycamille** - [GitHub Profile](https://github.com/jooycamille)
- **Viet Nguyen: David2k5** - [GitHub Profile](https://github.com/David2k5)
- **Gia Nguyen Nguyen: nnguyengia04** - [GitHub Profile](https://github.com/nnguyengia04)
- **Audrey Christie: audreychristie3** - [GitHub Profile](https://github.com/audreychristie3)