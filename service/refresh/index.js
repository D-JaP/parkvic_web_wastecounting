const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const tokenEndpoint = process.env.TOKEN_ENDPOINT;
const credentials = btoa(`${client_id}:${client_secret}`);
const querystring = require('querystring');
exports.handler = async (event, context) => {
    // get cookies from header of event with name refresh_token
    const header = event.headers

    const cookies = header['cookie']
    if (!cookies) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'missing refresh token in cookies.'
            })
        }
    }
    const requestOrigin = header.origin;
    const acceptedOrigin = ["http://localhost:3000", "https://localhost:3000", "https://diqvd5r88q5zx.cloudfront.net", "https://parkvic-app.harry-playground.click" ]
    if (!acceptedOrigin.includes(requestOrigin)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'invalid origin.'
            })
        }
    }
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
        "set-cookie": `access_token=${token_response.access_token}; Secure; Path=/; Max-Age=${token_response.expires_in}; SameSite=None;Domain=${getApexDomain(requestOrigin)}`,
        "Access-Control-Allow-Origin": "https://parkvic-app.harry-playground.click",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({ access_token: token_response.access_token }),
    };
}

function extractRefreshToken(cookiesHeader) {
  const cookies = cookiesHeader.split(";");
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("refresh_token=")
  );

  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie
      .trim()
      .substring("refresh_token=".length);
    return refreshToken;
  }

  return null; // If refresh_token cookie is not found
}

function getApexDomain(domain) {
  const domainArray = domain.split(".");
  const apexDomain =
    domainArray[domainArray.length - 2] +
    "." +
    domainArray[domainArray.length - 1];
  return apexDomain;
}