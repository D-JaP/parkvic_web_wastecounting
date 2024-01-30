// lambda server api for exchange code for token
// import axios
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
            "Set-Cookie": `access_token=${tokenResponse.access_token}; Secure; Path=/; Max-Age=${tokenResponse.expires_in}; SameSite=None;`,
            "set-cookie": `refresh_token=${tokenResponse.refresh_token}; Secure; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=None;`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "access-control-allow-credentials": "true"
          },
        //   cookies: [
        //     `access_token=${tokenResponse.access_token}; Secure; Path=/; Max-Age=${tokenResponse.expires_in}; SameSite=None;`,
        //     `refresh_token=${tokenResponse.refresh_token}; Secure; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=None;`
        //   ],
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
