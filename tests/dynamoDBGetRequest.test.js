import { describe, it, expect } from "vitest";

import { tableSetupTeardown } from "./dynamodbTestUtils.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamoDBGetItemRequest } from "../graphql/dynamoUtils.js";

describe("Dynamodb get request", () => {
  const tableName = "notes-test-get";
  const client = new DynamoDBClient({
      endpoint: "http://localhost:8000"
  });
  const docClient = DynamoDBDocumentClient.from(client);

  tableSetupTeardown(
    tableName,
    [{ AttributeName: "id", AttributeType: "S" }],
    [
      {
        id : { S: "get-with-this-id" },
        createdAt: { S: "1695735529"},
      },
    ]
  );

  it("should get the already set item from the database", async () => {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        id: "get-with-this-id",
      },
    });
    
    const response = await dynamoDBGetItemRequest({ id: "very-unique-id"}, tableName);
    expect(response.$metadata.httpStatusCode).toBe(200);

    const result = await docClient.send(getCommand);
    expect(result.Item).toMatchObject({
        id: "get-with-this-id",
        createdAt: "1695735529"
    });
  });
});
