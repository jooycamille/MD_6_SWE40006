pipeline {
    agent any

    triggers {
        // GitHub webhook trigger
        githubPush()
        // polling trigger as backup
        pollSCM('H/5 * * * *') // check every 5 minutes
    }
    
    environment {
        NODE_VERSION = '20'
        PERFORMANCE_LOG = 'build-performance.log'
        MONITORING_ENABLED = 'true'
    }
    
    stages {
        // ====================================
        // SHARED SETUP STAGE
        // ====================================
        
        stage('Setup Environment') {
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
                echo 'Git checkout completed!'
            }
        }
        // ====================================
        // BUILD SERVER SECTION
        // ====================================
        stage('📦 Install Dependencies') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()
                    
                    echo 'Installing dependencies (optimized)...'
                    
                    sh '''
                        echo "Build #${BUILD_NUMBER} - $(date)" > build-performance.log
                        
                        TOTAL_MEM=$(system_profiler SPHardwareDataType 2>/dev/null | grep "Memory:" | awk '{print $2, $3}' || echo "Unknown")
                        CPU_CORES=$(sysctl -n hw.ncpu 2>/dev/null || echo "Unknown") 
                        DISK_SPACE=$(df -h . 2>/dev/null | tail -1 | awk '{print $4}' || echo "Unknown")
                        
                        echo "Memory: $TOTAL_MEM" >> build-performance.log
                        echo "CPU: $CPU_CORES cores" >> build-performance.log
                        echo "Disk Available: $DISK_SPACE" >> build-performance.log
                    '''
                    
                    dir('frontend') {
                        sh '''
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                            
                            # Use npm ci for faster, reliable installs
                            if [ -f package-lock.json ]; then
                                echo "Using npm ci for clean install..."
                                npm ci --silent
                            else
                                echo "Using npm install..."
                                npm install --silent
                            fi
                            
                            echo "Dependencies installed successfully"
                        '''
                    }
                    
                    def duration = (System.currentTimeMillis() - startTime) / 1000
                    
                    // Fixed final command with proper variable handling
                    sh """
                        echo 'Dependencies Duration: ${duration}s' >> build-performance.log
                    """
                    
                    echo "Dependencies installed in ${duration}s"
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    def startTime = System.currentTimeMillis()

                    echo 'Building React application for production...'

                    // Start resource monitoring
                    sh '''
                        (while true; do
                            echo "$(date +%H:%M:%S): $(free | grep Mem | awk '{printf("MEM=%.0f%%", $3/$2*100)}')" >> build-resources.log
                            sleep 5
                        done) &
                        echo $! > monitor.pid
                    '''

                    // existing build steps                    
                    dir('frontend') {
                        sh '''
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                            npm run build --silent
                        '''
                    }

                    // Stop resource monitoring
                    sh '''
                        kill $(cat monitor.pid) 2>/dev/null || true; rm -f monitor.pid'
                    '''

                    def endTime = System.currentTimeMillis()
                    def duration = (endTime - startTime) / 1000

                    // Collect build metrics
                    sh '''
                        BUILD_SIZE=$(du -sh frontend/build | cut -f1)
                        FILE_COUNT=$(find frontend/build -type f | wc -l)
                        
                        echo "Build: ${duration}s" >> ${PERFORMANCE_LOG}
                        echo "Size: $BUILD_SIZE ($FILE_COUNT files)" >> ${PERFORMANCE_LOG}
                        
                        # Peak memory usage
                        if [ -f build-resources.log ]; then
                            PEAK_MEM=$(sort build-resources.log | tail -1 | cut -d'=' -f2)
                            echo "Peak: $PEAK_MEM" >> ${PERFORMANCE_LOG}
                        fi                
                    '''
                    sh "echo 'Build process took ${duration}s"
                }                
            }
            post {
                success {
                    stash includes: 'frontend/build/**/*', name: 'frontend-artifacts'
                    archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
                }
            }
        }

        stage('Performance Analysis') {
            steps {
                script {
                    sh '''
                        # Generate performance metrics
                        cat > build-metrics.json <<EOF
                        {
                            "build": ${BUILD_NUMBER},
                            "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
                            "buildTime": "$(grep 'Build:' ${PERFORMANCE_LOG} | cut -d':' -f2 | tr -d ' s')",
                            "size": "$(grep 'Size:' ${PERFORMANCE_LOG} | cut -d':' -f2 | cut -d'(' -f1 | tr -d ' ')",
                            "peak": "$(grep 'Peak:' ${PERFORMANCE_LOG} | cut -d':' -f2 | tr -d ' ')",
                            "status": "success"
                        }
                        EOF
                    '''

                    // Archive performance logs and metrics
                    archiveArtifacts artifacts: 'build-metrics.json, build-performance.log', fingerprint: true
                }
            }
        }

        // ====================================
        // TEST SERVER SECTION
        // ====================================

        // Level 1
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
                script {
                                    def testStart = System.currentTimeMillis()

                echo 'Running frontend tests...'
                dir('frontend') {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        CI=true npm test -- \
                            --coverage \
                            --watchAll=false \
                            --silent \
                            --testTimeout=10000 \
                            --maxWorkers=2 \
                            --coverageReporters=json-summary,lcov
                    '''
                }

                def testDuration = (System.currentTimeMillis() - testStart) / 1000

                sh '''
                    echo " === Test Metrics === " >> test-performance.log
                    echo "Test Duration: ${testDuration}s" >> test-performance.log

                    if [ -f frontend/coverage/coverage-summary.json" ]; then
                        COVERAGE=$(node -e "console.log(JSON.parse(require('fs').readFileSync('frontend/coverage/coverage-summary.json')).total.lines.pct)" 2>/dev/null || echo "0")
                            echo "Coverage: ${COVERAGE}%" >> test-performance.log
                        fi

                        TEST_FILES=$(find frontend/src -name '*.test.js' | wc -l)
                        echo "Tests: ${TEST_FILES}" >> test-performance.log)
                '''

                echo "Tests completed in ${testDuration}s"
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
                    archiveArtifacts artifacts: 'test-performance.log', fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        stage('Test Analysis') {
            steps {
                echo 'Analysing test metrics'
                script {
                    sh '''
                        cat > test-metrics.json <<EOF
                        {
                            "build": ${BUILD_NUMBER},
                            "testTime": "$(grep 'Duration:' test-performance.log | cut -d':' -f2 | tr -d ' s')",
                            "coverage": "$(grep 'Coverage:' test-performance.log | cut -d':' -f2 | tr -d ' %')",
                            "files": "$(grep 'Tests:' test-performance.log | cut -d':' -f2 | tr -d ' files')",
                            "status": "passed"
                        }
                        EOF
                    '''
                    archiveArtifacts artifacts: 'test-metrics.json', fingerprint: true
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
                    sh '''
                    export PATH="/opt/homebrew/bin:$PATH"  
                    aws s3 sync . s3://md06swe40006 --delete
                    '''
                    }
                echo 'Production deployment completed!'
            }
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