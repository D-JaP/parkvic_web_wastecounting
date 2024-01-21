@REM build and run 
docker build --rm --progress plain -t revoke_fn .
docker run -it --rm -p 9000:8080 revoke_fn 
