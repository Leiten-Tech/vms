pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/Leiten-Tech/vms.git'
        BRANCH = 'dev'
        
        // React
        REACT_DIR = 'ReactJS'
        REACT_BUILD_DIR = 'dist'
        REACT_DEPLOY_DIR = 'C:\\IIS\\VMS_Development\\Web'

        // .NET
        DOTNET_SOLUTION = 'VisitorManagementMySQL.sln'
        DOTNET_CONFIG = 'Release'
        DOTNET_DEPLOY_DIR = 'C:\\IIS\\VMS_Development\\Service'
        DOTNET_PUBLISH_DIR = "${WORKSPACE}\\bin\\${DOTNET_CONFIG}\\net8.0\\publish"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: "${GIT_REPO}", branch: "${BRANCH}"
            }
        }

        // React Build & Deploy
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

        // .NET Build & Deploy
        stage('Build .NET') {
            steps {
                bat "dotnet build ${DOTNET_SOLUTION} --configuration ${DOTNET_CONFIG}"
            }
        }

        stage('Publish .NET') {
            steps {
                bat "dotnet publish ${DOTNET_SOLUTION} --configuration ${DOTNET_CONFIG} --output \"${DOTNET_PUBLISH_DIR}\""
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
                        error "Publish output folder not found: ${DOTNET_PUBLISH_DIR}"
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
            echo 'Build pipeline completed.'

            script {
                def changeAuthors = [] as Set
                def changeFiles = []

                for (changeSet in currentBuild.changeSets) {
                    for (entry in changeSet.items) {
                        changeAuthors << entry.author.fullName
                        for (file in entry.affectedFiles) {
                            def path = file.path
                            if (!path.toLowerCase().matches("(?i).*(/|\\\\)(bin|obj|.vs|.git|.idea|node_modules)(/|\\\\).*")) {
                                changeFiles << path
                            }
                        }
                    }
                }

                def authors = changeAuthors ? changeAuthors.join(', ') : 'Unknown (manual/scheduled)'
                def files = changeFiles ? "<ul><li>${changeFiles.join('</li><li>')}</li></ul>" : "<i>No relevant files changed</i>"

                emailext(
                    from: 'info@leitensmartvms.com',
                    to: 'deepak.v@leitenindia.com',
                    replyTo: 'info@leitensmartvms.com',
                    subject: "Build ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <p><strong>Build Result:</strong> 
                        <span style="color:${currentBuild.currentResult == 'SUCCESS' ? 'green' : 'red'};">
                            ${currentBuild.currentResult}
                        </span></p>

                        <p><strong>Triggered By:</strong> ${authors}</p>
                        <p><strong>Files Changed:</strong><br>${files}</p>

                        <p><a href="${env.BUILD_URL}">Click here</a> to view full console output.</p>
                    """,
                    mimeType: 'text/html'
                )
            }
        }
    }
}
