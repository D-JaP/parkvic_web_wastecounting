@REM push to ecr
docker build --rm --progress plain -t stripe_lambda .
docker tag stripe_lambda:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/payment_intent:latest
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/payment_intent:latest