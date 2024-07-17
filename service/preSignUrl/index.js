const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    try {
        // Parse event body JSON
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: process.env.key,
            ContentType: process.env.contentType,
            Expires: 3600 // URL expires in 1 hour
        };
        
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://parkvic-app.harry-playground.click'
            },
            body: JSON.stringify({
                signedUrl: signedUrl
            })
        };

    } catch (error) {
        // Handle errors
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `An error occurred while processing the sign-url request . Message: ${error.message}`
            })
        };
    }
};
