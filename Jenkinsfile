#!groovy

pipeline {
  agent {
    label 'linux'
  }

  options{
    buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '10'))
  }

  environment {
    /* Override the npm cache directory to avoid: EACCES: permission denied, mkdir '/.npm' */
    npm_config_cache='.npm-cache'
    /* set home to our current directory
    * EACCES: permission denied, mkdir '/.config'
    */
    HOME='.'
    JOB_BASE_NAME = "${env.JOB_NAME}".split('/').first()

    // a jenkins credential for each environment eg. myclient-ui-dev.env
    DEV_VARS_FILE=credentials("westpac-fa-ui-dev.env")
    PREVIEW_VARS_FILE=credentials("westpac-fa-ui-preview.env")
    // PROD_VARS_FILE=credentials("westpac-ui-fa-prod.env")
    FEEDBACK_FORM_DEV="https://sit03.www.westpac.com.au/wendy-feedback-form/"
    FEEDBACK_FORM_UAT="https://uat01.www.westpac.com.au/wendy-feedback-form/"
    FEEDBACK_FORM_PROD="https://www.westpac.com.au/wendy-feedback-form/"
  }

  stages {

    stage('Archive the source code') {
      steps {
        zip zipFile: 'westpac-fa-source.zip', archive: true
      }
    }

    /*
    Build step should populate /deploy/{environment} directory with all files to publish.
    */
    stage('Build: develop') {
      when {
        branch 'develop'
      }
      steps {
        withCredentials([string(credentialsId: 'npm-readonly-token', variable: 'NPM_TOKEN')]) {

            echo ""
            echo "Building ${env.BRANCH_NAME} branch for ${env.JOB_BASE_NAME}"
            echo "========================================="

            // install all the dependencies
            sh """
            ls -lat
            echo '//registry.npmjs.org/:_authToken="${env.NPM_TOKEN}"' > .npmrc
            rm -rf node_modules
            npm install
            rm .npmrc
            """

            // build for dev
            sh """
            echo "Loading vars from ${env.DEV_VARS_FILE}"
            . ${env.DEV_VARS_FILE}
            
            echo "use vars:"
            echo "ENVIRONMENT_NAME: \$ENVIRONMENT_NAME"
            echo "TOKEN_ISSUER: \$TOKEN_ISSUER"
            echo "SESSION_SERVER: \$SESSION_SERVER"

            npm run build:ci -- --env.SESSION_SERVER=\$SESSION_SERVER --env.TOKEN_ISSUER=\$TOKEN_ISSUER --env.FEEDBACK_FORM=\$FEEDBACK_FORM_DEV
            mkdir -p deploy/\$ENVIRONMENT_NAME
            mv dist/* deploy/\$ENVIRONMENT_NAME
            """
        }
      }
    }

    /*
    Syncs all files from the dist directory to the s3 bucket.
    */
    stage('Deploy: develop -> dev') {
      when {
        branch 'develop'
      }
      steps {

        echo ""
        echo "Publishing ${env.BRANCH_NAME} branch for ${env.JOB_BASE_NAME}"
        echo "========================================="

        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins.nexus-devuser']]) {
          sh """
          echo "Loading vars from ${env.DEV_VARS_FILE}"
          . ${env.DEV_VARS_FILE}

          echo "use vars:"
          echo "PROJECT_NAME: \$PROJECT_NAME"
          echo "ENVIRONMENT_NAME: \$ENVIRONMENT_NAME"
          echo "AWS_DISTRIBUTION_ID: \$AWS_DISTRIBUTION_ID"

          aws s3 sync deploy/\$ENVIRONMENT_NAME/ s3://sm-dev-frontend-bucket/\$PROJECT_NAME/\$ENVIRONMENT_NAME/ --delete
          aws cloudfront create-invalidation --distribution-id \$AWS_DISTRIBUTION_ID --paths '/*'
          """
        }

      }
    }

    /*
    Build step should populate /deploy/{environment} directory with all files to publish.
    */
    stage('Build: master') {
      when {
        branch 'master'
      }
      steps {
        withCredentials([string(credentialsId: 'npm-readonly-token', variable: 'NPM_TOKEN')]) {

            echo ""
            echo "Building ${env.BRANCH_NAME} branch for ${env.JOB_BASE_NAME}"
            echo "========================================="

            // install all the dependencies
            sh """
            ls -lat
            echo '//registry.npmjs.org/:_authToken="${env.NPM_TOKEN}"' > .npmrc
            rm -rf node_modules
            npm install
            rm .npmrc
            """

            // build for preview
            sh """
            echo "Loading vars from ${env.PREVIEW_VARS_FILE}"
            . ${env.PREVIEW_VARS_FILE}

            echo "use vars:"
            echo "ENVIRONMENT_NAME: \$ENVIRONMENT_NAME"
            echo "TOKEN_ISSUER: \$TOKEN_ISSUER"
            echo "SESSION_SERVER: \$SESSION_SERVER"

            npm run build:ci -- --env.SESSION_SERVER=\$SESSION_SERVER --env.TOKEN_ISSUER=\$TOKEN_ISSUER --env.FEEDBACK_FORM=\$FEEDBACK_FORM_UAT
            mkdir -p deploy/\$ENVIRONMENT_NAME
            mv dist/* deploy/\$ENVIRONMENT_NAME
            """

            // build for prod
            /*sh """
            echo "Loading vars from ${env.PROD_VARS_FILE}"
            . ${env.PROD_VARS_FILE}

            echo "use vars:"
            echo "ENVIRONMENT_NAME: \$ENVIRONMENT_NAME"
            echo "TOKEN_ISSUER: \$TOKEN_ISSUER"
            echo "SESSION_SERVER: \$SESSION_SERVER"

            npm run build:ci -- --env.SESSION_SERVER=\$SESSION_SERVER --env.TOKEN_ISSUER=\$TOKEN_ISSUER
            mkdir -p deploy/\$ENVIRONMENT_NAME
            mv dist/* deploy/\$ENVIRONMENT_NAME
            """*/
        }
      }
    }

    /*
    Syncs all files from the dist directory to the s3 bucket.
    */
    stage('Deploy: master -> preview') {
      when {
        branch 'master'
      }
      steps {

        echo ""
        echo "Publishing ${env.BRANCH_NAME} branch for ${env.JOB_BASE_NAME}"
        echo "========================================="

        // publish preview
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins.nexus-devuser']]) {
          sh """
          echo "Loading vars from ${env.PREVIEW_VARS_FILE}"
          . ${env.PREVIEW_VARS_FILE}

          echo "use vars:"
          echo "PROJECT_NAME: \$PROJECT_NAME"
          echo "ENVIRONMENT_NAME: \$ENVIRONMENT_NAME"
          echo "AWS_DISTRIBUTION_ID: \$AWS_DISTRIBUTION_ID"

          aws s3 sync deploy/\$ENVIRONMENT_NAME/ s3://sm-dev-frontend-bucket/\$PROJECT_NAME/\$ENVIRONMENT_NAME/ --delete
          aws cloudfront create-invalidation --distribution-id \$AWS_DISTRIBUTION_ID --paths '/*'
          """
        }

      }
    }

    /*
    Syncs all files from the dist directory to the s3 bucket.
    */
    /*stage('Deploy: master -> production') {
      when {
        branch 'master'
      }
      steps {

        // wait 10 mins for manual confirmation to publish to production
        script {
          timeout(time: 10, unit: 'MINUTES') {
            input(id: "Deployment Gate", message: "Deploy ${env.BRANCH_NAME} to production?", ok: 'Publish')
          }
        }

        echo ""
        echo "PRODUCTION: Publishing ${env.BRANCH_NAME} branch for ${env.JOB_BASE_NAME}"
        echo "========================================="

        // publish prod
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'jenkins-prod.nexus']]) {
          sh """
          echo "Loading vars from ${env.PROD_VARS_FILE}"
          . ${env.PROD_VARS_FILE}

          echo "use vars:"
          echo "PROJECT_NAME: \$PROJECT_NAME"
          echo "ENVIRONMENT_NAME: \$ENVIRONMENT_NAME"
          echo "AWS_DISTRIBUTION_ID: \$AWS_DISTRIBUTION_ID"

          aws s3 sync deploy/\$ENVIRONMENT_NAME/ s3://sm-frontend-bucket/\$PROJECT_NAME/\$ENVIRONMENT_NAME/ --delete
          aws cloudfront create-invalidation --distribution-id \$AWS_DISTRIBUTION_ID --paths '/*'
          """
        }

      }
    }*/

  }

}
