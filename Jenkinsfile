pipeline {
  agent any

  environment {
    PORT = 8017
  }

  stages {
    stage('Setup') {
      steps {
        script {
          echo 'Preparing the environment...'
          // Ensure log and target directories exist
          sh 'rm -rf dist || true' // Clean previous build artifacts
          // sh 'nvm use 22.3.0' //set nvm version
          sh 'npm install' // npm install
        }
      }
    }

    stage('Build') {
      steps {
        script {
          echo 'Building the project...'
          sh 'npm run build' // Package the JAR without running tests
        }
      }
    }

    stage('Stop Current Service') {
      steps {
        script {
          echo 'Stopping any currently running service...'
          sh """
          if lsof -i:${PORT} > /dev/null; then
            echo "Port ${PORT} is in use. Stopping service..."
            lsof -t -i:${PORT} | xargs kill -9 || true
          fi
          """
        }
      }
    }

    stage('Start Application') {
      steps {
        script {
          echo 'Starting the Spring Boot application...'
          sh """
          JENKINS_NODE_COOKIE=dontKillMe && serve -l ${PORT} -s  dist >> log.txt 2>&1 &
          """
        }
      }
    }

    stage('Verify Deployment') {
      steps {
        script {
          echo 'Verifying that the application is running...'
          sh """
          if ! curl -s http://localhost:${PORT} > /dev/null; then
            echo "Application is not running on port ${PORT}."
            exit 1
          else
            echo "Application is successfully running on port ${PORT}."
          fi
          """
        }
      }
    }
  }

  post {
    failure {
      script {
        echo 'Pipeline failed. Check logs for details.'
      }
    }
  }
}
