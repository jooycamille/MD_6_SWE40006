pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                // Code is automatically checked out by Jenkins
                sh 'pwd && ls -la'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint & Format Check') {
            steps {
                echo 'Running code quality checks...'
                dir('frontend') {
                    sh 'npm run build' // This includes linting
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
            echo '🎉 Pipeline executed successfully!'
            echo 'Todo App built and tested successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
            echo 'Check the logs above for details.'
        }
    }
}