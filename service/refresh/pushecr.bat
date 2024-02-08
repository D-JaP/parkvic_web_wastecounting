@REM push to ecr
docker build --rm --progress plain -t refresh . && ^
docker tag refresh:latest 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/refresh:latest
aws ecr batch-delete-image --repository-name refresh --image-ids imageTag=latest && ^
docker push 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/refresh:latest

@REM Create function 

@REM aws lambda create-function --function-name refresh --package-type Image --code ImageUri=681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/refresh:latest --role arn:aws:iam::681503573350:role/lambda-role
aws lambda update-function-code --function-name refresh --image-uri 681503573350.dkr.ecr.ap-southeast-2.amazonaws.com/refresh:latest
@REM update function image