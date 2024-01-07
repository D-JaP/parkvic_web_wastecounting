// lambda server api for exchange code for token
// import axios
const axios = require('axios');
const querystring = require('querystring');
exports.handler = async (event, context) => {
    try {
        const authorizationCode = event.authorizationCode;
        console.log(authorizationCode);
        // read env secret lambda function
        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const tokenEndpoint = process.env.TOKEN_ENDPOINT;
        const credentials = btoa(`${client_id}:${client_secret}`);

        // console.log(client_id);
        // console.log(client_secret);
        // console.log(tokenEndpoint);
        // console.log(credentials)
        let data = querystring.stringify({
            grant_type: 'authorization_code',
            code: authorizationCode,
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: 'http://localhost:3000'
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
        
        return {
            statusCode: 200,
            body: JSON.stringify(tokenResponse)
        }
    }
    catch (err) {
        console.log(err);

        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
};
