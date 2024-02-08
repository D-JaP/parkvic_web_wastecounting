aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com
docker build --rm --progress plain -t wastecounter_parkvic_api_exchange_code_for_token . 
docker tag wastecounter_parkvic_api_exchange_code_for_token:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/wastecounter_parkvic_api_exchange_code_for_token:latest
aws ecr batch-delete-image --repository-name wastecounter_parkvic_api_exchange_code_for_token --image-ids imageTag=latest
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/wastecounter_parkvic_api_exchange_code_for_token:latest

aws lambda update-function-code --function-name wastecounter_parkvic_api_exchange_code_for_token --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/wastecounter_parkvic_api_exchange_code_for_token:latest
