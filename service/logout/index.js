// lambda server api for exchange code for token
// import axios

exports.handler = async (event, context) => {
    try {
        const requestOrigin = event.headers['origin']; 
        return {
          statusCode: 200,
          headers: {
            Location: "/",
            "Set-Cookie": `access_token=''; Path=/; Secure;Max-Age=${0}; SameSite=None;Domain=${getApexDomain(requestOrigin)}`,
            "set-cookie": `refresh_token=''; HttpOnly; Path=/;Secure; Max-Age=${0}; SameSite=None;Domain=${getApexDomain(requestOrigin)}`,
            "Access-Control-Allow-Origin": requestOrigin,
            "access-control-allow-credentials": "true"
          }
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