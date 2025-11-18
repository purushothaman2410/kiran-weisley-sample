pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        IMAGE_NAME = "purushothraj/kiran-weisley-sample"
        CONTAINER_NAME = "myapp-container"
        APP_PORT = "4173"
        SERVER_IP = "35.153.104.25"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/purushothaman2410/kiran-weisley-sample.git'
            }
        }

        stage('Build Docker Image') {
            steps { sh "docker build -t ${IMAGE_NAME}:latest ." }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {

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
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    docker system prune -af || true
                    docker pull ${IMAGE_NAME}:latest
                    docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${APP_PORT} ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment Successful!"

            withCredentials([string(credentialsId: 'teams-webhook', variable: 'TEAMS_URL')]) {
                script {
                    def card = """
                    {
                      "@type": "MessageCard",
                      "@context": "http://schema.org/extensions",
                      "themeColor": "00FF00",
                      "summary": "Deployment Status",
                      "sections": [{
                        "activityTitle": "🚀 Deployment Successful!",
                        "facts": [
                          { "name": "Project:", "value": "kiran-weisley-sample" },
                          { "name": "Build:", "value": "#${BUILD_NUMBER}" },
                          { "name": "Status:", "value": "SUCCESS ✅" },
                          { "name": "Deployed To:", "value": "${SERVER_IP}" },
                          { "name": "Branch:", "value": "${env.GIT_BRANCH}" },
                          { "name": "Duration:", "value": "${currentBuild.durationString}" }
                        ]
                      }],
                      "potentialAction": [{
                        "@type": "OpenUri",
                        "name": "🔗 View Build",
                        "targets": [{ "os": "default", "uri": "${env.BUILD_URL}" }]
                      }]
                    }
                    """

                    sh """
                      curl -H 'Content-Type: application/json' \
                      -d '${card.replace("'", "\\'")}' \
                      $TEAMS_URL
                    """
                }
            }
        }

        failure {
            withCredentials([string(credentialsId: 'teams-webhook', variable: 'TEAMS_URL')]) {
                script {
                    def card = """
                    {
                      "@type": "MessageCard",
                      "@context": "http://schema.org/extensions",
                      "themeColor": "FF0000",
                      "summary": "Deployment Failed",
                      "sections": [{
                        "activityTitle": "❌ Deployment Failed",
                        "facts": [
                          { "name": "Project:", "value": "kiran-weisley-sample" },
                          { "name": "Build:", "value": "#${BUILD_NUMBER}" },
                          { "name": "Status:", "value": "FAILED" },
                          { "name": "Branch:", "value": "${env.GIT_BRANCH}" }
                        ]
                      }],
                      "potentialAction": [{
                        "@type": "OpenUri",
                        "name": "🔗 View Build",
                        "targets": [{ "os": "default", "uri": "${env.BUILD_URL}" }]
                      }]
                    }
                    """

                    sh """
                      curl -H 'Content-Type: application/json' \
                      -d '${card.replace("'", "\\'")}' \
                      $TEAMS_URL
                    """
                }
            }
        }
    }
}
