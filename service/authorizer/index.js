const {CognitoJwtVerifier} =require('aws-jwt-verify');
const { DynamoDBClient } =require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand } =require( "@aws-sdk/lib-dynamodb");
const axios = require('axios');

const tokenEndpoint = process.env.TOKEN_ENDPOINT;
const client = new DynamoDBClient({region: "ap-southeast-2"});
const docClient = DynamoDBDocumentClient.from(client);
const {_200Callback ,_401Callback, _500Callback} = require('./response.js');

exports.handler = async function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Received context:', JSON.stringify(context, null, 2));
    // lambda authorizer function of main ParkVic Api
    /*the flow including:
      - check if user authenticated ? 
        if yes, check if user is premium (from dynamoDb)
        if no, refer to normal user.
      
      - with normal user: limit the rate of api usage to 10 success request.
      - premium user:no limit at 5000 success request per month.
    */

    //   create verifier
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;

    if (!userPoolId && !clientId) {
        console.log("missing user pool id or client id");
        callback(null, _500Callback("missing user pool id or client id"));
    }

    const verifier = CognitoJwtVerifier.create(
        {
            userPoolId:process.env.USER_POOL_ID,
            tokenUse:"access",
            clientId: process.env.CLIENT_ID
        }
    );
    
    // Retrieve request parameters from the Lambda function input:
    
    var access_token_header ;
    try {
        access_token_header= event.headers.authorization;
        console.log(access_token_header);
    }
    catch (err) {
        console.log("authorizaiton header not found. Treated as unauthenticated user");
    }

    var is_premium = false;
    var is_authenticated = false;
    var user_email;
    // get token from header   
    if  (!access_token_header || access_token_header  === "No auth"){
        console.log("missing token, unauthorized");
        console.log("serve user as non-premium user");
        is_premium = false;
        is_authenticated = false;
    }
    else {
        const token = access_token_header.split(' ')[1];
        if (!token){
            console.log("missing token, unauthorized");
            // callback(null, _401Callback("missing token"));
            // treating as unauthenticated user

        }
        else {
            // verify token
            await verifier.verify(token).then(async (data) => {
                console.log("verified token");
                console.log(data);
                is_authenticated = true;
            }).catch((err) => {
                console.log("invalid token, unauthorized");
                callback(null, _401Callback("invalid token"));
            })
            
            // get user detail
            const userDetail = await getUserDetailFromAccessToken(token).catch((err) => {
                callback(null, _401Callback("server cannot get user detail from provided token"));
            });
            user_email = userDetail.email;
            if(!user_email){
                callback(null, _401Callback("server cannot get email from provided token"));
            }
            // check if user is premium
            is_premium = await checkIfPremiumUser(user_email).catch((err) => {
                callback(null, _401Callback("server cannot check if user is premium.\n"+ err.message));
            });
        };
    }
    
    
    // if premium
    if (is_premium&&is_authenticated){
        callback(null, generateAllow('user', event.methodArn));
    }
    else if (!is_authenticated){ // limit per day applied
        // get ip address from event 
        var ip;
        try {
            ip = event.requestContext.identity.sourceIp;
            console.log("ip address found",ip);
        }
        catch(err){
            console.log("ip address not found");
            callback(null, _500Callback("ip address not found. Check if request is from api gateway test mode."));
        }
        // check if ip present in dynamoDb
        
        const params = {
            TableName: "unauthenticated_user",
            Key: {
                "ip": ip
            }
        }
        const data = await docClient.send(new GetCommand( )).catch((err) => {
            console.log("the ip provide not seen in db",err);
            return null;
        });
        // if not present, create new record, set limit per day
        console.log(data);
        if (!data){
            const put_params = {
                TableName: "unauthenticated_user",
                Item: {
                    ip: ip,
                    credit: process.env.CREDIT_LIMIT,
                    last_update: new Date().getTime()
                }
            };
            await docClient.send(new PutCommand(put_params)).then(() => {
                callback(null, generateAllow('user', event.methodArn));
            })
            .catch((err) => {
                console.log("error when creating new ip record",err);
                callback(null, _500Callback("server cannot create new ip record"));
            })
        }

        const new_data = await docClient.send(new GetCommand(params)).then(async ()=> {
            if(await isUserHaveCredit(ip, "ip", "unauthenticated_user")){
                callback(null, generateAllow('user', event.methodArn));
            }
            else {
                callback(null, generateDeny('user', event.methodArn, "User does not have enough credit"));
            }
        }).catch((err) => {
            console.log("the ip provide not seen in db",err);
            return null;
        });

    }
    else { // not paid user
        // check for free credit
        if (await isUserHaveCredit(user_email, "email")){
            callback(null, generateAllow('user', event.methodArn));
        }
        else {
            callback(null, generateDeny('user', event.methodArn, "User does not have enough credit"));
        }
    }
     
    
}

