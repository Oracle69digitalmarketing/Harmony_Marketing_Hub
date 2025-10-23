import json
import boto3

# Initialize Bedrock Runtime client
bedrock = boto3.client("bedrock-runtime", region_name="eu-central-1")

def lambda_handler(event, context):
    try:
        # Parse incoming event to accommodate different invocation sources
        body = json.loads(event.get("body", "{}")) if isinstance(event.get("body"), str) else event.get("body", {})
        user_input = body.get("input", "").strip()

        if not user_input:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": "Input text is missing or empty."})
            }

        # A list of standard, valid model IDs for fallback
        model_fallbacks = [
            "anthropic.claude-3-5-sonnet-20240620-v1:0",
            "anthropic.claude-3-sonnet-20240229-v1:0",
            "anthropic.claude-3-haiku-20240307-v1:0",
            "amazon.titan-text-express-v1"
        ]

        prompt = f"""
You are Harmony AI — the intelligent marketing strategist behind Harmony Marketing Hub.
Respond in a sharp, concise, and business-oriented tone.

Task: {user_input}
"""

        last_error = "No models were available or all failed."

        for model_id in model_fallbacks:
            try:
                output_text = None
                
                # 1. Construct payload based on model provider
                if "anthropic" in model_id:
                    payload = {
                        "anthropic_version": "bedrock-2023-05-31",
                        "max_tokens": 4000,
                        "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}]
                    }
                    request_body = json.dumps(payload)
                elif "amazon.titan" in model_id:
                    payload = {
                        "inputText": prompt,
                        "textGenerationConfig": {
                            "maxTokenCount": 4000,
                            "temperature": 0.7
                        }
                    }
                    request_body = json.dumps(payload)
                else:
                    continue # Skip unsupported model families

                # 2. Invoke Model
                response = bedrock.invoke_model(
                    modelId=model_id,
                    body=request_body,
                    contentType="application/json",
                    accept="application/json"
                )
                response_body = json.loads(response["body"].read())

                # 3. Parse response based on model provider
                if "anthropic" in model_id:
                    if response_body.get("content") and isinstance(response_body["content"], list):
                        output_text = response_body["content"][0].get("text")
                elif "amazon.titan" in model_id:
                    if response_body.get("results") and isinstance(response_body["results"], list):
                        output_text = response_body["results"][0].get("outputText")

                # 4. Return success if output is valid
                if output_text:
                    return {
                        "statusCode": 200,
                        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
                        "body": json.dumps({
                            "input": user_input,
                            "output": output_text.strip(),
                            "model": model_id
                        })
                    }
                else:
                    last_error = f"Model {model_id} returned an empty response."
                    continue

            except Exception as e:
                print(f"Error invoking model {model_id}: {str(e)}")
                last_error = str(e)
                continue

        # If loop completes, all models failed
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": f"All models failed. Last error: {last_error}"})
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Invalid JSON in request body."})
        }
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": f"An internal server error occurred: {str(e)}"})
        }
