pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/Leiten-Tech/vms.git'
        BRANCH = 'dev'

        // React settings
        REACT_DIR = 'ReactJS'
        REACT_BUILD_DIR = 'dist'
        REACT_DEPLOY_DIR = 'C:\\IIS\\VMS_Development\\Web'

        // .NET settings
        DOTNET_DIR = 'VisitorManagementService'
        DOTNET_SOLUTION = 'VisitorManagementMySQL.sln'
        DOTNET_CONFIG = 'Release'
        DOTNET_PUBLISH_DIR = "${WORKSPACE}\\${DOTNET_DIR}\\bin\\${DOTNET_CONFIG}\\net8.0\\publish"
        DOTNET_DEPLOY_DIR = 'C:\\IIS\\VMS_Development\\Service'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: "${GIT_REPO}", branch: "${BRANCH}"
            }
        }

        stage('Build React') {
            steps {
                dir("${REACT_DIR}") {
                    bat 'npm install --force'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy React') {
            steps {
                bat """
                    robocopy "${WORKSPACE}\\${REACT_DIR}\\${REACT_BUILD_DIR}" "${REACT_DEPLOY_DIR}" /E /MIR
                    exit 0
                """
            }
        }

        stage('Build .NET') {
            steps {
                dir("${DOTNET_DIR}") {
                    bat "dotnet build ${DOTNET_SOLUTION} --configuration ${DOTNET_CONFIG}"
                }
            }
        }

        stage('Publish .NET') {
            steps {
                dir("${DOTNET_DIR}") {
                    bat "dotnet publish ${DOTNET_SOLUTION} --configuration ${DOTNET_CONFIG} --output \"${DOTNET_PUBLISH_DIR}\""
                }
            }
        }

        stage('Stop IIS') {
            steps {
                bat 'iisreset /stop'
            }
        }

        stage('Deploy .NET') {
            steps {
                script {
                    if (fileExists(DOTNET_PUBLISH_DIR)) {
                        bat "xcopy /E /I /H /Y \"${DOTNET_PUBLISH_DIR}\\*\" \"${DOTNET_DEPLOY_DIR}\\\""
                    } else {
                        error "Publish folder missing: ${DOTNET_PUBLISH_DIR}"
                    }
                }
            }
        }

        stage('Start IIS') {
            steps {
                bat 'iisreset /start'
            }
        }
    }

    post {
        always {
            echo 'Build and Deployment pipeline completed.'

            script {
                def authors = [] as Set
                def changedFiles = []

                for (changeSet in currentBuild.changeSets) {
                    for (entry in changeSet.items) {
                        authors << entry.author.fullName
                        for (file in entry.affectedFiles) {
                            def path = file.path
                            if (!path.toLowerCase().matches("(?i).*(/|\\\\)(bin|obj|.git|.vs|node_modules)(/|\\\\).*")) {
                                changedFiles << path
                            }
                        }
                    }
                }

                emailext(
                    from: 'info@leitensmartvms.com',
                    to: 'deepak.v@leitenindia.com;jayabalan.ar@leitenindia.com',
                    subject: "Build ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <p><b>Status:</b> <span style='color:${currentBuild.currentResult == 'SUCCESS' ? 'green' : 'red'};'>${currentBuild.currentResult}</span></p>
                        <p><b>Triggered By:</b> ${authors.join(', ')}</p>
                        <p><b>Changed Files:</b><br><ul><li>${changedFiles.join('</li><li>')}</li></ul></p>
                        <p><a href="${env.BUILD_URL}">View Build Console</a></p>
                    """,
                    mimeType: 'text/html'
                )
            }
        }
    }
}