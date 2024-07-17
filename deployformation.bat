aws apigateway delete-stage --rest-api-id 1x7z1z1z1z --stage-name deploy
aws cloudformation delete-stack --stack-name test-formation-stack
aws cloudformation create-stack --stack-name test-formation-stack --template-body file://parkvic-web-formation.yaml --capabilities CAPABILITY_IAM