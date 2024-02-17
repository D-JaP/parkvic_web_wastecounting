@REM push to ecr
docker build --rm --progress plain -t stripe_lambda .
docker tag stripe_lambda:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/payment_intent:latest
aws ecr batch-delete-image --repository-name payment_intent --image-ids imageTag=latest

docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/payment_intent:latest

aws lambda update-function-code --function-name paymentintent --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/payment_intent:latest
