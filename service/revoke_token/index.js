const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const tokenEndpoint = process.env.TOKEN_ENDPOINT;
const credentials = btoa(`${client_id}:${client_secret}`);
const querystring = require('querystring');
exports.handler = async (event, context) => {
    // get cookies from header of event with name refresh_token
    const header = event.headers
    const cookies = header['Cookie']
    const refresh_token = extractRefreshToken(cookies);
    console.log(credentials);
    if (!refresh_token) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'missing refresh token'
            })
        }
    }

    let data = querystring.stringify({
        token: refresh_token,
    });
    console.log("fetching token...");
    const token_response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: data,
    })
      .then((response) => {
        console.log(response);
        response.json()
    })
      .then((data) => {
        console.log(data);
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          statusCode: 400,
          body: JSON.stringify(error),
        };
      });
    


}

function extractRefreshToken(cookiesHeader) {
    // Your logic to parse the cookiesHeader and extract the refresh_token
    // Implement this according to the format of your cookies
    // For example, you might use a library like 'cookie' or implement custom parsing logic
    // Assuming a simple implementation where cookies are separated by semicolons
    const cookies = cookiesHeader.split(';');
    const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refresh_token='));
  
    if (refreshTokenCookie) {
      const refreshToken = refreshTokenCookie.trim().substring('refresh_token='.length);
      return refreshToken;
    }
  
    return null; // If refresh_token cookie is not found
  }
  