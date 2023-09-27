import { describe, expect, it } from "vitest";
import { 
    dynamodbPutRequest,
} from "../graphql/dynamoUtils";
import { tableSetupTeardown } from "./dynamodbTestUtils.js";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

describe("dynamodbPutRequest", () => {
    const client = new DynamoDBClient({
        endpoint: "http://localhost:8000"
    });
    const tableName = "notes-test-put";
    tableSetupTeardown(
        tableName,
        [{ AttributeName: "id", AttributeType: "S" }]
    );

    it("should put an item in DynamoDB and return the response", async () => {
        const values = {
            id: "uniqueId",
            name: "John Doe",
        };

        await dynamodbPutRequest(values, tableName);
        const command = new GetItemCommand({
            TableName: tableName,
            ConsistentRead: true,
            Key: {
                id : { S: values.id },
            },
        });
        const { Item } = await client.send(command);
        expect(Item).toMatchObject({
            "id": {
                "S": "uniqueId",
            },
            "name": {
                "S": "John Doe",
            }}
        );
    });
});

