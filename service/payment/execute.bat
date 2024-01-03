@REM build and run 
docker build --rm --progress plain -t stripe_lambda .
docker run -it --rm -p 9000:8080 stripe_lambda 
