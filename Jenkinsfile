pipeline {  
    agent any  
    tools {nodejs "nodejs"}

    stages {  
        stage('Install Dependencies') {  
            steps {  
                sh 'npm install'
                sh 'pwd'
            }
        }  
        stage('Build') {  
            steps {  
                sh 'npm run build'
            }
        }  
        stage('Test') {  
            steps {  
                sh 'npm run test'
            }
        }
    }  
       
    post {   
        success {  
            echo 'This will run only if successful'  
        }  
        failure {  
            mail bcc: '', body: "<b>Failure</b><br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br>", cc: '', charset: 'UTF-8', from: '', mimeType: 'text/html', replyTo: '', subject: "ERROR CI: Project name -> ${env.JOB_NAME}", to: "ahmed.osama1982002@gmail.com";  
        }  
        changed {  
            script{
                if(currentBuild.result == 'SUCCESS' && currentBuild.getPreviousBuild().result == 'FAILURE') {
                    mail bcc: '', body: "<b>Back to work</b><br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br>", cc: '', charset: 'UTF-8', from: '', mimeType: 'text/html', replyTo: '', subject: "Successful CI: Project name -> ${env.JOB_NAME}", to: "ahmed.osama1982002@gmail.com";    
                }
            }  
        }  
    }
}
