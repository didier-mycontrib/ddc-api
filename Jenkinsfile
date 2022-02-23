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
			   ws("/conf-docker/backend-ddc/ddc-api") {
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
