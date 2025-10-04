# MD_6_SWE40006
Design and Deployment of a Continuous Integration and Delivery Pipeline

## 🎯 Assignment Overview
This project implements a progressive DevOps pipeline through 4 levels, demonstrating continuous integration and delivery practices with a full-stack web application.

## Assignment Levels

### **Level 1: Basic DevOps Pipeline** (Current Focus)
**Goal**: Create a simple DevOps pipeline including:
- Code repository server (GitHub)
- CI/build server (GitHub Actions - to be implemented)
- Test server (Local testing environment)
- Production server (Deployment target - to be configured)

**Status**: In Progress

### **Level 2: Add Monitoring** (Future)
**Goal**: Complete Level 1 + Add instrumentation to production server
- Performance monitoring
- Server stats collection
- Health checks

**Status**: Pending Level 1

### **Level 3: Deploy Application** (Future)
**Goal**: Complete Level 2 + Deploy simple application using DevOps pipeline
- Application deployment automation
- Verify functionality and accessibility
- End-to-end testing

**Status**: Pending Level 2

### **Level 4: Test Automation** (Future)
**Goal**: Complete Level 3 + Test automation scripts
- Automatic deployment triggers
- Source code change detection
- Deferred/automatic deployment testing

**Status**: Pending Level 3

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0 with Create React App
- **Backend**: Python with Flask framework
- **Database**: PostgreSQL (configured)
- **Repository**: GitHub (Level 1)
- **CI/CD**: GitHub Actions (Level 1 - to implement)
- **Testing**: Jest (Frontend), Pytest (Backend)
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

## 📄 License

This project is part of SWE40006 coursework and follows university guidelines.

## 👨‍💻 Author

**jooycamille** - [GitHub Profile](https://github.com/jooycamille)
