# MD_6_SWE40006
Design and Deployment of a Continuous Integration and Delivery Pipeline

![CI/CD Pipeline](https://github.com/jooycamille/MD_6_SWE40006/workflows/CI/CD%20Pipeline/badge.svg)
![PR Checks](https://github.com/jooycamille/MD_6_SWE40006/workflows/Pull%20Request%20Checks/badge.svg)

## Overview
This project demonstrates the implementation of a comprehensive CI/CD pipeline using GitHub Actions for a full-stack web application. The application consists of a React frontend and a Flask backend, showcasing modern DevOps practices and automated deployment strategies.

## Tech Stack

- **Frontend**: React 18.2.0 with Create React App
- **Backend**: Python with Flask framework
- **Database**: PostgreSQL (configured)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker (configured)
- **Testing**: Jest (Frontend), Pytest (Backend)
- **Code Quality**: ESLint, Flake8

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
├── /.github
│   └── /workflows          # GitHub Actions CI/CD pipelines
│       ├── ci-cd.yml       # Main CI/CD pipeline
│       ├── pr-checks.yml   # Pull request validation
│       └── dependency-updates.yml # Automated dependency updates
└── README.md
```

## 🚀 Quick Start

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

## CI/CD Pipeline

This project includes comprehensive GitHub Actions workflows:

- **CI/CD Pipeline** (`ci-cd.yml`): Full testing, building, and deployment
- **PR Checks** (`pr-checks.yml`): Fast validation for pull requests
- **Dependency Updates** (`dependency-updates.yml`): Automated weekly dependency updates

### Pipeline Features:
- Multi-version Python testing (3.9, 3.10, 3.11)
- Frontend build and test automation
- Security vulnerability scanning with Trivy
- Code coverage reporting
- Automated dependency management
- Docker build preparation

## Deployment

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

### Development Workflow
- All pull requests trigger automated testing
- Code must pass all CI checks before merging
- Follow conventional commit messages
- Maintain test coverage above 80%

## 📝 Environment Variables

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

## 📊 Project Status

- [x] Project structure setup
- [x] Frontend React application
- [x] Backend Flask API structure
- [x] GitHub Actions CI/CD pipeline
- [x] Docker configuration
- [x] Testing framework setup
- [ ] API endpoint implementation
- [ ] Database integration
- [ ] Production deployment

## 📄 License

This project is part of SWE40006 coursework and follows university guidelines.

## 👨‍💻 Author

**jooycamille** - [GitHub Profile](https://github.com/jooycamille)
