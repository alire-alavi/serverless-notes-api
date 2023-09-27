export function request(ctx) {
  const args = [
    "id",      
    "title",      
    "content",      
    "createdAt",      
    "modifiedAt"
  ]
  const keyObj = { "#id": "id" };
  return {
    operation: 'Invoke',
    payload: { field: ctx.info.fieldName, arguments: args, key: keyObj },
  };
}

export function response(ctx) {
  return ctx.result.Items;
}

