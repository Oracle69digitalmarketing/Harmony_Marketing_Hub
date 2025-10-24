import json
import boto3

# Initialize Bedrock Runtime client
bedrock = boto3.client("bedrock-runtime", region_name="eu-central-1")

def lambda_handler(event, context):
    try:
        # Parse incoming event
        body = json.loads(event.get("body", "{}")) if "body" in event else event
        user_input = body.get("input", "").strip()

        if not user_input:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": "Missing input text"})
            }

        # Model fallback ARNs
        model_fallbacks = [
            "arn:aws:bedrock:eu-central-1:114501972554:inference-profile/eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
            "arn:aws:bedrock:eu-central-1:114501972554:inference-profile/eu.anthropic.claude-3-5-sonnet-20240620-v1:0",
            "arn:aws:bedrock:eu-central-1:114501972554:inference-profile/eu.anthropic.claude-3-sonnet-20240229-v1:0",
            "arn:aws:bedrock:eu-central-1:114501972554:inference-profile/eu.amazon.nova-lite-v1:0"
        ]

        prompt = f"""
You are Harmony AI — the intelligent marketing strategist behind Harmony Marketing Hub.
Respond in a sharp, concise, and business-oriented tone.

Task: {user_input}
"""

        last_error = None

        for model_id in model_fallbacks:
            try:
                # Auto-select payload based on model type
                if "claude" in model_id:
                    payload = {
                        "anthropic_version": "2023-07-01",
                        "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}]
                    }
                else:
                    payload = {
                        "input": prompt,
                        "temperature": 0.7,
                        "max_output_tokens": 400
                    }

                response = bedrock.invoke_model(
                    modelId=model_id,
                    body=json.dumps(payload),
                    contentType="application/json",
                    accept="application/json"
                )

                response_body = json.loads(response["body"].read())

                # Extract text output safely
                output_text = (
                    response_body.get("output_text")
                    or (response_body.get("content", [{}])[0].get("text") if response_body.get("content") else "No output generated.")
                )

                return {
                    "statusCode": 200,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({
                        "input": user_input,
                        "output": output_text.strip(),
                        "model": model_id
                    })
                }

            except Exception as e:
                last_error = str(e)
                continue

        # All models failed
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"All models failed. Last error: {last_error}"})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }
