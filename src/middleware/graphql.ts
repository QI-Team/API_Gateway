import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa';
import gql from 'graphql-tag';
import { mysqlConfig } from '../../config';
import { request } from 'http';

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
    let fields = (obj as any).definitions[0].selectionSet.selections.map((v: object) => (v as any).name.value)
    let response = [];

    // for (let t of fields) {
    //   let url: any = knex.select(t).from('url_config');
    //   request(url);
    // }
    // console.log('operation', (obj as any).definitions[0].operation);
    // console.log('field', fields);

    ctx.body = {
      router: 'graphsql',
      info: {}
    }
  } else {
    await next();
  }
}