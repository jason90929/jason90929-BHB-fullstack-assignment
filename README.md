# Introduction

## Start project locally

To start this project locally, you need to execute `npm install` in Terminal first, 
and additionally install global packages e.g. `npm i -g typescript ts-node nodemon`  
then execute `npm run dev` to start 

## Build image via Docker

In this project, after deploy all requirement services to AWS by using Terraform
Then we can start build docker to make this project production-ready

Step 1, need to login AWS

`aws ecr get-login-password --region ap-northeast-1 | docker login \
--username AWS --password-stdin 306698408315.dkr.ecr.ap-northeast-1.amazonaws.com `

Step 2, execute deploy to AWS

`cd terraform`
`terraform apply`

Step 3, upload image to ECR

`docker build -t aha-service .`
`docker tag aha-service:latest 306698408315.dkr.ap-northeast-1.amazonaws.com/aha-service:latest`
`docker push 306698408315.dkr.ap-northeast-1.amazonaws.com/aha-service:latest`

Then wait and see the result 

### Destroy all deployed stuff

In order to not be charged by AWS every day, we need to stop machine online

Step 1, open AWS ECR and delete all deployed images manually, then:

Step 2, terminate and delete all deployed services on AWS

`cd terraform`
`terraform destroy`
