@REM push to ecr
docker build --rm --progress plain -t revoke_fn .
docker tag revoke_fn:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/revoke_fn:latest
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/revoke_fn:latest

@REM Create function 

@REM aws lambda create-function --function-name revoke_fn --package-type Image --code ImageUri=681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/revoke_fn:latest --role arn:aws:iam::681503573350:role/lambda-role
@REM update function image
aws lambda update-function-code --function-name revoke_fn --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/revoke_fn:latest