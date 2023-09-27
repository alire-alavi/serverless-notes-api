import { Socket } from "net";
import { beforeAll, afterAll } from "vitest";
import {
    CreateTableCommand,
    DeleteTableCommand,
    DynamoDBClient,
    waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";


/**
    * TODO: Handle these type mathcing
 *
 * @param {string} tableName
 * @param {import('@aws-sdk/client-dynamodb').AttributeDefinition[]} primaryKey
 * @param {Record<string, import('@aws-sdk/client-dynamodb').AttributeValue>[]} items
 */
export const tableSetupTeardown = (tableName, primaryKey, items = []) => {
    const client = new DynamoDBClient({
        endpoint: "http://localhost:8000"
    });    
    const createTableCommand = new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: primaryKey,
        KeySchema: [
            {
                AttributeName: primaryKey[0].AttributeName,
                KeyType: "HASH",
            },
        ],
        BillingMode: "PAY_PER_REQUEST",
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
    });
    const deleteTableCommand = new DeleteTableCommand({ TableName: tableName });

    beforeAll(async () => {
        await client.send(createTableCommand);
        await waitUntilTableExists({ client }, { TableName: tableName });

        if (items.length) {
            const batchWriteItemCommand = new BatchWriteItemCommand({
                RequestItems: {
                    [tableName]: items.map((item) => ({
                        PutRequest: {
                            Item: item,
                        },
                    })),
                },
            });

            await client.send(batchWriteItemCommand);
        }
    });
    afterAll(() => client.send(deleteTableCommand));
};
