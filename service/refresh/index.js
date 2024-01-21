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
    console.log("refresh token :" + refresh_token);
    if (!refresh_token) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'missing refresh token'
            })
        }
    }

    let data = querystring.stringify({
        refresh_token: refresh_token,
        client_id: client_id,
        grant_type: 'refresh_token',
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
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
        return {
          statusCode: 400,
          body: JSON.stringify(error),
        };
      });

   
    // success return
    return {
      statusCode: 200,
      headers: {
        Location: "/",
      },
      cookies: [
        `access_token=${token_response.access_token}; Secure; Path=/; Max-Age=${token_response.expires_in}; SameSite=None;`
      ],
    };
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
  