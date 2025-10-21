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
                    stash includes: 'frontend/build/**/*', name: 'frontend-artifacts'
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
        stage('Run E2E Tests') {
            steps {
                echo 'Running End-to-End tests against Test Environment...'
                dir('frontend') {
                    sh '''
                export NVM_DIR=/Users/jooycamille/.nvm
                [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"  
                nvm use default --silent                          
                npm run e2e-test
            ''' 
                }
                echo 'E2E tests passed!'
            }
        }
        
        stage('Deploy to Production') {
            steps {
                input message: 'Approve deployment to PRODUCTION?'
                echo 'Deploying certified build artifacts to Production...'
                unstash 'frontend-artifacts'
                withCredentials([
                    [
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'MD06SWE4006ID', 
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]
                ]) {
                    // 1. Download the archived artifacts from the 'Build Application' stage
                    // This is done with the built-in Jenkins step:
                    // NOTE: The 'frontend/build' directory will be created here with the artifacts.
                    sh 'ls -la frontend/build/' 

                    // 2. Deployment Command (Example: AWS S3)
                    dir('frontend/build') {
                        // The '--delete' flag ensures old files are removed.
                        sh '''
                        "C:/Program Files/Amazon/AWSCLI/aws.exe" s3 sync . s3://md06swe40006  --delete --acl public-read '''
                    }
                }
                echo 'Production deployment completed!'
            }
        }
        stage('Production Smoke Test') {
            steps {
                echo 'Verifying production deployment...'
                sh 'curl --fail --silent --show-error http://md06swe40006.s3-website-ap-southeast-2.amazonaws.com/index.html'
                echo 'Production site is live and responding (Smoke Test Passed)!'
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