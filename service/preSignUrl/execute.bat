aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com
docker build --rm --progress plain -t presignurl . 
docker tag presignurl:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/presignurl:latest

@REM aws ecr create-repository --repository-name presignurl

aws ecr batch-delete-image --repository-name presignurl --image-ids imageTag=latest
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/presignurl:latest


aws lambda update-function-code --function-name presignurl --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/presignurl:latest

aws cloudformation delete-stack --stack-name test-presignurl-stack && ^
aws cloudformation create-stack --stack-name test-presignurl-stack --template-body file://formation.yaml --capabilities CAPABILITY_IAM
aws cloudformation update-stack --stack-name test-presignurl-stack --template-body file://formation.yaml --capabilities CAPABILITY_IAM
