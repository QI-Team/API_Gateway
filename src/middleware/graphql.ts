import gql from 'graphql-tag';
import { mysqlConfig } from '../../config';
import { request } from 'http';

import { Sequelize, Dialect } from 'sequelize';
import recordModel from '../lib/model';

interface DbOperator {
  findOne: (options: {}) => Promise<any>;
}

interface RequestOptions {
  method: string,
  body?: string,
  headers: any,
}

const oRequest = function (url: string, options: RequestOptions) {
  return new Promise((resolve, reject) => {
    const req = request(url, options, res => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resolve(chunk);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });
    req.write(options.body);
    req.end();
  })
}

const getQuery = async function (fields: string[], db: DbOperator, options: RequestOptions): Promise<object[]> {
  let response = [];

  try {
    for (let t of fields) {
      let res = await db.findOne({
        where: {
          field: t
        }
      });

      if (res) {
        let r = await oRequest(res.dataValues.value, options) as string;

        response.push(JSON.parse(r).info);
      } else {
        throw new Error(`No data in return with this field: ${res}`);
      }
    }

    return response;
  } catch (e) {
    console.error("Error in line 57 with function getQuery: ", e);
  }
}

/**
 * 
 * @param ctx 
 * @param next
 * proxy, analysis request and transmit request.
 */
export default async function graphQL(ctx: any, next: () => Promise<any>) {
  console.log("-----------graphql-----------: ", ctx.request.body);
  if (ctx.request.path === '/graphql' && ctx.request.method === 'POST') {
    const sequelize = new Sequelize(mysqlConfig.database,
      mysqlConfig.user, mysqlConfig.password, {
      host: mysqlConfig.host,
      port: mysqlConfig.port as number,
      dialect: mysqlConfig.client as Dialect,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });


    ; (async () => {
      try {
        await sequelize.authenticate();
        console.log("Connected successfully");
      } catch (e) {
        console.error("Error in line 49: ", e);
      }
    })();

    // content-length的长度与实际传输的大小不一致会导致Parse Error
    delete ctx.request.headers['content-length'];

    let { query, variables } = ctx.request.body;
    let obj = {};

    if (query) {
      obj = gql`${query}`;
      const fields = (obj as any).definitions[0].selectionSet.selections.map((v: object) => (v as any).name.value);

      const options = {
        method: 'post',
        body: JSON.stringify(variables),
        headers: ctx.request.headers,
      }

      let response = await getQuery(fields, recordModel, options);

      console.log('-------response-------', response);
      ctx.body = {
        code: '0',
        info: response,
        msg: 'ok'
      }
    } else {
      throw new Error('Operator must be query or mutate!');
    }
  } else {
    await next();
  }
}