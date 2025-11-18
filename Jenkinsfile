pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = "purushothraj/kiran-weisley-sample"
        CONTAINER_NAME = "myapp-container"
        APP_PORT = "4173"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/purushothaman2410/kiran-weisley-sample.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds', 
                        usernameVariable: 'DOCKER_USER', 
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    echo "Stopping existing container if running..."
                    docker stop ${CONTAINER_NAME} || true

                    echo "Removing old container..."
                    docker rm ${CONTAINER_NAME} || true

                    echo "Pruning old images..."
                    docker system prune -af || true

                    echo "Pulling latest image..."
                    docker pull ${IMAGE_NAME}:latest

                    echo "Starting new container..."
                    docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${APP_PORT} ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {

        success {
            echo "🚀 Deployment Successful! App running on port ${APP_PORT}"

            withCredentials([string(credentialsId: 'teams-webhook', variable: 'TEAMS_URL')]) {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -d "{ \\"text\\": \\"✅ *Jenkins Deployment Successful!* 🚀\\\\nApplication deployed on port 4173.\\" }" \
                    $TEAMS_URL
                '''
            }
        }

        failure {
            echo "❌ Deployment Failed. Please check pipeline logs."

            withCredentials([string(credentialsId: 'teams-webhook', variable: 'TEAMS_URL')]) {
                sh '''
                    curl -H "Content-Type: application/json" \
                    -d "{ \\"text\\": \\"❌ *Jenkins Deployment Failed!* Please check logs.\\" }" \
                    $TEAMS_URL
                '''
            }
        }
    }
}
