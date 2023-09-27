import { describe, it, expect } from "vitest";

import { tableSetupTeardown } from "./dynamodbTestUtils.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamodbDeleteRequest } from "../graphql/dynamoUtils.js";

describe("Dynamodb delete request", () => {
  const tableName = "notes-test-delete";
  const client = new DynamoDBClient({
      endpoint: "http://localhost:8000"
  });
  const docClient = DynamoDBDocumentClient.from(client);

  tableSetupTeardown(
    tableName,
    [{ AttributeName: "id", AttributeType: "S" }],
    [
      {
        id : { S: "very-unique-id" },
      },
    ]
  );

  it("should remove an item from a database", async () => {
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: {
        id: "very-unique-id",
      },
    });

    const before = await docClient.send(getCommand);
    expect(before.Item).toBeDefined();
    
    const response = await dynamodbDeleteRequest({ id: "very-unique-id"}, tableName);
    expect(response.$metadata.httpStatusCode).toBe(200);

    const result = await docClient.send(getCommand);
    expect(result.Item).toBeUndefined();
  });
});
