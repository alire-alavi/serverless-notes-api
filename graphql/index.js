import { dynamodbPutRequest, dynamodbDeleteRequest,
    dynamoDBGetItemRequest, dynamodbUpdateRequest,
    dynamoDBScanRequest,
} from "./dynamoUtils.js";

export const handler = async (event) => {
    console.log(event);
    try { 
        switch (event.field) { 
            case 'createNote':
                return dynamodbPutRequest(event.arguments, "Notes");
            case 'listNotes':
                // pass in pk field and value experssion
                const expressionAttr = { "#id" : "id" };
                return dynamoDBScanRequest(expressionAttr, event.arguments, "Notes");
            case 'getNote':
                return dynamoDBGetItemRequest(event.arguments, "Notes");
            case 'updateNote':
                return dynamodbUpdateRequest(event.key, event.arguments, "Notes");
            case 'deleteNote':
                return dynamodbDeleteRequest(event.arguments, "Notes");
            default:    
                throw new Error('Unknown field, unable to resolve ' + event.field);    
        } 
    } catch (error) { 
        throw error;
    }
}
