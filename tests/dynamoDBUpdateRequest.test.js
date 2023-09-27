import { describe, it, expect } from "vitest";

import { tableSetupTeardown } from "./dynamodbTestUtils.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamodbUpdateRequest } from "../graphql/dynamoUtils.js";

describe("Dynamodb Update request", () => {
  const tableName = "notes-test-update";
  const client = new DynamoDBClient({
      endpoint: "http://localhost:8000"
  });
  const docClient = DynamoDBDocumentClient.from(client);

  tableSetupTeardown(
    tableName,
    [{ AttributeName: "id", AttributeType: "S" }],
    [{ 
        id: { S: "15769963" }, 
        title: { S: "Testing Note" }, 
        content: { S: "This is the test content for Testing note will not chnage" }
    }]
  );

  it("should change 'Testing Note' to 'Testing Done Note'", async () => {
    const command = new GetCommand({
      TableName: tableName,
      Key: { id: "15769963" },
      ConsistentRead: true,
    });

    const before = await docClient.send(command);
    expect(before.Item.title).toBe("Testing Note");

    const response = await 
          dynamodbUpdateRequest(
              { "id": "15769963" },
              { title: "Testing Done Note" },
              tableName
          )

    // match the return Attributes
    expect(response.Attributes).toMatchObject({ 
        id: "15769963",
        title: "Testing Done Note"
    });
    expect(response.$metadata.httpStatusCode).toBe(200);

    const after = await docClient.send(command);
    expect(after.Item.title).toBe("Testing Done Note");
  });

});
