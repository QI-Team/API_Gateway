import { graphiqlKoa } from 'graphql-server-koa';

export default async function graphQL(ctx: any, next: () =>Promise<any>) {

  if (ctx.request.path === '/graphiql') {
    await graphiqlKoa({ endpointURL: 'graphql' })(ctx);
  } else {
    await next();
  }
}