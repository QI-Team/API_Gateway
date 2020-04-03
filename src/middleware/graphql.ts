import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import gql from 'graphql-tag';

/**
 * 
 * @param ctx 
 * @param next
 * proxy, analysis request and transmit request.
 */
export default async function graphQL(ctx: any, next: () => Promise<any>) {
  if (ctx.request.path === '/graphql' && ctx.request.method === 'POST') {
    let { query, mutate } = ctx.request.body;
    let obj = gql`${query}`;
    let field = (obj as any).definitions[0].selectionSet

    console.log('operation', (obj as any).definitions[0].operation);
    console.log('field', field.selections.map((v: object) => (v as any).name.value));

    await next();
  }
}