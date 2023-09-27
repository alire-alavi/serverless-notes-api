import { util } from '@aws-appsync/utils';

export function request(ctx) {
  let args = ctx.arguments.input;
  args.modifiedAt = util.time.nowEpochSeconds();
  const keyObj = { "id": ctx.arguments.id }
  return {
    operation: 'Invoke',
    payload: { field: ctx.info.fieldName, arguments: args, key: keyObj },
  };
}

export function response(ctx) {
  return ctx.result.Attributes;
}

