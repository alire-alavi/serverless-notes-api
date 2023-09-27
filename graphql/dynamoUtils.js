import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
    DeleteCommand, DynamoDBDocumentClient , GetCommand, PutCommand, UpdateCommand, ScanCommand
} from "@aws-sdk/lib-dynamodb";

function clientConfig() { 
    if (process.env.LOCAL_DB) {
      return { endpoint: "http://localhost:8000" };
    }
    return {};
}

const client = new DynamoDBClient(clientConfig());
const docClient = DynamoDBDocumentClient.from(client);

export async function execDynamoDocCommand(command) { 
    try { 
        const response = await docClient.send(command);
        return response;
    } catch (error) { 
        console.error("DynamoDb Commnad Execution Error: {}", error);
        throw error;
    }
}

export function dynamodbPutRequest(values, tableName) {
    const command = new PutCommand({
        TableName: tableName,
        Item: values,
        ReturnValues: "ALL_OLD"
    });
    return execDynamoDocCommand(command);
}

export function dynamodbDeleteRequest(key, tableName) {
    const command = new DeleteCommand({
        TableName: tableName,
        Key: key,
        ReturnValues: "ALL_OLD"
    });
    return execDynamoDocCommand(command);
}

export function dynamoDBGetItemRequest(key, tableName) {
    const command = new GetCommand({
        TableName: tableName,
        Key: key
    });
    return execDynamoDocCommand(command);
}

export function dynamoDBScanRequest(expressionAttrName, args, tableName) {
    // create expressions based on resolver's values
    // to pass in to DynamoDB Scan command
    let projectionExpression = "#";
    console.log(args);
    args.forEach((item, index) => {
      projectionExpression+= item;
      if (index < projectionExpression.length - 1) {
        projectionExpression+= ", ";
      }
    });
    projectionExpression = projectionExpression.slice(0, -2);
    console.log("ExpressionAttributeNames", expressionAttrName)
    console.log("ProjectionExpression: ", projectionExpression)
    const command = new ScanCommand({
        TableName: tableName,
        ProjectionExpression: projectionExpression,
        ExpressionAttributeNames: { "#id": "id" }
    });
    
    return execDynamoDocCommand(command);
}

export function dynamodbUpdateRequest(key, args, tableName) {  
  let updateExpression = "";
  let expressionAttrValue = {};

  for (const objKey in args) {
    if (args.hasOwnProperty(objKey)) {
      updateExpression+= `${objKey} = :${objKey}, `;
      
      expressionAttrValue[`:${objKey}`] = args[objKey];
    }
  }
  updateExpression = updateExpression.slice(0, -2);
  console.log(updateExpression);
  console.log(key);
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key, // Key to pass  in 
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeValues: expressionAttrValue,
    ReturnValues: "ALL_NEW",
  });

  return execDynamoDocCommand(command);
};
