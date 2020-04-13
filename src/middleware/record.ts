import * as Knex from 'knex';
import { mysqlConfig } from '../../config';

function connectDB () {
  const knex = Knex({
    client: mysqlConfig.client,
    connection: {
      host: mysqlConfig.host,
      user: mysqlConfig.user,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
    },
    acquireConnectionTimeout: 10000,
    log: {
      warn(message) {
        console.warn(message);
      },
      error(message) {
        console.error(message);
      },
      deprecate(message) {
        console.info(message);
      },
      debug(message) {
        console.log(message);
      },
    }
  });
  
  ; (async () => {
    try {
      let res = await knex.schema.hasTable('url_config');
  
      if (!res) {
        await knex.schema.createTable('url_config', t => {
          t.increments('id').primary();
          t.string('key', 20);
          t.string('url', 1024);
          t.string('other', 150);
          t.string('other1', 150);
        }).then()
      }
    } catch (e) {
      console.error('Error in create table: ', e);
    }
  })();

  return knex;
}

export default async function record(ctx: any, next: () => Promise<any>) {
  let knex: any = {};

  if (ctx.request.url.match(/\/record/i)) {
    knex = connectDB();  
  }
  if (ctx.request.url === '/record/') {
    try {
      let res = await knex.select('*').from('url_config');

      if (res) {
        ctx.body = {
          code: '0',
          info: res,
          msg: ''
        }
      } else {
        ctx.body = {
          code: '1',
          info: {},
          msg: 'no data'
        }
      }

      await knex.destroy();
    } catch (e) {
      console.error('Error in getting all data: ', e);
    }
  }
  if (ctx.request.url === '/record/:id') {
    const { id } = ctx.request.body;

    if (id) {
      try {
        let res = await knex.select(name).from('url_config');

        if (res) {
          ctx.body = {
            code: '0',
            info: res,
            msg: ''
          }
        } else {
          ctx.body = {
            code: '1',
            info: {},
            msg: 'no data'
          }
        }
        await knex.destroy();
      } catch (e) {
        console.error('Error in getting one data: ', e);
      }
    }
  }
  if (ctx.request.url === '/record/:id' && ctx.request.method.toLowerCase() === 'post') { // update
    
  }
  if (ctx.request.url === '/record/' && ctx.request.method.toLowerCase() === 'put') { // create

  }
  if (ctx.request.url === '/record/:id' && ctx.request.method.toLowerCase() === 'delete') {

  }

  await next();
};