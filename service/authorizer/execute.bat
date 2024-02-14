aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com
docker build --rm --progress plain -t parkvic-authorizer . 
docker tag parkvic-authorizer:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/parkvic-authorizer:latest

@REM aws ecr create-repository --repository-name parkvic-authorizer

aws ecr batch-delete-image --repository-name parkvic-authorizer --image-ids imageTag=latest
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/parkvic-authorizer:latest


aws lambda update-function-code --function-name parkvic-authorizer --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/parkvic-authorizer:latest
