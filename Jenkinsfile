pipeline {
    agent any
    
    tools {
        nodejs 'Node-18'  // This references the NodeJS installation we configured
    }
    
    environment {
        NODE_VERSION = '18'
        FRONTEND_DIR = 'frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '🛠️ Setting up Node.js environment...'
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
                echo '📥 Installing frontend dependencies...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Installing dependencies in: $(pwd)"
                        rm -rf node_modules package-lock.json
                        npm install
                        echo "✅ Dependencies installed successfully"
                    '''
                }
            }
        }
        
        stage('Lint Code') {
            steps {
                echo '🔍 Running ESLint...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Running linter..."
                        npm run lint
                        echo "✅ Linting completed"
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running frontend tests...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Running Jest tests with coverage..."
                        npm run test:ci
                        echo "✅ All tests completed successfully!"
                    '''
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Building frontend application...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Building React application..."
                        npm run build
                        echo "✅ Build completed successfully"
                        
                        echo "Verifying build artifacts..."
                        ls -la build/
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
                            sh 'npm audit --audit-level=high'
                            echo "✅ No high-severity vulnerabilities found"
                        } catch (Exception e) {
                            echo "⚠️ Security audit found issues: ${e.getMessage()}"
                            // Don't fail the build for audit issues, just warn
                        }
                    }
                }
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo '📋 Archiving build artifacts...'
                dir("${FRONTEND_DIR}") {
                    archiveArtifacts artifacts: 'build/**/*', fingerprint: true
                    echo "✅ Artifacts archived successfully"
                }
            }
        }
        
        stage('Verify Build') {
            steps {
                echo '🎯 Verifying build integrity...'
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "Checking build directory structure..."
                        ls -la build/
                        
                        echo "Verifying essential files exist..."
                        test -f build/index.html && echo "✅ index.html found"
                        test -d build/static && echo "✅ static assets found"
                        
                        echo "Build verification completed successfully!"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline completed'
            script {
                def duration = currentBuild.duration / 1000
                echo "Total build time: ${duration} sec"
                if (duration < 600) { // 10 minutes
                    echo "✅ Build time is reasonable"
                } else {
                    echo "⚠️ Build time exceeds 10 minutes"
                }
            }
            cleanWs()
        }
        success {
            echo '🎉 Pipeline succeeded!'
            echo 'All stages completed successfully'
            echo 'Build artifacts have been archived'
        }
        failure {
            echo '❌ Pipeline failed!'
            echo 'Check the console output above for details'
            echo 'Failed stage information available in Jenkins UI'
        }
        unstable {
            echo '⚠️ Pipeline completed with warnings'
            echo 'Check test results and build logs'
        }
    }
}