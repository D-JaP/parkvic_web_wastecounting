// lambda server api for exchange code for token
// import axios
const { get } = require('http');
const querystring = require('querystring');
exports.handler = async (event, context) => {
    try {
        const authorizationCode = JSON.parse(event.body)["authorizationCode"]
        console.log(authorizationCode)
        if (!authorizationCode) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'missing authorization code'
                })
            }
        }
        // read env secret lambda function
        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const tokenEndpoint = process.env.TOKEN_ENDPOINT;
        const credentials = btoa(`${client_id}:${client_secret}`);
        const requestOrigin = event.headers.origin;
        const acceptedOrigin = ["http://localhost:3000", "https://localhost:3000", "https://diqvd5r88q5zx.cloudfront.net", "https://parkvic-app.harry-playground.click" ]
        
        if (!acceptedOrigin.includes(requestOrigin)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'invalid origin'
                })
            }
        }
        // console.log(client_id);
        // console.log(client_secret);
        // console.log(tokenEndpoint);
        // console.log(credentials)
        let data = querystring.stringify({
            grant_type: 'authorization_code',
            code: authorizationCode,
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: requestOrigin
        });
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`,
            },
            body: data
        }).then(
            response => response.json()
        ).then((data) => {
            console.log(data);
            return data
        })
        .catch(
            error => console.log(error)
        )
        ;
        // check if tokenResponse has error
        if (tokenResponse.error) {
            console.error("error when getting token ");
            return {
                statusCode: 400,
                body: JSON.stringify({"message": tokenResponse})
            }
        }
        // success return
        console.log("success return ");
        return {
          statusCode: 200,
          headers: {
            Location: "/",
            "Set-Cookie": `access_token=${tokenResponse.access_token}; Path=/; Secure;Max-Age=${tokenResponse.expires_in}; SameSite=None;Domain=${getApexDomain(requestOrigin)}`,
            "set-cookie": `refresh_token=${tokenResponse.refresh_token}; HttpOnly; Path=/;Secure; Max-Age=${60 * 60 * 24 * 30}; SameSite=None;Domain=${getApexDomain(requestOrigin)}`,
            "Access-Control-Allow-Origin": requestOrigin,
            "access-control-allow-credentials": "true"
          },
          body: JSON.stringify({access_token:tokenResponse.access_token})
        };
    }
    catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
};

function getApexDomain(domain){
    const domainArray = domain.split(".");
    const apexDomain = domainArray[domainArray.length-2] + "." + domainArray[domainArray.length-1];
    return apexDomain;
}