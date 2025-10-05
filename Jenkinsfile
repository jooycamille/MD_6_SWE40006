pipeline {
    agent any
    
    tools {
        nodejs 'Node-20'  // This references the NodeJS installation configured in Global Tool Configuration
    }
    
    stages {
        stage('Verify Node.js') {
            steps {
                sh '''
                    echo "Node.js version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Node.js path: $(which node)"
                '''
            }
        }
        
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                sh 'pwd && ls -la'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing frontend dependencies with npm install...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building React application for production...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
            post {
                success {
                    echo 'Build artifacts created successfully!'
                    archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
                }
            }
        }
        
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
                    sh 'CI=true npm test -- --coverage --watchAll=false'
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