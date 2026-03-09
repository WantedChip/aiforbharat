import json
import os
import boto3
import time

VERIFY_TOKEN = "neta_ai_token"

dynamodb = boto3.resource("dynamodb")
lambda_client = boto3.client("lambda")
dedupe_table = dynamodb.Table("netaai_message_ids")


def lambda_handler(event, context):

    print("Incoming event:", json.dumps(event))

    method = event.get("requestContext", {}).get("http", {}).get("method")
    if not method:
        method = event.get("requestContext", {}).get("httpMethod")

    # ── Webhook verification ──────────────────────────────────────
    if method == "GET":
        params = event.get("queryStringParameters", {})
        mode = params.get("hub.mode")
        token = params.get("hub.verify_token")
        challenge = params.get("hub.challenge")

        if mode == "subscribe" and token == VERIFY_TOKEN:
            return {"statusCode": 200, "body": challenge}
        return {"statusCode": 403}

    # ── Incoming messages ─────────────────────────────────────────
    if method == "POST":

        try:
            body = json.loads(event["body"])

            entry = body.get("entry", [{}])[0]
            changes = entry.get("changes", [{}])[0]
            value = changes.get("value", {})

            # Ignore status events immediately
            if "statuses" in value:
                return {"statusCode": 200, "body": "ok"}

            messages = value.get("messages")
            if not messages:
                return {"statusCode": 200, "body": "ok"}

            message_id = messages[0].get("id")

            # Atomic dedup — prevents duplicate processing
            try:
                dedupe_table.put_item(
                    Item={
                        "message_id": message_id,
                        "ttl": int(time.time()) + 86400
                    },
                    ConditionExpression="attribute_not_exists(message_id)"
                )
            except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
                print(f"Duplicate {message_id} — ignoring")
                return {"statusCode": 200, "body": "ok"}

            # Fire and forget — processor runs async, we return 200 instantly
            lambda_client.invoke(
                FunctionName="netaai-bot-processor",
                InvocationType="Event",
                Payload=json.dumps(event).encode()
            )

        except Exception as e:
            print("Webhook handler error:", str(e))

        # Always return 200 immediately — WhatsApp never retries
        return {"statusCode": 200, "body": "ok"}

    return {"statusCode": 404}