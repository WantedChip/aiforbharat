import json
import os
import boto3

VERIFY_TOKEN = os.environ.get("VERIFY_TOKEN")
ROUTER_LAMBDA = os.environ.get("ROUTER_LAMBDA")

lambda_client = boto3.client("lambda")


def lambda_handler(event, context):

    method = event.get("requestContext", {}).get("http", {}).get("method")

    # --------------------------------------------------
    # 1. Webhook verification (Meta setup step)
    # --------------------------------------------------
    if method == "GET":

        params = event.get("queryStringParameters", {})

        mode = params.get("hub.mode")
        token = params.get("hub.verify_token")
        challenge = params.get("hub.challenge")

        if mode == "subscribe" and token == VERIFY_TOKEN:
            return {
                "statusCode": 200,
                "body": challenge
            }

        return {
            "statusCode": 403,
            "body": "Verification failed"
        }

    # --------------------------------------------------
    # 2. Incoming WhatsApp events
    # --------------------------------------------------
    if method == "POST":

        body = json.loads(event.get("body", "{}"))

        print("Incoming webhook:")
        print(json.dumps(body, indent=2))

        if not body.get("entry"):
            return {
                "statusCode": 200,
                "body": "NO_ENTRY"
            }

        for entry in body["entry"]:

            for change in entry.get("changes", []):

                value = change.get("value", {})

                # ------------------------------------------
                # Ignore delivery/read status events
                # ------------------------------------------
                if "statuses" in value:
                    print("Skipping status event")
                    continue

                # ------------------------------------------
                # Process actual messages
                # ------------------------------------------
                if "messages" not in value:
                    print("No messages field found")
                    continue

                for message in value["messages"]:

                    sender = message.get("from")

                    payload = {
                        "phone": sender,
                        "type": message.get("type"),
                        "message": message,
                        "timestamp": message.get("timestamp")
                    }

                    print("Forwarding to router:")
                    print(json.dumps(payload, indent=2))

                    try:
                        lambda_client.invoke(
                            FunctionName=ROUTER_LAMBDA,
                            InvocationType="Event",  # async call
                            Payload=json.dumps(payload).encode("utf-8")
                        )
                    except Exception as e:
                        print("Router invocation failed:", str(e))

        return {
            "statusCode": 200,
            "body": "EVENT_RECEIVED"
        }

    return {
        "statusCode": 404,
        "body": "Not found"
    }