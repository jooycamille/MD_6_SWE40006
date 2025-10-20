# MD_6_SWE40006
Design and Deployment of a Continuous Integration and Delivery Pipeline

## Assignment Timeline
**Project Duration**: October 4 - October 26, 2025 (22 days)
**Delivery Deadline**: All 4 levels must be completed by October 26, 2025

## Assignment Overview
This project implements a progressive DevOps pipeline through 4 levels, demonstrating continuous integration and delivery practices with a React web application.

## Assignment Levels & Timeline

### **Level 1: Basic DevOps Pipeline**
**Goal**: Create a simple DevOps pipeline including:
- Code repository server (GitHub)
- CI/build server (Jenkins)
- Test server (Local testing environment)
- Production server (Deployment target)

### **Level 2: Add Monitoring**
**Goal**: Complete Level 1 + Add instrumentation to production server
- Performance monitoring
- Server stats collection
- Health checks
- Logging and alerting

### **Level 3: Deploy Application**
**Goal**: Complete Level 2 + Deploy simple application using DevOps pipeline
- Application deployment automation
- Verify functionality and accessibility
- End-to-end testing
- User acceptance testing

### **Level 4: Test Automation**
**Goal**: Complete Level 3 + Advanced test automation
- Automatic deployment triggers
- Source code change detection
- Deferred/automatic deployment testing
- Load testing and performance validation
- Security testing integration

## Tech Stack

- **Frontend**: React 18.2.0 with Create React App
- **Storage**: Browser Local Storage
- **Repository**: GitHub
- **CI/CD**: Jenkins
- **Testing**: Jest with React Testing Library
- **Monitoring**: Performance API & Custom Dashboard (Level 2)
- **Deployment**: Static File Server (Level 3)
- **Remote Access**: ngrok (for exposing local services)

## Project Structure
```
/MD_6_SWE40006
├── /frontend
│   ├── /public             # Static files
│   ├── /src                # React source code
│   │   ├── /components     # React components
│   │   ├── /hooks          # Custom React hooks
│   │   └── App.js          # Main application component
│   ├── package.json        # Node.js dependencies
│   └── [React application files]
├── Jenkinsfile             # CI/CD pipeline configuration
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Jenkins (for CI/CD pipeline)
- ngrok (for remote access and testing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/jooycamille/MD_6_SWE40006.git
cd MD_6_SWE40006
```

2. **Frontend Setup (React)**
```bash
cd frontend
   
# Install dependencies
npm install

# Start development server
npm start
```

## ngrok Setup & Usage

### What is ngrok?
ngrok is a tool that creates secure tunnels from public URLs to your local services. This is particularly useful for:
- Testing webhooks locally
- Sharing your development server with team members
- Remote access to Jenkins dashboard
- Testing production deployments from external sources

### Installation

#### macOS (via Homebrew)
```bash
# Install ngrok
brew install ngrok/ngrok/ngrok

# Verify installation
ngrok version
```

#### Windows
**Option 1: Download from Website (Recommended)**
1. Download ngrok from: https://ngrok.com/download
2. Extract the executable to a folder in your PATH
3. Verify installation: `ngrok version`

**Option 2: Via Chocolatey (if installed)**
```powershell
# Install ngrok via Chocolatey
choco install ngrok

# Verify installation
ngrok version
```

#### Linux (Ubuntu/Debian)
```bash
# Download and install ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Verify installation
ngrok version
```

### Authentication Setup
1. Sign up for a free ngrok account at: https://ngrok.com/
2. Get your authtoken from the dashboard
3. Configure ngrok with your authtoken:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### Usage Examples

#### Expose Jenkins Server (Port 8080)
```bash
# Start ngrok tunnel for Jenkins
ngrok http 8080

# This will provide a public URL like: https://abc123.ngrok-free.app
# Access Jenkins remotely via this URL
```

#### Expose React Development Server (Port 3000)
```bash
# Start ngrok tunnel for React app
ngrok http 3000

# Access your React app remotely via the provided URL
```

#### Expose Production Server (Custom Port)
```bash
# If your production server runs on port 8080
ngrok http 8080 --region us

# With custom subdomain (requires paid plan)
ngrok http 3000 --subdomain myapp-demo
```

