pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'nodejs-demo-app'
        IMAGE_TAG      = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'nodejs-demo-app'
        APP_PORT       = '3000'
    }

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {

        stage('Checkout') {
            steps {
                // Pulls the code from the repo configured in the Jenkins job
                checkout scm
            }
        }

        stage('Install & Test') {
            // Runs inside a temporary Node container, so Node need not be installed on Jenkins
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                sh 'npm test --if-present'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Verify') {
            steps {
                // Give the app a few seconds to start, then check that it responds
                sh 'sleep 5'
                sh "curl -f http://nodejs-demo-app:${APP_PORT} || (docker logs ${CONTAINER_NAME} && exit 1)"
            }
        }
    }

    post {
        success {
            echo "Deployed ${IMAGE_NAME}:${IMAGE_TAG} at http://nodejs-demo-app:${APP_PORT}"
        }
        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
        always {
            // Remove dangling images to save disk space
            sh 'docker image prune -f || true'
        }
    }
}