/*------------------------- HELPER FUNCTIONS -------------------------*/

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource, messages) {
    // Required output:
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        "message" : messages
    };
    return authResponse;
}
     
var generateAllow = function(principalId, resource, messages = "") {
    return generatePolicy(principalId, 'Allow', resource, messages);
}
     
var generateDeny = function(principalId, resource, messages = "") {
    return generatePolicy(principalId, 'Deny', resource, messages);
}



// function to check if user is premium
async function checkIfPremiumUser(email) {
    // check if user is premium
    const params = {
        TableName: "parkvic",
        Key: {
            "email": email
        }
    };
    var max_attempt = 3;
    var isGetSuccess = false;
    var data;
    while (max_attempt > 0 && isGetSuccess === false) {
        max_attempt -= 1;
        data = await docClient.send(new GetCommand(params));
        console.log(data.Item);
        if(!data.Item){
            console.log("user not found");
            console.log("updating new user to dynamoDb");
            const put_params = {
                TableName: "parkvic",
                Item: {
                    email: email,
                    premium_user: false,
                    credit: process.env.CREDIT_LIMIT
                }
            };
            
            await docClient.send(new PutCommand(put_params)).then(() => {
                
            })
            .catch((err) => {
                console.log("error when creating new user",err);
            })
        }
        else {
            isGetSuccess = true;
            break
        }
    }
    // if success
    if (!isGetSuccess){
        console.log("server cannot get user data from dynamoDb");
        throw new Error("server cannot get user data from dynamoDb");
    }
    console.log(data);
    

    if (data.Item.premium_user){
        console.log("user is premium");
        return true;
    }
    else {
        console.log("user is not premium");
        return false;
    }
}

async function isUserHaveCredit(input_querystring , mode = "email", tablename = "parkvic") {
    // check if user is premium from
    // -email
    // -ip
    
    const params = {
        TableName: tablename,
        Key: {
            [mode]: input_querystring
        }
    };
    const data = await docClient.send(new GetCommand(params)).catch((err) => {
        console.log("error when getting user credit",err);
        return null;
    });

    if(!data){
        return false;
    }
    const credit = data.Item.credit;
    const last_update = data.Item.last_update;
    const CREDIT_LIMIT  = parseInt(process.env.CREDIT_LIMIT);
    // if user have not use any credit more than 1 day, reset credit to CREDIT_LIMIT
    if(!last_update || last_update_1_day_more_than_today(last_update)){
        const update_params = {
            TableName: tablename,
            Key: {
                [mode] : input_querystring
            },
            UpdateExpression: "set last_update = :u, credit = :c",
            ExpressionAttributeValues:{
                // a a timestamp for last update
                ":u": new Date().getTime(),
                ":c": CREDIT_LIMIT - 1 
            }
        }
        const data = await docClient.send(new UpdateCommand(update_params)).catch(
            (err) => {
                console.log("updating credit and time failed with err",err);
                return false;
            }
        );
    }else {
        if (credit<=0){
            return false;
        }

        const update_params = {
            TableName: tablename,
            Key: {
                [mode] : input_querystring
            },
            UpdateExpression: "set last_update = :u, credit = :c",
            ExpressionAttributeValues:{
                // a a timestamp for last update
                ":u": new Date().getTime(),
                ":c": credit - 1 
            }
        }
        const data = await docClient.send(new UpdateCommand(update_params)).catch(
            (err) => {
                console.log("updating credit and time failed with err",err);
                return false;
            }
        );
        return true
    }
    
    // support function 
    function last_update_1_day_more_than_today (last_update){
        // check if lastupdate is yesterday
        const last_update_date = new Date(last_update);
        // get timestamp but only date

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        const midnightOfToday = new Date(currentYear, currentMonth, currentDay);

        if (last_update_date <midnightOfToday){
            return true;
        }
        else{
            return false;
        }
        
    }

}
// get user detail from access token
async function getUserDetailFromAccessToken(token){
    const option= {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const response = await axios.get(tokenEndpoint, option).then((response) => {
        if(response.status === 200){
            return response.data;
        }
    }).catch((err) => {
        console.log("error when getting user detail from access token",err);
        return null;
    });
    return response;
}
