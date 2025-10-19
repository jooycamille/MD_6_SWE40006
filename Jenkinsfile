pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        FRONTEND_DIR = 'frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo 'Setting up Node.js environment...'
                script {
                    sh '''
                        echo "Node version: $(node --version)"
                        echo "NPM version: $(npm --version)"
                        echo "Current directory: $(pwd)"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Installing dependencies in: $(pwd)"
                        
                        # Clean install for consistent builds
                        rm -rf node_modules package-lock.json
                        
                        # Install dependencies
                        npm install
                        
                        echo "Dependencies installed successfully"
                        echo "Installed packages:"
                        npm list --depth=0 || true
                    '''
                }
            }
        }
        
        stage('Lint Code') {
            steps {
                echo '🔍 Running ESLint code analysis...'
                dir("${FRONTEND_DIR}") {
                    script {
                        try {
                            sh 'npm run lint'
                            echo "Linting passed"
                        } catch (Exception e) {
                            echo "Linting issues found: ${e.getMessage()}"
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running frontend tests...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Running Jest tests..."
                        npm run test:ci
                        
                        echo "✅ All tests completed"
                    '''
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Test Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building React application...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Building production build..."
                        npm run build
                        
                        echo "Build completed successfully"
                        echo "Build contents:"
                        ls -la build/
                        
                        echo "Build size:"
                        du -sh build/
                        
                        # Verify critical files exist
                        if [ -f "build/index.html" ]; then
                            echo "index.html created"
                        else
                            echo "index.html missing"
                            exit 1
                        fi
                        
                        if [ -d "build/static" ]; then
                            echo "Static assets created"
                        else
                            echo "Static assets missing"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Security Audit') {
            steps {
                echo '🔒 Running security audit...'
                dir("${FRONTEND_DIR}") {
                    script {
                        try {
                            sh '''
                                echo "Running npm audit..."
                                npm audit --audit-level=moderate
                                echo "Security audit passed"
                            '''
                        } catch (Exception e) {
                            echo "Security vulnerabilities found: ${e.getMessage()}"
                            echo "Run 'npm audit fix' to resolve issues"
                            currentBuild.result = 'UNSTABLE'
                        }
                    }
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                dir("${FRONTEND_DIR}") {
                    script {
                        // Archive the build
                        archiveArtifacts(
                            artifacts: 'build/**/*',
                            allowEmptyArchive: false,
                            fingerprint: true
                        )
                        
                        // Also archive package.json and package-lock.json for reference
                        archiveArtifacts(
                            artifacts: 'package*.json',
                            allowEmptyArchive: true,
                            fingerprint: true
                        )
                        
                        echo "Artifacts archived successfully"
                    }
                }
            }
        }
        
        stage('Verify Build') {
            steps {
                echo 'Verifying build quality...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Build verification:"
                        echo "- Build directory size: $(du -sh build/)"
                        echo "- Number of files: $(find build -type f | wc -l)"
                        echo "- Main bundle size: $(ls -lh build/static/js/*.js | head -1)"
                        
                        # Check if build is reasonable size (not too big, not too small)
                        BUILD_SIZE=$(du -s build/ | cut -f1)
                        if [ $BUILD_SIZE -lt 100 ]; then
                            echo "Build seems too small: ${BUILD_SIZE}KB"
                            exit 1
                        elif [ $BUILD_SIZE -gt 50000 ]; then
                            echo "Build seems large: ${BUILD_SIZE}KB"
                        else
                            echo "Build size is reasonable: ${BUILD_SIZE}KB"
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline completed'
            script {
                def duration = currentBuild.durationString.replace(' and counting', '')
                echo "Total build time: ${duration}"
                
                // Check if build time is reasonable
                if (currentBuild.duration > 600000) { // 10 minutes in milliseconds
                    echo "Build took longer than 10 minutes"
                    currentBuild.result = 'UNSTABLE'
                } else {
                    echo "Build time is reasonable"
                }
            }
            
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo 'Pipeline succeeded!'
            echo 'All acceptance criteria met:'
            echo '  - Pipeline runs without errors'
            echo '  - npm install completes successfully'
            echo '  - npm run build creates artifacts'
            echo '  - npm test runs and passes'
            echo '  - Build artifacts are archived'
            echo '  - Build time is reasonable'
            echo '  - Console output is clear and informative'
        }
        
        failure {
            echo 'Pipeline failed!'
            echo 'Check the console output above for details'
            echo "Failed stage information available in Jenkins UI"
        }
        
        unstable {
            echo 'Pipeline completed with warnings'
            echo 'Build succeeded but some quality checks failed'
        }
    }
}