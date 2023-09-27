import { describe, expect, it, vi} from "vitest";
import { 
    dynamoDBScanRequest,
} from "../graphql/dynamoUtils";
import { tableSetupTeardown } from "./dynamodbTestUtils.js";

const tableName = "notes-test-scan";

describe("dynamoDBScanRequest", () => { 
    const insertObject = [
        { id: { S: "1" }, content: { S: "content first" }, createdAt: { S: "16717623" } },
        { id: { S: "2" }, content: { S: "content second" }, createdAt: { S: "16717624" } },
        { id: { S: "3" }, content: { S: "content third" }, createdAt: { S: "16717625" } },
        { id: { S: "4" }, content: { S: "content fourth" }, createdAt: { S: "16717626" } }
    ]
    tableSetupTeardown(
        tableName,
        [{ AttributeName: "id", AttributeType: "S" }],
        insertObject,
    );

    it("should return a list of items from DynamoDB", async() => { 
        // const spy = vi.spyOn(console, "log");
        const response = await 
            dynamoDBScanRequest(
                { "#id": "id"},
                [ "id", "content", "createdAt"],
                tableName,
            );
        expect(response.Items).toMatchObject([
            {
                content: "content first",
                createdAt: "16717623",
                id: "1"
            },
            {
                content: "content fourth",
                createdAt: "16717626",
                id: "4"
            },
            {
                content: "content third",
                createdAt: "16717625",
                id: "3"
            },
            {
                content: "content second",
                createdAt: "16717624",
                id: "2"
            },
        ]);
        //expect(spy).toHaveBeenCalledWith(`- (Brown, 13)`);
        //expect(spy).toHaveBeenCalledWith(`Bluejay - (Blue, 9)`);
        //expect(spy).toHaveBeenCalledWith(`Parrot - (Green, 1250)`);
    });
});



