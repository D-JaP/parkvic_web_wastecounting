npm run build && ^
aws s3 sync ./build/. s3://parkvic-app.harry-playground.click && ^
aws cloudfront create-invalidation --distribution-id E1F7CU4PTHROI3 --paths "/*"