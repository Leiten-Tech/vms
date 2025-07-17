pipeline {
    agent any

    environment {
        REACT_DIR = 'ReactJS'
        BUILD_DIR = 'dist'
        DEPLOY_DIR = 'C:\\IIS\\VMS_Development\\Web'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/Leiten-Tech/vms.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir("${REACT_DIR}") {
                    bat 'npm install --force'
                }
            }
        }

        stage('Build') {
            steps {
                dir("${REACT_DIR}") {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                bat """
                    robocopy "${WORKSPACE}\\${REACT_DIR}\\${BUILD_DIR}" "${DEPLOY_DIR}" /E /MIR
                    exit 0
                """
            }
        }

        stage('Restart IIS') {
            steps {
                bat 'iisreset'
            }
        }
    }

    post {
        always {
            echo 'Build pipeline completed.'
        }
        failure {
            echo 'Build pipeline failed.'
        }
    }
}
