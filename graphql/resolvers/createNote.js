import { util } from '@aws-appsync/utils';

export function request(ctx) {
  console.log(ctx);
  // TODO: handle empty values for title
  const args = ctx.arguments.input
  args.id = util.autoId();
  args.createdAt = util.time.nowEpochSeconds();
  args.modifiedAt = util.time.nowEpochSeconds();
  return {
    operation: 'Invoke',
    payload: { field: ctx.info.fieldName, arguments: args },
  };
}

export function response(ctx) {
  if (ctx.$metadata.httpStatusCode == 200 && !ctx.error) {
    return ctx.arguments.input;
  }
  return ctx.result;
}
