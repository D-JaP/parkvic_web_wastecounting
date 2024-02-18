aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com
docker build --rm --progress plain -t parkvic-stripe-webhook . 
docker tag parkvic-stripe-webhook:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/parkvic-stripe-webhook:latest

@REM aws ecr create-repository --repository-name parkvic-stripe-webhook

aws ecr batch-delete-image --repository-name parkvic-stripe-webhook --image-ids imageTag=latest
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/parkvic-stripe-webhook:latest

aws lambda update-function-code --function-name parkvic-stripe-webhook --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/parkvic-stripe-webhook:latest
