pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World from ddc_api'
            }
		}
		stage('Checkout code') {
			steps {
			   ws("/docker-contents/ddc-api") {
				  checkout scm
			   }
			}
		}
		stage('recompose docker container') {
			steps {
			    ws("/conf-docker/backend-ddc") {
				     sh('date > lastUpdate.txt')
				}
			}
		}
    }
}
