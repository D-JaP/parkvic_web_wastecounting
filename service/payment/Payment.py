import stripe
import json
import os
def lambda_handler(event, context):
    stripe.api_key = os.environ.get("STRIPE_SECRET")
    data = to_dict(json.loads(json.dumps(event["body"])))
    amount = data["amount"]
    currency = data["currency"]
    if (amount is None or currency is None):
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "Missing crucial parameters in request body"
            })
        }
    
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency
        )
        return {
            "statusCode": 200,
            "body": json.loads(json.dumps({
                "paymentIntent": payment_intent
            }))
        }
    
    except Exception as e:
        # handle errors
        return {
            "statusCode": 400,
            "body": json.loads(json.dumps({
                "message": "An Error Occured while processing the payment. Messages: " + str(e)
            }))
        }

def to_dict(obj : object) -> dict:
    """ Serialize Object to Dictionary Recursively

    Arguments:
        obj {object} -- string, list, or dictionary to be serialize

    Returns:
        dict -- Serialized Dictionary
    """

    if isinstance(obj, dict):
        data = {}
        for k, v in obj.items():
            data[k] = to_dict(v)
        return data

    elif hasattr(obj, "_ast"):
        return to_dict(obj._ast())

    elif hasattr(obj, "__iter__") and not isinstance(obj, str):
        return [to_dict(v) for v in obj]

    elif hasattr(obj, "__dict__"):
        data = {key : to_dict(value) for key, value in obj.__dict__.items() if 
                  not callable(value) and not key.startswith('_')}

    elif isinstance(obj, str):
        try:
            data = {}
            obj = json.loads(obj)
            for k, v in obj.items():
                data[k] = to_dict(v)
                return data
        except:
            return obj
    else:
        return obj
