import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import axios from "axios";
import { logger } from "commons";

// Test this function running:
// sam local invoke --event events/event.json HelloWorldFunction
export const handler = async (event: APIGatewayProxyEventV2) => {
  const test_payload = await axios
    .get("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.data);
  logger(test_payload);
  const response: APIGatewayProxyResultV2 = {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello world!",
      body: test_payload,
    }),
  };

  return response;
};
