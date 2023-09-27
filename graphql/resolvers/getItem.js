export function request(ctx) {
  const args = ctx.args
  return {
    operation: 'Invoke',
    payload: { field: ctx.info.fieldName, arguments: args},
  };
}

export function response(ctx) {
  return ctx.result.Item;
}