### Advanced ngrok Configuration

#### Create ngrok Configuration File
Create `~/.ngrok2/ngrok.yml` (or `%USERPROFILE%\.ngrok2\ngrok.yml` on Windows):

```yaml
version: "2"
authtoken: YOUR_AUTHTOKEN_HERE
tunnels:
  jenkins:
    addr: 8080
    proto: http
    bind_tls: true
    inspect: true
  react-app:
    addr: 3000
    proto: http
    bind_tls: true
    inspect: true
  production:
    addr: 8081
    proto: http
    bind_tls: true
    inspect: false
```

#### Start Multiple Tunnels
```bash
# Start specific tunnel
ngrok start jenkins

# Start multiple tunnels
ngrok start jenkins react-app

# Start all configured tunnels
ngrok start --all
```

### Security Considerations

#### Basic Authentication
```bash
# Add basic auth to your tunnel
ngrok http 3000 --auth "username:password"
```

#### IP Restrictions (Pro feature)
```bash
# Restrict access to specific IPs
ngrok http 3000 --cidr-allow 192.168.1.0/24
```

### Integration with DevOps Pipeline

#### Jenkins Webhook Configuration
1. Start ngrok tunnel for Jenkins: `ngrok http 8080`
2. Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)
3. In GitHub repository settings, add webhook:
   - Payload URL: `https://abc123.ngrok-free.app/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`

#### Testing Production Deployment
```bash
# After deploying your app on port 8080
ngrok http 8080 --log stdout

# Share the public URL for testing
# Monitor access logs in real-time
```

### Monitoring ngrok Tunnels

#### Web Interface
Access the ngrok web interface at: `http://localhost:4040`
- View active tunnels
- Inspect HTTP requests/responses
- Monitor traffic and performance

#### Command Line Monitoring
```bash
# List active tunnels
curl http://localhost:4040/api/tunnels

# Get tunnel status in JSON format
curl http://localhost:4040/api/tunnels | jq
```

### Troubleshooting

#### Common Issues
- **Tunnel not accessible**: Check firewall settings and ensure the local service is running
- **Rate limiting**: Free accounts have connection limits; consider upgrading for production use
- **Tunnel disconnects**: Free tunnels have session limits; use `--region` flag to connect to closer servers

#### Best Practices
- Use HTTPS URLs for production testing
- Implement authentication for sensitive services
- Monitor tunnel usage through the web interface
- Keep ngrok updated to the latest version
- Use configuration files for consistent setups

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
- **Remote Access**: Use ngrok to expose Jenkins publicly

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

## Development

### Local Development
```bash
# Frontend (runs on http://localhost:3000)
cd frontend && npm start
```

### Production Build
```bash
# Create optimized production build
cd frontend && npm run build
```

### Production Deployment
The project is configured for static file deployment. Build artifacts can be served using any static file server or deployed to various hosting platforms (Netlify, Vercel, GitHub Pages, AWS S3, etc.).

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

### Frontend
Environment variables can be added to `.env` files in the frontend directory following Create React App conventions (prefixed with `REACT_APP_`). 

**Example .env:**
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_VERSION=1.0.0
```

**Important**: Never commit actual environment files to the repository. Always use `.env.example` templates and add `.env` to your `.gitignore`.

## Application Features

### Todo Application
The React application implements a fully functional todo list with:
- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Edit existing todos
- Filter todos by status (All, Active, Completed)
- Persistent storage using localStorage
- Responsive design

### Performance Monitoring (Level 2)
- Real-time performance metrics
- Page load time tracking
- Memory usage monitoring
- Component render time measurement
- Performance dashboard with export capabilities

## License

This project is part of SWE40006 Group 6 Semester 2, 2025 Friday 4:30-6:30 PM coursework and follows university guidelines.

## Author

- **Joy Mena: jooycamille** - [GitHub Profile](https://github.com/jooycamille)
- **Viet Nguyen: David2k5** - [GitHub Profile](https://github.com/David2k5)
- **Gia Nguyen Nguyen: nnguyengia04** - [GitHub Profile](https://github.com/nnguyengia04)
- **Audrey Christie: audreychristie3** - [GitHub Profile](https://github.com/audreychristie3)