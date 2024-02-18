const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event, context, callback) => {
    const eventBody = JSON.parse(event.body);
    console.log(eventBody);
    if (eventBody.type !== "payment_intent.succeeded") {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid event type",
            }),
        };
    }
    try {
        const email = eventBody.data.object.receipt_email;
        updateSubscriptionStatus(email, true);
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: "Subscription status updated successfully",
            }),
        
        })
    }
    catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `An error occurred while updating DB. Message: ${error.message}`,
            }),
        };
    }
};

function updateSubscriptionStatus(email, status) {
    const params = {
        TableName: "parkvic",
        Key: {
            email: email,
        },
        UpdateExpression: "set premium_user = :s, premium_due_date = :d",
        ExpressionAttributeValues: {
            ":s": status,
            ":d": new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
        },
    };
    return docClient.send(new UpdateCommand(params));
}
