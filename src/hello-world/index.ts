import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from "axios";
import { logger } from "commons";
// import { logger } from "Utils";

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

// Test this function running: `sam local invoke --event events/event.json HelloWorldFunction`

export const handler = async (event: APIGatewayProxyEventV2) => {
  // logger("asdasdas");
  logger("asdasd")
  const test_payload = await axios
    .get("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.data);
  const response: APIGatewayProxyResultV2 = {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello storydots!",
      body: test_payload,
    }),
  };

  return response;
};
