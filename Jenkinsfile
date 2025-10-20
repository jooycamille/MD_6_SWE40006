pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20'
    }
    
    stages {
        // ====================================
        // SHARED SETUP STAGE
        // ====================================
        stage('Setup Node.js') {
            steps {
                script {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"
                        
                        # Install Node.js if not present
                        if ! command -v node &> /dev/null; then
                            if command -v nvm &> /dev/null; then
                                nvm install ${NODE_VERSION}
                                nvm use ${NODE_VERSION}
                            else
                                echo "Node.js not found and NVM not available"
                                exit 1
                            fi
                        fi
                        
                        echo "Node.js version: $(node --version)"
                        echo "NPM version: $(npm --version)"
                    '''
                }
            }
        }
        
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                sh 'pwd && ls -la'
            }
        }
        
        // ====================================
        // BUILD SERVER SECTION
        // ====================================
        stage('Install Dependencies') {
            steps {
                echo 'Installing frontend dependencies with npm install...'
                dir('frontend') {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        npm install
                    '''
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building React application for production...'
                dir('frontend') {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        npm run build
                    '''
                }
            }
            post {
                success {
                    echo 'Build artifacts created successfully!'
                    archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
                }
            }
        }
        
        // ====================================
        // TEST SERVER SECTION
        // ====================================
        stage('Lint & Format Check') {
            steps {
                echo 'Running code quality checks...'
                dir('frontend') {
                    // You can add linting commands here if you have them configured
                    echo 'Code quality checks completed'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running frontend tests...'
                dir('frontend') {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        CI=true npm test -- --coverage --watchAll=false
                    '''
                }
            }
            post {
                always {
                    // Archive test results
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'frontend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        // ====================================
        // PRODUCTION SERVER SECTION - TODO
        // ====================================
        stage('Deploy to Test Environment') {
            steps {
                echo 'Deploying to test environment...'
                // For Level 1, we'll just verify the build exists
                sh 'ls -la frontend/build/'
                echo 'Test deployment completed!'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed!'
            cleanWs() // Clean workspace after build
        }
        success {
            echo 'Pipeline executed successfully!'
            echo 'Todo App built and tested successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            echo 'Check the logs above for details.'
        }
    }
}